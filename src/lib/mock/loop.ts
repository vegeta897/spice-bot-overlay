import { chat, graceTrains } from '../store'
import { randomIntRange } from '../util'
import { planTrain } from './chat'

const MAX_MESSAGES = 18

let runTime: number

type Train = {
	startTime: number
	endTime?: number
	status: 'running' | 'ended'
	score: number
	graces: any[]
	offScreen: boolean
	endUser?: string
}

export async function runChatLoop() {
	const chatLoopStartTime = Date.now()
	runTime = chatLoopStartTime
	while (chatLoopStartTime === runTime) {
		const startTime = Date.now()
		const train: Train = {
			startTime,
			status: 'running',
			score: 0,
			graces: [],
			offScreen: false,
		}
		// Delete finished trains that are off screen
		graceTrains.update((trains) => [
			...trains.filter((t) => t.status !== 'ended' || !t.offScreen),
			train,
		])
		const { messages, trainSize } = planTrain()
		for (const { message, delay, grace } of messages) {
			if (chatLoopStartTime !== runTime) break
			await sleep(delay)
			chat.update((_chat) => [..._chat.slice(-MAX_MESSAGES), message])
			if (grace) {
				train.score = grace.totalScore
				if (grace.type === 'end') {
					train.status = 'ended'
					train.endTime = Date.now()
					train.endUser = message.username
				} else {
					train.graces.push({ ...grace, userColor: message.color })
				}
				graceTrains.update((_graces) => [..._graces])
			}
		}
		await sleep(randomIntRange(5, 10) * 1000)
	}
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
