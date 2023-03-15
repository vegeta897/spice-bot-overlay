import { chat } from './store'

type ChatMessage = {
	text: string
	username: string
	time: string
	redeem: boolean
	highlight: boolean
	grace: boolean
}

let interval: number

const CHAT_CHANCE = 0.3
const MAX_MESSAGES = 16

export function initChat() {
	interval = setInterval(() => {
		if (Math.random() < CHAT_CHANCE) createChatMessage()
	}, 500)
}

console.log(0 % 12 || 12)
console.log(1 % 12 || 12)
console.log(12 % 12 || 12)
console.log(16 % 12 || 12)

export function createChatMessage() {
	const now = new Date()
	chat.update((_chat) => {
		const [username, color] = pickRandom(fakeUsers)
		const highlight = Math.random() > 0.5
		const grace = !highlight && Math.random() > 0.5
		return [
			..._chat.slice(-MAX_MESSAGES),
			{
				text: pickRandom(nonGraceMessages),
				username,
				color,
				time: `${now.getHours() % 12 || 12}:${now
					.getMinutes()
					.toString()
					.padStart(2, '0')}`,
				highlight,
				grace,
				redeem: highlight || grace,
			},
		]
	})
}

if (import.meta.hot) {
	import.meta.hot.on('vite:beforeUpdate', (payload) => {
		if (
			!payload.updates.some((u) => u.path.includes('lib/chat.ts')) &&
			!payload.updates.some((u) => u.path.includes('App.svelte'))
		)
			return
		clearInterval(interval)
	})
}

const fakeUsers = [
	['goku798', '#c365b0'],
	['tizzle_rizzle', '#9ffbe2'],
	['verysubsumed', '#ff4a5f'],
	['dalybeet21', '#359bff'],
	['JanyceMaria', '#5f9ea0'],
	['jeesejeep', '#ff69b4'],
	['UnusedSteer', '#e1762a'],
	['kitsu_', '#359dd8'],
	['suzki31', '#ff7f50'],
	['trianglevigor', '#ff69b4'],
	['pglad', '#00e700'],
	['thesleepypiranha', '#aa64ea'],
]

const graceMessages = [
	'grace',
	'GRACE',
	'G R A C E',
	'grace!!!',
	'GRACE!',
	'GRACE TRAIN!',
	'GrAcE',
]
const nonGraceMessages = ["what's up", 'hello everyone!', 'oops']

const pickRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]
