import { get } from 'svelte/store'
import { TRAIN } from './constants'
import { normalizeContribution, normalizeHypeData } from './hype'
import { addTrain, deleteTrain, getTrain, trains, updateTrain } from './store'
import type {
	GraceTrainData,
	HypeTrainData,
	TrainAddData,
	TrainEndData,
	TrainStartData,
} from './websocket'

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
	const existingTrain = getTrain({ id })
	if (existingTrain) {
		// Update existing train if combo, bits, or subs are different
		if ('grace' in startData && 'grace' in existingTrain) {
			if (startData.grace.combo !== existingTrain.grace.combo) {
				updateTrain({ id, grace: startData.grace })
			}
		} else if ('hype' in startData && 'hype' in existingTrain) {
			if (startData.hype.total !== existingTrain.hype.total) {
				updateTrain({ id, hype: startData.hype })
			}
		}
	} else {
		// Add new train
		const departTime = Date.now() + TRAIN.departDelay
		if ('grace' in startData) {
			addTrain({ id, grace: startData.grace, departTime })
		}
		if ('hype' in startData) {
			addTrain({ id, hype: normalizeHypeData(startData.hype), departTime })
		}
	}
}

export function addToTrain({ id, ...addData }: TrainAddData) {
	const existingTrain = getTrain({ id }) // Guaranteed to exist in websocket.ts
	if (existingTrain.endTime) {
		console.log('Ignoring add event for ended train')
		return
	}
	if ('grace' in addData && 'grace' in existingTrain) {
		updateTrain({
			id,
			grace: {
				...existingTrain.grace,
				combo: addData.grace.combo,
				score: addData.grace.score,
				colors: [...existingTrain.grace.colors, addData.grace.color],
			},
		})
	} else if ('hype' in addData && 'hype' in existingTrain) {
		const contributions = [...existingTrain.hype.contributions]
		if (addData.hype.contribution) {
			contributions.push(...normalizeContribution(addData.hype.contribution))
		} else delete addData.hype.contribution
		updateTrain({ id, hype: { ...addData.hype, contributions } })
	}
}

export function endTrain({ id, ...endData }: TrainEndData, hideInfoNow = false) {
	const existingTrain = getTrain({ id })
	if (!existingTrain) {
		console.log('Ignoring end event for unknown train')
		return
	}
	let train: null | Train = null
	let endDelay = 0
	const endTime = Date.now()
	if ('grace' in endData && 'grace' in existingTrain) {
		train = updateTrain({
			id,
			endTime,
			endUser: endData.grace.username,
			grace: {
				...existingTrain.grace,
				combo: endData.grace.combo,
				score: endData.grace.score,
			},
		})
		endDelay = Math.floor(endData.grace.combo / TRAIN.endInfoLengthPerSecond) * 1000
	} else if ('hype' in endData && 'hype' in existingTrain) {
		train = updateTrain({ id, endTime, hype: { ...existingTrain.hype, ...endData.hype } })
		endDelay = 10 * 1000
	}
	const endInfoDuration = hideInfoNow ? 0 : TRAIN.endInfoDuration + endDelay
	setTimeout(() => {
		train = updateTrain({ id: train.id, hideInfo: true })
		if (!train) return
		if (train.offScreen) deleteTrain(train)
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

export const getTrainSize = (train: Train) =>
	'hype' in train ? train.hype.contributions.length : train.grace.combo

export const getTrainWidth = (train: Train) => {
	const trainSize = getTrainSize(train)
	if ('hype' in train)
		return (
			TRAIN.engineWidthGold +
			TRAIN.carWidthGold * trainSize +
			(train.hype.graces ? TRAIN.cabooseWidth : 0)
		)
	return (
		TRAIN.engineWidth +
		TRAIN.carWidth * (trainSize - 1) +
		(train.endTime ? TRAIN.cabooseWidth : 0)
	)
}
