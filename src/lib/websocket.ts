import { graceTrains, setAuthStatus } from './store'

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
	ws = new WebSocket(`ws://localhost:3005?key=${key}`)
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
		// console.log('Websocket message:', event.data)
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
			case 'start':
				console.log('train start!', message.data)
				break
			case 'add':
				console.log('train add!', message.data)
				break
			case 'end':
				console.log('train end!', message.data)
				break
			default:
				console.log('Websocket unrecognized message:', message)
				break
		}
		// graceTrains.update((_graces) => [..._graces, event.data])
	})
}

type TrainEventBaseData = { id: number; combo: number; score: number }
type TrainStartData = TrainEventBaseData & { colors: string[] }
type TrainAddData = TrainEventBaseData & { color: string }
type TrainEndData = TrainEventBaseData & { username: string }
type Message =
	| { type: 'start'; data: TrainStartData }
	| { type: 'add'; data: TrainAddData }
	| { type: 'end'; data: TrainEndData }

if (import.meta.hot) {
	import.meta.hot.on('vite:beforeUpdate', (payload) => {
		reloading = true
		if (ws) ws.close()
	})
}
