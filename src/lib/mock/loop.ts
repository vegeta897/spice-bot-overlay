// type IntervalID = 'chat'

import { chat, graces } from '../store'
import { planTrain } from './chat'

const MAX_MESSAGES = 18

let runTime: number

export async function runChatLoop() {
	console.log('runChatLoop()')
	const now = Date.now()
	runTime = Date.now()
	while (now === runTime) {
		// await sleep(randomIntRange(6, 12) * 1000)
		graces.set([])
		const { messages, trainSize } = planTrain()
		console.log(`simulating train size ${trainSize}`)
		for (const { message, delay, grace } of messages) {
			if (now !== runTime) break
			await sleep(delay)
			chat.update((_chat) => [..._chat.slice(-MAX_MESSAGES), message])
			if (grace) graces.update((_graces) => [..._graces, grace])
		}
	}
	console.log('broke out of runChatLoop, yay!')
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
