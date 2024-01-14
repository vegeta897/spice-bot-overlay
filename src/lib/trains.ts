import { get } from 'svelte/store'
import { TRAIN } from './constants'
import { normalizeContribution, normalizeHypeData } from './hype'
import {
	addStoreTrain,
	deleteStoreTrain,
	getStoreTrain,
	trains,
	updateStoreTrain,
} from './store'
import type {
	GraceTrainCar,
	GraceTrainData,
	HypeProgress,
	HypeTrainData,
	TrainAddData,
	TrainEndData,
	TrainStartData,
} from 'grace-train-lib/trains'
import { COLOR_NAMES } from 'grace-train-lib'

type TrainBase = {
	id: number
	departTime: number
	endTime?: number
	hideInfo?: boolean
	offScreen?: boolean
	static?: boolean // Use in demo mode only
	endUser?: string
}

type GraceTrain = TrainBase & GraceTrainData
type HypeTrain = TrainBase & HypeTrainData
export type Train = GraceTrain | HypeTrain

export function createTrain({ id, ...startData }: TrainStartData) {
	endAllTrains(id) // End all trains except this one
	const existingTrain = getStoreTrain({ id })
	if (existingTrain) {
		// Update existing train if combo, bits, or subs are different
		if ('grace' in startData && 'grace' in existingTrain) {
			if (startData.grace.combo !== existingTrain.grace.combo) {
				updateStoreTrain({ id, grace: startData.grace })
			}
		} else if ('hype' in startData && 'hype' in existingTrain) {
			if (startData.hype.total !== existingTrain.hype.total) {
				updateStoreTrain({ id, hype: startData.hype })
			}
		}
	} else {
		// Add new train
		const departTime = Date.now() + TRAIN.departDelay
		if ('grace' in startData) {
			addStoreTrain({ id, grace: startData.grace, departTime })
		}
		if ('hype' in startData) {
			addStoreTrain({ id, hype: normalizeHypeData(startData.hype), departTime })
		}
	}
}

export function updateTrain({ id, ...addData }: TrainAddData) {
	const existingTrain = getStoreTrain({ id })! // Guaranteed to exist in websocket.ts
	if (existingTrain.endTime) {
		console.log('Ignoring add event for ended train')
		return
	}
	if ('grace' in addData && 'grace' in existingTrain) {
		updateStoreTrain({
			id,
			grace: {
				...existingTrain.grace,
				combo: addData.grace.combo,
				score: addData.grace.score,
				graces: [...existingTrain.grace.graces, addData.grace.grace],
			},
		})
	} else if ('hype' in addData && 'hype' in existingTrain) {
		const contributions = [...existingTrain.hype.contributions]
		if (addData.hype.contribution) {
			contributions.push(...normalizeContribution(addData.hype.contribution))
		} else delete addData.hype.contribution
		updateStoreTrain({ id, hype: { ...addData.hype, contributions } })
	}
}

export function endTrain({ id, ...endData }: TrainEndData, hideInfoNow = false) {
	const existingTrain = getStoreTrain({ id })
	if (!existingTrain) {
		console.log('Ignoring end event for unknown train')
		return
	}
	let train: null | Train = null
	let endDelay = 0
	const endTime = Date.now()
	if ('grace' in endData && 'grace' in existingTrain) {
		train = updateStoreTrain({
			id,
			endTime,
			endUser: endData.grace.username,
			grace: {
				...existingTrain.grace,
				combo: endData.grace.combo,
				score: endData.grace.score,
			},
		})!
		endDelay = Math.floor(endData.grace.combo / TRAIN.endInfoLengthPerSecond) * 1000
	} else if ('hype' in endData && 'hype' in existingTrain) {
		train = updateStoreTrain({
			id,
			endTime,
			hype: { ...existingTrain.hype, ...endData.hype },
		})!
		endDelay = 10 * 1000
	}
	const endInfoDuration = hideInfoNow ? 0 : TRAIN.endInfoDuration + endDelay
	setTimeout(() => {
		train = updateStoreTrain({ id: train!.id, hideInfo: true })!
		if (!train) return
		if (train.offScreen) deleteStoreTrain(train)
	}, endInfoDuration)
}

export function endAllTrains(exceptID?: number) {
	// End all trains that are still going
	get(trains).forEach((train) => {
		if (train.endTime || train.id === exceptID) return
		if ('hype' in train) {
			endTrain(train)
		} else if ('grace' in train) {
			endTrain({ ...train, grace: { ...train.grace, username: '' } })
		}
	})
}

export function hideUser(userId: string) {
	// Change user's depot car to a default color stripe
	get(trains).forEach((train) => {
		if (!('grace' in train)) return // Not a grace train
		if (!train.grace.graces.some((g) => g.userId === userId)) return // User not in train
		updateStoreTrain({
			id: train.id,
			grace: {
				...train.grace,
				graces: train.grace.graces.map((grace) => {
					if ('depotCar' in grace && grace.userId === userId)
						return { userId, color: COLOR_NAMES.POP.POP }
					return grace
				}),
			},
		})
	})
}

export const getTrainSize = (train: Train) =>
	'hype' in train ? train.hype.contributions.length : train.grace.combo

export const getTrainWidth = (train: Train) => {
	const trainSize = getTrainSize(train)
	if ('hype' in train)
		return (
			TRAIN.engineWidthGoldPlusMargin +
			TRAIN.carWidthGoldPlusMargin * trainSize +
			(train.hype.graces ? TRAIN.cabooseWidthPlusMargin : 0)
		)
	return (
		TRAIN.engineWidthPlusMargin +
		TRAIN.carWidthPlusMargin * (trainSize - 1) +
		(train.endTime ? TRAIN.cabooseWidthPlusMargin : 0)
	)
}

type Car =
	| ({ type: 'grace' } & GraceTrainCar)
	| {
			type: 'hype'
			color: string | null
			bitsOrSubs: HypeProgress['type']
			amount: number
	  }

export function graceToCar(grace: GraceTrainData['grace']['graces'][number]): Car {
	return { type: 'grace', ...grace }
}

export function hypeToCar(hype: HypeProgress): Car {
	return { type: 'hype', color: hype.color, bitsOrSubs: hype.type, amount: hype.amount }
}
