import { graces } from './store'

let ws: WebSocket
let dead = false

export function initWebsocket() {
	if (ws) ws.close()
	ws = new WebSocket('ws://localhost:3005?key=123456abc')
	ws.addEventListener('open', (event) => {
		console.log('ws opened!')
	})
	ws.addEventListener('close', (event) => {
		if (dead) return
		console.log('ws closed! reconnecting in 5 seconds...')
		setTimeout(initWebsocket, 5 * 1000)
	})
	ws.addEventListener('error', (event) => {
		console.log('ws error!', event)
	})
	ws.addEventListener('message', (event) => {
		console.log('ws message:', event.data)
		graces.update((_graces) => [..._graces, event.data])
	})
}

if (import.meta.hot) {
	import.meta.hot.on('vite:beforeUpdate', (payload) => {
		if (
			!payload.updates.some((u) => u.path.includes('lib/websocket.ts')) &&
			!payload.updates.some((u) => u.path.includes('App.svelte'))
		)
			return
		dead = true
		if (ws) ws.close()
	})
}
