import { randomElement, randomIntRange } from '../util'
import {
	fakeUsers,
	graceMessages,
	trainBreakingMessages,
	regretMessages,
	afterGraceTrainMessages,
	afterHypeTrainMessages,
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
	type: 'redeem' | 'highlight' | 'normal'
	comboSize: number
	comboPoints: number
	comboScore: number
	totalScore: number
}

type HypeInfo = {
	bits?: number
	subs?: number
	total: number
	progress: number
	level: number
	goal: number
}

const POINTS = {
	redeem: 10,
	highlight: 5,
	normal: 1,
}

export function planTrain(hypeMode = false) {
	const messages: {
		message: ChatMessage
		delay: number
		grace?: GraceInfo
		hype?: HypeInfo
		end?: boolean
	}[] = []
	const graceUsers: Set<string> = new Set()
	let totalScore = 0
	let comboPoints = 0
	let comboSize = 0
	let comboScore = 0
	let lastGraceType: GraceInfo['type']
	let graces = 0
	let hypeTotal = 0
	let hypeProgress = 0
	let hypeLevel = 1
	let hypeContributions = 0
	let goal = 1000 + hypeLevel * 500
	const trainSize = hypeMode ? randomIntRange(10, 25) : randomIntRange(30, 50)
	while (
		(hypeMode && hypeContributions < trainSize) ||
		(!hypeMode && graces < trainSize)
	) {
		if (hypeMode && (Math.random() < 0.4 || hypeContributions < 3) /*&& graces > 5*/) {
			hypeContributions++
			const hypeMessage = createHypeMessage()
			if (hypeContributions > 3) {
				const points = (hypeMessage.bits || 0) + (hypeMessage.subs || 0) * 500
				hypeTotal += points
				hypeProgress += points
				while (hypeProgress >= goal) {
					hypeProgress = hypeProgress - goal
					hypeLevel++
					goal = 1000 + hypeLevel * 500
				}
			}
			messages.push({
				message: hypeMessage,
				delay: randomIntRange(1, 100) * 50,
				hype: {
					bits: hypeMessage.bits,
					subs: hypeMessage.subs,
					total: hypeTotal,
					progress: hypeProgress,
					level: hypeLevel,
					goal,
				},
			})
		} else {
			graces++
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
				delay: randomIntRange(1, 100) * 30,
				grace: graceInfo,
			})
			lastGraceType = graceType
		}
	}
	if (!hypeMode) {
		const breakMessage = createTrainBreakingMessage()
		messages.push({
			message: breakMessage,
			delay: randomIntRange(1, 30) * 100,
			end: true,
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
	}
	const afterTrainMessageCount = hypeMode ? randomIntRange(3, 7) : randomIntRange(1, 4)
	for (let i = 0; i < afterTrainMessageCount; i++) {
		messages.push({
			message: createAfterTrainMessage(hypeMode),
			delay: randomIntRange(3, 10) * 100,
			end: hypeMode && i === 0,
		})
	}
	return { messages }
}

function createGraceMessage(): ChatMessage {
	const [username, color] = randomElement(fakeUsers)
	const grace = Math.random() < 0.9
	const highlight = !grace && Math.random() < 0.8
	return {
		username,
		color,
		text: randomElement(graceMessages),
		time: getTimeString(),
		grace,
		highlight,
		redeem: highlight || grace,
	}
}

function createHypeMessage(): ChatMessage {
	const [username, color] = randomElement(fakeUsers)
	const cheer = Math.random() < 0.3
	return {
		username,
		color,
		text: '',
		time: getTimeString(),
		bits: cheer && randomElement([100, 100, 200, 250, 500, 1000, 2000]),
		subs: !cheer && randomElement([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 10]),
	}
}

function createTrainBreakingMessage(): ChatMessage {
	const [username, color] = randomElement(fakeUsers)
	const text = randomElement(trainBreakingMessages)
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

function createRegretMessage(username: string, color: string | null): ChatMessage {
	const text = randomElement(regretMessages)
	return { username, color, text, time: getTimeString() }
}

function createAfterTrainMessage(hype: boolean): ChatMessage {
	const [username, color] = randomElement(fakeUsers)
	const text = randomElement(hype ? afterHypeTrainMessages : afterGraceTrainMessages)
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
