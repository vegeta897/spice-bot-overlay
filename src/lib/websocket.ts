import { getTrain, setAuthStatus } from './store'
import { createTrain, addToTrain, endTrain, endAllTrains } from './trains'

const version = 1 // Should match version on server websocket.ts

let ws: WebSocket
let reloading = false
let invalidKey = false

export function initWebsocket(key: string) {
	if (ws) ws.close()
	reloading = false
	if (!key) {
		setAuthStatus('missing-key')
		return
	}
	const wsAddress = import.meta.env.DEV
		? 'localhost:3005'
		: window.location.hostname
	ws = new WebSocket(`ws://${wsAddress}?key=${key}`)
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
			setAuthStatus('invalid-key')
			return
		}
		let message: Message
		try {
			message = JSON.parse(event.data)
		} catch (e) {
			console.log('Websocket received non-JSON message:', event.data)
		}
		switch (message.type) {
			case 'train-start':
				createTrain(message.data)
				break
			case 'train-add':
				if (!getTrain(message.data)) {
					console.log('Requesting create event for unknown train')
					ws.send(
						JSON.stringify({
							type: 'train-query',
							data: { id: message.data.id },
						})
					)
				} else {
					addToTrain(message.data)
				}
				break
			case 'train-end':
				endTrain(message.data)
				break
			case 'init':
				if (message.data.version !== version) {
					// Reload page after 15s
					console.log('App out of date! Reloading page in 15 seconds...')
					setTimeout(() => window.location.reload(), 15 * 1000)
				}
				if (message.data.noTrains) endAllTrains()
				break
			default:
				console.log('Websocket received unrecognized message:', message)
				break
		}
	})
}

// Should match types on server graceEvents.ts and websocket.ts
type TrainEventBaseData = { id: number; combo: number; score: number }
export type TrainStartData = TrainEventBaseData & { colors: string[] }
export type TrainAddData = TrainEventBaseData & { color: string }
export type TrainEndData = TrainEventBaseData & { username: string }
type Message =
	| { type: 'init'; data: { version: number; noTrains: boolean } }
	| { type: 'train-start'; data: TrainStartData }
	| { type: 'train-add'; data: TrainAddData }
	| { type: 'train-end'; data: TrainEndData }

if (import.meta.hot) {
	import.meta.hot.on('vite:beforeUpdate', (payload) => {
		reloading = true
		if (ws) ws.close()
	})
}
