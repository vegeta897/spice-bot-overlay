import { chat, graceTrains } from '../store'
import { planTrain } from './chat'

const MAX_MESSAGES = 18

let runTime: number

export async function runChatLoop() {
	const chatLoopStartTime = Date.now()
	runTime = chatLoopStartTime
	while (chatLoopStartTime === runTime) {
		// await sleep(randomIntRange(6, 12) * 1000)
		const startTime = Date.now()
		const train = {
			startTime,
			endTime: 0,
			status: 'running',
			score: 0,
			graces: [],
		}
		graceTrains.update((trains) => [
			...trains.filter(
				(t) => t.status !== 'ended' || startTime - t.endTime < 10 * 1000
			),
			train,
		])
		const { messages, trainSize } = planTrain()
		console.log(`simulating train size ${trainSize}`)
		for (const { message, delay, grace } of messages) {
			if (chatLoopStartTime !== runTime) break
			await sleep(delay)
			chat.update((_chat) => [..._chat.slice(-MAX_MESSAGES), message])
			if (grace) {
				train.score = grace.totalScore
				if (grace.type === 'end') {
					train.status = 'ended'
					train.endTime = Date.now()
				} else {
					train.graces.push(grace)
				}
				graceTrains.update((_graces) => [..._graces])
			}
		}
	}
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
