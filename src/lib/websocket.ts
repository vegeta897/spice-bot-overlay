import {
	getTrain,
	setOverlayError,
	setOverlayPosition,
	type OverlayPosition,
} from './store'
import { createTrain, addToTrain, endTrain, endAllTrains } from './trains'

const version = 3 // Should match version on server websocket.ts

let ws: WebSocket
let reloading = false
let invalidKey = false

export function initWebsocket(key: string) {
	if (ws) ws.close()
	reloading = false
	if (!key) {
		setOverlayError('missing-key')
		return
	}
	const wsAddress = import.meta.env.DEV
		? 'ws://localhost:3005'
		: 'wss://' + window.location.hostname
	ws = new WebSocket(`${wsAddress}?key=${key}`)
	ws.addEventListener('open', (event) => {
		console.log('Websocket opened!')
	})
	ws.addEventListener('close', (event) => {
		if (reloading || invalidKey) return
		console.log('Websocket closed! reconnecting in 5 seconds...')
		setTimeout(() => initWebsocket(key), 5 * 1000)
	})
	ws.addEventListener('error', (event) => {
		console.log('Websocket error!', event)
	})
	ws.addEventListener('message', (event) => {
		if (event.data === 'invalid-key') {
			invalidKey = true
			setOverlayError('invalid-key')
			return
		}
		let message: Message
		try {
			message = JSON.parse(event.data)
		} catch (e) {
			console.log('Websocket received non-JSON message:', event.data)
		}
		switch (message.type) {
			case 'init':
				if (message.data.version !== version) {
					setOverlayError('need-reload')
					console.log('App out of date! Reloading page in 15 seconds...')
					setTimeout(() => window.location.reload(), 15 * 1000)
				}
				if (message.data.train) {
					createTrain(message.data.train)
				} else {
					endAllTrains()
				}
				setOverlayPosition(message.data.position)
				break
			case 'train-start':
				createTrain(message.data)
				break
			case 'train-add':
				if (!getTrain(message.data)) {
					console.log('Requesting create event for unknown train')
					ws.send(JSON.stringify({ type: 'train-query', data: { id: message.data.id } }))
				} else {
					addToTrain(message.data)
				}
				break
			case 'train-end':
				endTrain(message.data)
				break
			case 'overlay':
				setOverlayPosition(message.data.position)
				break
			default:
				console.log('Websocket received unrecognized message:', message)
				break
		}
	})
}

// Should match types on server graceEvents.ts and websocket.ts
type ID = { id: number }
type GraceEventBaseData = {
	combo: number
	score: number
}
type HypeEventBaseData = {
	level: number
	total: number
	progress: number
	goal: number
	graces: number
}
export type GraceTrainData = {
	grace: GraceEventBaseData & { colors: string[]; frog?: boolean }
}
type GraceTrainAddData = { grace: GraceEventBaseData & { color: string } }
type GraceTrainEndData = { grace: GraceEventBaseData & { username: string } }
export type HypeTrainData = {
	hype: HypeEventBaseData & { contributions: HypeProgress[] }
}
export type HypeProgress = {
	type: 'bits' | 'subs'
	amount: number
	color: string | null
}
type HypeTrainAddData = { hype: HypeEventBaseData & { contribution?: HypeProgress } }
type HypeTrainEndData = { hype: Omit<HypeEventBaseData, 'progress' | 'goal'> }
export type TrainStartData = ID & (GraceTrainData | HypeTrainData)
export type TrainAddData = ID & (GraceTrainAddData | HypeTrainAddData)
export type TrainEndData = ID & (GraceTrainEndData | HypeTrainEndData)
type Message =
	| {
			type: 'init'
			data: { version: number; train: TrainStartData | false; position: OverlayPosition }
	  }
	| { type: 'train-start'; data: TrainStartData }
	| { type: 'train-add'; data: TrainAddData }
	| { type: 'train-end'; data: TrainEndData }
	| { type: 'overlay'; data: { position: OverlayPosition } }

if (import.meta.hot) {
	import.meta.hot.on('vite:beforeUpdate', (payload) => {
		reloading = true
		if (ws) ws.close()
	})
}
