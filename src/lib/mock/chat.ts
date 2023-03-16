import { chat, graces } from '../store'

type ChatMessage = {
	text: string
	username: string
	time: string
	redeem: boolean
	highlight: boolean
	grace: boolean
}

let reloading = false
let interval: number

const MAX_MESSAGES = 18

export function initChat() {
	if (interval) clearInterval(interval)
	reloading = false
	runLoop()
}

async function runLoop() {
	while (!reloading) {
		// await sleep(randomIntRange(6, 12) * 1000)
		graces.set([])
		const { messages, trainSize } = planTrain()
		console.log(`simulating train size ${trainSize}`)
		for (const message of messages) {
			if (reloading) break
			await sleep(message.delay)
			chat.update((_chat) => [..._chat.slice(-MAX_MESSAGES), message.message])
			if (message.grace)
				graces.update((_graces) => [..._graces, _graces.length + 1])
		}
	}
}

function planTrain() {
	const trainSize = randomIntRange(8, 24)
	const messages = []
	for (let i = 0; i < trainSize; i++) {
		messages.push({
			message: createGraceMessage(),
			delay: randomIntRange(1, 30) * 100,
			grace: true,
		})
	}
	const breakMessage = createTrainBreakingMessage()
	messages.push({
		message: breakMessage,
		delay: randomIntRange(1, 30) * 100,
	})
	messages.push({
		message: createSpiceBotMessage(breakMessage.username, trainSize),
		delay: 300,
	})
	if (Math.random() < 0.5) {
		messages.push({
			message: createRegretMessage(breakMessage.username, breakMessage.color),
			delay: randomIntRange(5, 15) * 100,
		})
	}
	const afterTrainMessageCount = randomIntRange(1, 4)
	for (let i = 0; i < afterTrainMessageCount; i++) {
		messages.push({
			message: createAfterTrainMessage(),
			delay: randomIntRange(3, 10) * 100,
		})
	}
	return { messages, trainSize }
}

function createGraceMessage() {
	const [username, color] = pickRandom(fakeUsers)
	const grace = Math.random() < 0.9
	const highlight = !grace && Math.random() < 0.8
	return {
		username,
		color,
		text: pickRandom(graceMessages),
		time: getTimeString(),
		grace,
		highlight,
		redeem: highlight || grace,
	}
}

function createTrainBreakingMessage() {
	const [username, color] = pickRandom(fakeUsers)
	const text = pickRandom(trainBreakingMessages)
	return { username, color, text, time: getTimeString() }
}

function createSpiceBotMessage(endingUser: string, trainLength: number) {
	return {
		username: 'SpiceBot2',
		color: '#ff4500',
		text: `Grace train ended by ${endingUser}! That was ${trainLength} graces!`,
		time: getTimeString(),
	}
}

function createRegretMessage(username: string, color: string) {
	const text = pickRandom(regretMessages)
	return { username, color, text, time: getTimeString() }
}

function createAfterTrainMessage() {
	const [username, color] = pickRandom(fakeUsers)
	const text = pickRandom(afterTrainMessages)
	return { username, color, text, time: getTimeString() }
}

if (import.meta.hot) {
	import.meta.hot.on('vite:beforeUpdate', (payload) => {
		reloading = true
		clearInterval(interval)
	})
}

const fakeUsers = [
	['goku798', '#c365b0'],
	['dazzle_razzle', '#9ffbe2'],
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
	['LookItsArcher', '#ff69b4'],
	['pizzapoggers', '#e1762a'],
	['hottopicgraduate', '#00ff7f'],
	['ftarbl', '#00ff7f'],
]

const graceMessages = [
	'grace',
	'GRACE',
	'G R A C E',
	'grace!!!',
	'GRACE!',
	'GRACE TRAIN!',
	'GrAcE',
	'🙏',
]
const trainBreakingMessages = [
	'c-c-c-combo breaker!',
	'hello everyone!',
	'lol',
	'wow',
	'woah',
	"what's happening?",
	"what's going on?",
]
const regretMessages = [
	'LOL SORRY',
	'oh oops',
	'OH GOD',
	'OH NO I BROKE IT',
	'oops sorry',
]
const afterTrainMessages = [
	'that was great',
	'good grace train',
	'very good grace train',
	'very good',
	'good work everyone',
	'that was a long one',
	'you broke it',
	'lol',
	'haha',
	'nice',
]

const getTimeString = () => {
	const now = new Date()
	return `${now.getHours() % 12 || 12}:${now
		.getMinutes()
		.toString()
		.padStart(2, '0')}`
}

const randomIntRange = (minOrMax: number, max?: number) => {
	const min = max === undefined ? 0 : minOrMax
	const range = max === undefined ? minOrMax : max - minOrMax
	return Math.floor(min + Math.random() * range)
}

const pickRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
