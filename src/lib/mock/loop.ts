import { TRAIN } from '../constants'
import { chat, trains } from '../store'
import { addToTrain, createTrain, endTrain } from '../trains'
import { randomIntRange, sleep } from '../util'
import { planTrain } from './chat'
import { fakeUsers } from './strings'

const MAX_MESSAGES = 18

let runTime: number

export async function runChatLoop() {
	const chatLoopStartTime = Date.now()
	runTime = chatLoopStartTime
	while (chatLoopStartTime === runTime) {
		const trainID = Date.now()
		const initialColors: string[] = []
		let combo = 0
		let score = 0
		const { messages } = planTrain()
		for (const { message, delay, grace } of messages) {
			if (chatLoopStartTime !== runTime) break
			await sleep(delay)
			chat.update((_chat) => [..._chat.slice(-MAX_MESSAGES), message])
			if (grace) {
				if (grace.type === 'end') {
					endTrain({ id: trainID, combo, score, username: message.username })
				} else {
					combo++
					score = grace.totalScore + grace.comboScore
					if (combo < TRAIN.minLength) {
						initialColors.push(message.color)
					} else if (combo === TRAIN.minLength) {
						initialColors.push(message.color)
						createTrain({ id: trainID, colors: initialColors, combo, score })
					} else {
						addToTrain({ id: trainID, combo, score, color: message.color })
					}
				}
			}
		}
		await sleep(randomIntRange(2, 9) * 1000)
	}
}

export function createStaticTrain() {
	trains.set([
		{
			id: Date.now(),
			departTime: Date.now(),
			// grace: {
			colors: fakeUsers.map((u) => u[1]),
			score: 1234567,
			combo: fakeUsers.length,
			endUser: 'General_Jackal',
			// },
		},
	])
}
