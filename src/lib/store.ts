import { writable, type Writable } from 'svelte/store'
import type { Train } from './mock/loop'

export const graceTrains: Writable<Train[]> = writable([])
export const chat = writable([])

export function deleteTrain(train: Train) {
	graceTrains.update((trains) => [...trains.filter((t) => t !== train)])
}
