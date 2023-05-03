import { get } from 'svelte/store'
import { TRAIN } from './constants'
import { addTrain, deleteTrain, getTrain, trains, updateTrain } from './store'
import type { RequireAtLeastOne } from './util'
import type {
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
}

type GraceStats = {
	colors: string[]
	combo: number
	score: number
	endUser?: string
}

// A train must have a grace or hype property, or both
export type Train = TrainBase &
	RequireAtLeastOne<{ grace: GraceStats; hype: HypeTrainData }>

export function createTrain({ id, grace, hype }: TrainStartData) {
	endAllTrains(id) // End all trains except this one
	const existingTrain = getTrain({ id })
	if (existingTrain) {
		// Update existing train if combo, bits, or subs are different
		const trainUpdate: Partial<Train> = { id }
		if (grace && grace.combo !== existingTrain.grace?.combo) {
			trainUpdate.grace = grace
		}
		if (
			hype &&
			(hype.totalBits !== existingTrain.hype?.totalBits ||
				hype.totalSubs !== existingTrain.hype?.totalSubs)
		) {
			trainUpdate.hype = hype
		}
		if (trainUpdate.grace || trainUpdate.hype) {
			updateTrain(trainUpdate as Train)
		}
	} else {
		// Add new train
		const train: Partial<Train> = { id }
		if (grace) train.grace = grace
		if (hype) train.hype = hype
		addTrain({ ...(train as Train), departTime: Date.now() + TRAIN.departDelay })
	}
}

export function addToTrain({ id, grace, hype }: TrainAddData) {
	const existingTrain = getTrain({ id }) // Guaranteed to exist in websocket.ts
	if (existingTrain.endTime) {
		console.log('Ignoring add event for ended train')
		return
	}
	const trainUpdate: Partial<Train> = { id }
	if (grace) {
		trainUpdate.grace = {
			combo: grace.combo,
			score: grace.score,
			colors: [...existingTrain.grace.colors, grace.color],
		}
	}
	if (hype) {
		const contributions = [...existingTrain.hype.contributions]
		if (hype.contribution) contributions.push(hype.contribution)
		trainUpdate.hype = {
			totalBits: hype.totalBits,
			totalSubs: hype.totalSubs,
			total: hype.total,
			progress: hype.progress,
			level: hype.level,
			goal: hype.goal,
			contributions,
		}
	}
	updateTrain(trainUpdate as Train)
}

export function endTrain({ id, grace, hype }: TrainEndData, hideInfoNow = false) {
	endAllTrains(id) // End all trains except this one
	const existingTrain = getTrain({ id })
	if (!existingTrain) {
		console.log('Ignoring end event for unknown train')
		return
	}
	const trainUpdate: Partial<Train> = { id, endTime: Date.now() }
	if (grace) {
		trainUpdate.grace = {
			...existingTrain.grace,
			combo: grace.combo,
			score: grace.score,
			endUser: grace.username,
		}
	}
	if (hype) {
		trainUpdate.hype = {
			...existingTrain.hype,
			totalBits: hype.totalBits,
			totalSubs: hype.totalSubs,
		}
	}
	let train = updateTrain(trainUpdate as Train)
	const graceEndTime = grace
		? Math.floor(grace.combo / TRAIN.endInfoLengthPerSecond) * 1000
		: 0
	const hypeEndTime = hype ? 10 * 1000 : 0
	const endInfoDuration = hideInfoNow
		? 0
		: TRAIN.endInfoDuration + Math.max(graceEndTime, hypeEndTime)
	setTimeout(() => {
		train = updateTrain({ id: train.id, hideInfo: true })
		if (train.offScreen) deleteTrain(train)
	}, endInfoDuration)
}

export function endAllTrains(exceptID?: number) {
	// End all trains that are still going
	get(trains).forEach((train) => {
		if (train.endTime || train.id === exceptID) return
		const trainEnd: Partial<TrainEndData> = { id: train.id }
		if (train.hype) trainEnd.hype = train.hype
		else if (train.grace) trainEnd.grace = { ...train.grace, username: 'Somebody' }
		endTrain(trainEnd as TrainEndData, true)
	})
}

export const getTrainSize = (train: Train) =>
	train.hype ? train.hype.contributions.length : train.grace.combo

export const getTrainWidth = (train: Train) => {
	const trainSize = getTrainSize(train)
	if (train.hype)
		return (
			TRAIN.engineWidthGold +
			TRAIN.carWidthGold * trainSize +
			(train.grace ? TRAIN.cabooseWidth : 0)
		)
	return TRAIN.engineWidth + TRAIN.carWidth * (trainSize - 1)
}
