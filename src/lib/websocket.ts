import { graceTrains } from './store'

let ws: WebSocket
let reloading = false

export function initWebsocket() {
	if (ws) ws.close()
	reloading = false
	ws = new WebSocket('ws://localhost:3005?key=123456abc')
	ws.addEventListener('open', (event) => {
		console.log('ws opened!')
	})
	ws.addEventListener('close', (event) => {
		if (reloading) return
		console.log('ws closed! reconnecting in 5 seconds...')
		setTimeout(initWebsocket, 5 * 1000)
	})
	ws.addEventListener('error', (event) => {
		console.log('ws error!', event)
	})
	ws.addEventListener('message', (event) => {
		console.log('ws message:', event.data)
		graceTrains.update((_graces) => [..._graces, event.data])
	})
}

if (import.meta.hot) {
	import.meta.hot.on('vite:beforeUpdate', (payload) => {
		reloading = true
		if (ws) ws.close()
	})
}
