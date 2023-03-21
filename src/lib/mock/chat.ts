import { runChatLoop } from './loop'
import {
	fakeUsers,
	graceMessages,
	trainBreakingMessages,
	regretMessages,
	afterTrainMessages,
} from './strings'

type ChatMessage = {
	text: string
	username: string
	time: string
	redeem?: boolean
	highlight?: boolean
	grace?: boolean
}

type GraceInfo = {
	type: 'redeem' | 'highlight' | 'normal'
	comboSize: number
	comboScore: number
	totalScore: number
}

const POINTS = {
	redeem: 10,
	highlight: 5,
	normal: 1,
}

export function initChat() {
	console.log('initChat()')
	runChatLoop()
}

export function planTrain() {
	const trainSize = randomIntRange(8, 24)
	const messages: { message: ChatMessage; delay: number; grace?: GraceInfo }[] =
		[]
	let totalScore = 0
	let comboScore = 0
	let comboSize = 0
	let lastGraceType: GraceInfo['type']
	for (let i = 0; i < trainSize; i++) {
		const graceMessage = createGraceMessage()
		const graceType = graceMessage.grace
			? 'redeem'
			: graceMessage.highlight
			? 'highlight'
			: 'normal'
		if (lastGraceType && graceType !== lastGraceType) {
			const endedCombo = endCombo(comboScore, comboSize)
			totalScore += endedCombo
			comboScore = 0
			comboSize = 0
		}
		comboScore += POINTS[graceType]
		comboSize++
		const graceInfo: GraceInfo = {
			type: graceType,
			comboSize,
			comboScore,
			totalScore,
		}
		messages.push({
			message: graceMessage,
			delay: randomIntRange(1, 30) * 100,
			grace: graceInfo,
		})
		lastGraceType = graceType
	}
	const endedCombo = endCombo(comboScore, comboSize)
	totalScore += endedCombo
	const breakMessage = createTrainBreakingMessage()
	messages.push({
		message: breakMessage,
		delay: randomIntRange(1, 30) * 100,
		grace: { type: lastGraceType, comboSize, comboScore, totalScore },
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

// if (import.meta.hot) {
// 	import.meta.hot.on('vite:beforeUpdate', (payload) => {
// 		reloading = true
// 	})
// }

function endCombo(comboPoints: number, comboSize: number) {
	comboSize = Math.max(comboSize, 1)
	const userCount = comboSize // For the sake of demonstration
	return Math.ceil(
		comboPoints * (1 + (comboSize - 1) / 2) * (1 + (userCount - 1) / 5)
	)
}

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
