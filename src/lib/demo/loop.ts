import { TRAIN } from '../constants'
import { chat, getTrain, trains } from '../store'
import { addToTrain, createTrain, endTrain } from '../trains'
import { randomIntRange, sleep } from '../util'
import type { HypeProgress } from '../websocket'
import { planTrain } from './chat'
import { fakeUsers } from './strings'

const MAX_MESSAGES = 18

let runTime: number

export async function runChatLoop(hype = false) {
	const chatLoopStartTime = Date.now()
	runTime = chatLoopStartTime
	while (chatLoopStartTime === runTime) {
		const trainID = Date.now()
		const initialColors: string[] = []
		let combo = 0
		let score = 0
		let totalBits = 0
		let totalSubs = 0
		const { messages } = planTrain(hype)
		for (const { message, delay, grace, bits, subs } of messages) {
			if (chatLoopStartTime !== runTime) break
			await sleep(delay)
			chat.update((_chat) => [..._chat.slice(-MAX_MESSAGES), message])
			if (grace) {
				if (grace.type === 'end') {
					endTrain({ id: trainID, grace: { combo, score, username: message.username } })
				} else {
					combo++
					score = grace.totalScore + grace.comboScore
					if (!hype && combo < TRAIN.minLength) {
						initialColors.push(message.color)
					} else if ((hype && combo === 1) || combo === TRAIN.minLength) {
						initialColors.push(message.color)
						createTrain({ id: trainID, grace: { colors: initialColors, combo, score } })
					} else {
						addToTrain({ id: trainID, grace: { combo, score, color: message.color } })
					}
				}
			} else if (bits || subs) {
				const type = bits ? 'bits' : 'subs'
				totalBits += bits || 0
				totalSubs += subs || 0
				const contribution: HypeProgress = {
					type,
					amount: bits || subs,
					color: message.color,
				}
				if (!getTrain({ id: trainID })) {
					createTrain({
						id: trainID,
						hype: { totalBits, totalSubs, contributions: [contribution] },
					})
				} else {
					addToTrain({ id: trainID, hype: { totalBits, totalSubs, contribution } })
				}
			}
		}
		await sleep(randomIntRange(2, 7) * 1000)
	}
}

export function createStaticTrain() {
	trains.set([
		{
			id: Date.now(),
			departTime: Date.now(),
			grace: {
				colors: fakeUsers.slice(0, 12).map((u) => u[1]),
				score: 1234567,
				combo: 13,
				endUser: 'General_Jackal',
			},
		},
	])
}
