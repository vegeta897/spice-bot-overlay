import { get, writable, type Writable } from 'svelte/store'
import type { Train } from './trains'

export type OverlayError = null | 'need-reload' | 'missing-key' | 'invalid-key'
export type OverlayPosition = 'top' | 'bottom'

export const overlayStatus: Writable<{
	error: OverlayError
	position: OverlayPosition
}> = writable({ auth: 'init', error: null, position: 'bottom' })

export function setOverlayError(error: OverlayError) {
	overlayStatus.update((status) => ({ ...status, error }))
}
export function setOverlayPosition(position: OverlayPosition) {
	overlayStatus.update((status) => ({ ...status, position }))
}

export const trains: Writable<Train[]> = writable([])

export const getTrain = (train: Pick<Train, 'id'>) =>
	get(trains).find((t) => t.id === train.id)

export function addTrain(train: Train) {
	trains.update((gt) => [...gt, train])
}

export function updateTrain(train: Pick<Train, 'id'> & Partial<Train>) {
	const existingTrain = getTrain(train)
	const updatedTrain = { ...existingTrain, ...train }
	trains.update((gt) => {
		gt.splice(
			gt.findIndex((t) => t.id === train.id),
			1,
			updatedTrain
		)
		return [...gt]
	})
	return updatedTrain
}

export function deleteTrain(train: Train) {
	if (!getTrain(train)) return
	trains.update((trains) => [...trains.filter((t) => t.id !== train.id)])
}

// Demo only
export const chat = writable([])
