import { get, writable, type Writable } from 'svelte/store'
import type { Train } from './trains'

type AuthStatus = 'init' | 'missing-key' | 'invalid-key' | 'success'

export const overlayStatus: Writable<{
	auth: AuthStatus
}> = writable({ auth: 'init' })

export function setAuthStatus(authStatus: AuthStatus) {
	overlayStatus.update((status) => ({ ...status, auth: authStatus }))
}

export const graceTrains: Writable<Train[]> = writable([])

export const getTrain = (train: Pick<Train, 'id'>) =>
	get(graceTrains).find((t) => t.id === train.id)

export function updateTrain(train: Pick<Train, 'id'> & Partial<Train>) {
	const existingTrain = getTrain(train)
	const updatedTrain = { ...existingTrain, ...train }
	graceTrains.update((gt) => {
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
	graceTrains.update((trains) => [...trains.filter((t) => t.id !== train.id)])
}

// Mock only
export const chat = writable([])
