import { randomIntRange } from '../util'
import { createStaticTrain, runChatLoop } from './loop'
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
	color: string | null
	time: string
	redeem?: boolean
	highlight?: boolean
	grace?: boolean
}

type GraceInfo = {
	type: 'redeem' | 'highlight' | 'normal' | 'end'
	comboSize: number
	comboPoints: number
	comboScore: number
	totalScore: number
}

const POINTS = {
	redeem: 10,
	highlight: 5,
	normal: 1,
}

export function initChat() {
	runChatLoop()
	// createStaticTrain()
}

export function planTrain() {
	const messages: { message: ChatMessage; delay: number; grace?: GraceInfo }[] =
		[]
	const trainUsers: Set<string> = new Set()
	let totalScore = 0
	let comboPoints = 0
	let comboSize = 0
	let comboScore = 0
	let lastGraceType: GraceInfo['type']
	const trainSize = randomIntRange(30, 80)
	for (let i = 0; i < trainSize; i++) {
		const graceMessage = createGraceMessage()
		trainUsers.add(graceMessage.username)
		const graceType = graceMessage.grace
			? 'redeem'
			: graceMessage.highlight
			? 'highlight'
			: 'normal'
		const prevTotal = totalScore + comboScore
		if (lastGraceType && graceType !== lastGraceType) {
			totalScore += comboScore
			comboPoints = 0
			comboSize = 0
		}
		comboPoints += POINTS[graceType]
		comboSize++
		comboScore = getComboScore(comboPoints, comboSize)
		const graceInfo: GraceInfo = {
			type: graceType,
			comboSize,
			comboPoints,
			comboScore,
			totalScore,
		}
		messages.push({
			message: graceMessage,
			delay: randomIntRange(1, 100) * 40,
			grace: graceInfo,
		})
		lastGraceType = graceType
	}
	const breakMessage = createTrainBreakingMessage()
	totalScore += comboScore
	const userCountBonus = Math.ceil(totalScore * ((trainUsers.size - 1) / 10))
	totalScore += userCountBonus
	totalScore = Math.ceil(totalScore)
	messages.push({
		message: breakMessage,
		delay: randomIntRange(1, 30) * 100,
		grace: {
			type: 'end',
			comboSize: 0,
			comboPoints: 0,
			comboScore: 0,
			totalScore,
		},
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
	return { messages }
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

function getComboScore(comboPoints: number, comboSize: number) {
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

const pickRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]
