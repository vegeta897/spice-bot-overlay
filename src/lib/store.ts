import { writable, type Writable } from 'svelte/store'
import type { Train } from './mock/loop'

export const graceTrains: Writable<Train[]> = writable([])
export const chat = writable([])
