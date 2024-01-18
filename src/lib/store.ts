import { get, writable, type Writable } from 'svelte/store'
import type { Train } from './trains'
import type { OverlayOptions } from 'grace-train-lib/data'

export type OverlayError = null | 'need-reload' | 'missing-key' | 'invalid-key'

export const overlayStatus: Writable<
	{
		error: OverlayError
	} & OverlayOptions
> = writable({ auth: 'init', error: null, position: 'bottom' })

export function setOverlayError(error: OverlayError) {
	overlayStatus.update((status) => ({ ...status, error }))
}
export function setOverlayPosition(position: OverlayOptions['position']) {
	overlayStatus.update((status) => ({ ...status, position }))
}

export const trains: Writable<Train[]> = writable([])

export const getStoreTrain = (train: Pick<Train, 'id'>): Train | undefined =>
	get(trains).find((t) => t.id === train.id)

export function addStoreTrain(train: Train) {
	trains.update((gt) => [...gt, train])
}

export function updateStoreTrain(train: Pick<Train, 'id'> & Partial<Train>) {
	const existingTrain = getStoreTrain(train)
	if (!existingTrain) {
		console.log('Tried to update unknown train ID', train.id)
		return
	}
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

export function deleteStoreTrain(train: Train) {
	if (!getStoreTrain(train)) return
	trains.update((trains) => [...trains.filter((t) => t.id !== train.id)])
}
