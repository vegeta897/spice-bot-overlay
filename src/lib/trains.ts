import { get } from 'svelte/store'
import { TRAIN } from './constants'
import { deleteTrain, getTrain, trains, updateTrain } from './store'
import type { RequireAtLeastOne } from './util'
import type { TrainAddData, TrainEndData, TrainStartData } from './websocket'

// TODO: Idea: Grace trains are unbreakable during hype trains
// This solves the issue of having multiple grace trains associated with one hype train
// And avoids having to announce grace trains ending while the hype train is still going

type TrainBase = {
	id: number
	departTime: number
	endTime?: number
	hideInfo?: boolean
	offScreen?: boolean
}

type GraceStats = {
	colors: string[]
	combo: number
	score: number
	endUser?: string
}

type HypeStats = {
	colors: string[]
	bits: number
	subs: number
}

// A train must have a grace or hype property, or both
export type Train = TrainBase & RequireAtLeastOne<{ grace: GraceStats; hype: HypeStats }>

export function createTrain(trainStartData: TrainStartData) {
	endAllTrains(trainStartData.id) // End all trains except this one
	const existingTrain = getTrain(trainStartData)
	if (existingTrain) {
		// Update existing train if combo different
		if (existingTrain.combo !== trainStartData.combo) updateTrain(trainStartData)
	} else {
		// Add new train
		trains.update((gt) => [
			...gt,
			{ ...trainStartData, departTime: Date.now() + TRAIN.departDelay },
		])
	}
}

export function addToTrain(trainAddData: TrainAddData) {
	const existingTrain = getTrain(trainAddData)
	if (existingTrain.endTime) {
		console.log('Ignoring add event for ended train')
		return
	}
	updateTrain({
		id: trainAddData.id,
		combo: trainAddData.combo,
		score: trainAddData.score,
		colors: [...existingTrain.colors, trainAddData.color],
	})
}

export function endTrain(trainEndData: TrainEndData, hideInfoNow = false) {
	endAllTrains(trainEndData.id) // End all trains except this one
	const existingTrain = getTrain(trainEndData)
	if (!existingTrain) {
		console.log('Ignoring end event for unknown train')
		return
	}
	const now = Date.now()
	const train = updateTrain({
		id: trainEndData.id,
		combo: trainEndData.combo,
		score: trainEndData.score,
		colors: existingTrain.colors,
		endUser: trainEndData.username,
		endTime: now,
	})
	const endInfoDuration =
		TRAIN.endInfoDuration + Math.floor(train.combo / TRAIN.endInfoLengthPerSecond) * 1000
	setTimeout(() => {
		updateTrain({ id: train.id, hideInfo: true })
		if (train.offScreen) deleteTrain(train)
	}, endInfoDuration)
}

export function endAllTrains(exceptID?: number) {
	// End all trains that are still going
	get(trains).forEach((train) => {
		if (!train.endUser && train.id !== exceptID)
			endTrain(
				{
					id: train.id,
					combo: train.combo,
					score: train.score,
					username: 'Somebody',
				},
				true
			)
	})
}

export const getTrainWidth = (combo: number, gold = false) =>
	(gold ? TRAIN.engineWidthGold : TRAIN.engineWidth) +
	(gold ? TRAIN.carWidthGold : TRAIN.carWidth) * (combo - 1)
