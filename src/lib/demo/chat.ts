import { randomElement, randomIntRange } from '../util'
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
	bits?: number
	subs?: number
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

export function initChat(hype = false) {
	runChatLoop(hype)
	// createStaticTrain()
}

export function planTrain(hype = false) {
	const messages: {
		message: ChatMessage
		delay: number
		grace?: GraceInfo
		bits?: number
		subs?: number
	}[] = []
	const graceUsers: Set<string> = new Set()
	let totalScore = 0
	let comboPoints = 0
	let comboSize = 0
	let comboScore = 0
	let lastGraceType: GraceInfo['type']
	const trainSize = hype ? randomIntRange(7, 30) : randomIntRange(30, 50)
	for (let i = 0; i < trainSize; i++) {
		if (hype && (Math.random() < 0.4 || i < 2)) {
			const hypeMessage = createHypeMessage()
			messages.push({
				message: hypeMessage,
				delay: randomIntRange(1, 100) * 80,
				bits: hypeMessage.bits,
				subs: hypeMessage.subs,
			})
		} else {
			const graceMessage = createGraceMessage()
			graceUsers.add(graceMessage.username)
			const graceType = graceMessage.grace
				? 'redeem'
				: graceMessage.highlight
				? 'highlight'
				: 'normal'
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
				delay: randomIntRange(1, 100) * 60,
				grace: graceInfo,
			})
			lastGraceType = graceType
			if (hype) i-- // Graces don't count toward hype train length
		}
	}
	const breakMessage = createTrainBreakingMessage()
	totalScore += comboScore
	const userCountBonus = Math.ceil(totalScore * ((graceUsers.size - 1) / 10))
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

function createGraceMessage(): ChatMessage {
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

function createHypeMessage(): ChatMessage {
	const [username, color] = pickRandom(fakeUsers)
	const cheer = Math.random() < 0.3
	return {
		username,
		color,
		text: '',
		time: getTimeString(),
		bits: cheer && randomElement([1, 100, 200, 250, 500, 1000]),
		subs: !cheer && randomElement([1, 1, 1, 1, 1, 5]),
	}
}

function createTrainBreakingMessage(): ChatMessage {
	const [username, color] = pickRandom(fakeUsers)
	const text = pickRandom(trainBreakingMessages)
	return { username, color, text, time: getTimeString() }
}

function createSpiceBotMessage(endingUser: string, trainLength: number): ChatMessage {
	return {
		username: 'SpiceBot2',
		color: '#ff4500',
		text: `Grace train ended by ${endingUser}! That was ${trainLength} graces!`,
		time: getTimeString(),
	}
}

function createRegretMessage(username: string, color: string): ChatMessage {
	const text = pickRandom(regretMessages)
	return { username, color, text, time: getTimeString() }
}

function createAfterTrainMessage(): ChatMessage {
	const [username, color] = pickRandom(fakeUsers)
	const text = pickRandom(afterTrainMessages)
	return { username, color, text, time: getTimeString() }
}

function getComboScore(comboPoints: number, comboSize: number) {
	comboSize = Math.max(comboSize, 1)
	const userCount = comboSize // For the sake of demonstration
	return Math.ceil(comboPoints * (1 + (comboSize - 1) / 2) * (1 + (userCount - 1) / 5))
}

const getTimeString = () => {
	const now = new Date()
	return `${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, '0')}`
}

const pickRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]
