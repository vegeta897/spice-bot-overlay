import { getStoreTrain, setOverlayError, setOverlayPosition } from './store'
import { createTrain, updateTrain, endTrain, endAllTrains, blockUser } from './trains'
import type { TrainWSMessage } from 'grace-train-lib/trains'

const version = 4 // Should match version on server websocket.ts

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
		let message: TrainWSMessage
		try {
			message = JSON.parse(event.data)
		} catch (e) {
			console.log('Websocket received non-JSON message:', event.data)
			return
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
				if (!getStoreTrain(message.data)) {
					console.log('Requesting create event for unknown train')
					ws.send(JSON.stringify({ type: 'train-query', data: { id: message.data.id } }))
				} else {
					updateTrain(message.data)
				}
				break
			case 'train-end':
				endTrain(message.data)
				break
			case 'overlay':
				setOverlayPosition(message.data.position)
				break
			case 'block-user':
				blockUser(message.data.userId)
				break
			default:
				console.log('Websocket received unrecognized message:', message)
				break
		}
	})
}

if (import.meta.hot) {
	import.meta.hot.on('vite:beforeUpdate', (payload) => {
		reloading = true
		if (ws) ws.close()
	})
}
