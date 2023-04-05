import { writable, type Writable } from 'svelte/store'
import type { Train } from './mock/loop'

type AuthStatus = 'init' | 'missing-key' | 'invalid-key' | 'success'

export const status: Writable<{
	auth: AuthStatus
}> = writable({ auth: 'init' })

export function setAuthStatus(authStatus: AuthStatus) {
	status.update((_status) => ({ ..._status, auth: authStatus }))
}

export const graceTrains: Writable<Train[]> = writable([])

export function deleteTrain(train: Train) {
	graceTrains.update((trains) => [...trains.filter((t) => t !== train)])
}

// Mock only
export const chat = writable([])
