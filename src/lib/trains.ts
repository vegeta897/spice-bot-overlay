import { get } from 'svelte/store'
import { TRAIN } from './constants'
import { deleteTrain, getTrain, graceTrains, updateTrain } from './store'
import type { TrainAddData, TrainEndData, TrainStartData } from './websocket'

export type Train = {
	id: number
	colors: string[]
	combo: number
	score: number
	departTime: number
	endUser?: string
	endTime?: number
	hideInfo?: boolean
	offScreen?: boolean
}

export function createTrain(trainStartData: TrainStartData) {
	endAllTrains(trainStartData.id) // End all trains except this one
	const existingTrain = getTrain(trainStartData)
	if (existingTrain && existingTrain.combo !== trainStartData.combo) {
		// Update existing train
		updateTrain(trainStartData)
	} else {
		// Add new train
		graceTrains.update((gt) => [
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
		TRAIN.endInfoDuration +
		Math.floor(train.combo / TRAIN.endInfoLengthPerSecond) * 1000
	setTimeout(() => {
		updateTrain({ id: train.id, hideInfo: true })
		if (train.offScreen) deleteTrain(train)
	}, endInfoDuration)
}

export function endAllTrains(except?: number) {
	// End all trains that are still going
	get(graceTrains).forEach((train) => {
		if (!train.endUser && train.id !== except)
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

export const getTrainWidth = (combo: number) =>
	TRAIN.engineWidth + TRAIN.carWidth * (combo - 1)
