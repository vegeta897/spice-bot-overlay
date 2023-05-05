import { TRAIN } from '../constants'
import { chat, getTrain, trains, updateTrain } from '../store'
import { addToTrain, createTrain, endTrain } from '../trains'
import { randomIntRange, sleep } from '../util'
import type { HypeProgress } from '../websocket'
import { planTrain } from './chat'
import { fakeUsers } from './strings'

const MAX_MESSAGES = 18

let runTime: number

export function initDemo(hype: boolean, staticTrain: boolean) {
	trains.set([]) // Clean up after hot reload
	if (staticTrain) createStaticTrain(hype)
	else runChatLoop(hype)
}

export async function runChatLoop(hypeMode = false) {
	const chatLoopStartTime = Date.now()
	runTime = chatLoopStartTime
	while (chatLoopStartTime === runTime) {
		const trainID = Date.now()
		const initialColors: string[] = []
		const initialContributions: HypeProgress[] = []
		let combo = 0
		let score = 0
		let level = 0
		let progress = 0
		let total = 0
		let goal = 0
		const { messages } = planTrain(hypeMode)
		for (const { message, delay, grace, hype, end } of messages) {
			if (chatLoopStartTime !== runTime) break
			await sleep(delay)
			chat.update((_chat) => [..._chat.slice(-MAX_MESSAGES), message])
			if (grace) {
				combo++
				score = grace.totalScore + grace.comboScore
				if (!hypeMode && combo < TRAIN.minLength) {
					initialColors.push(message.color)
				} else if ((hypeMode && combo === 1) || combo === TRAIN.minLength) {
					initialColors.push(message.color)
					createTrain({ id: trainID, grace: { colors: initialColors, combo, score } })
				} else {
					addToTrain({ id: trainID, grace: { combo, score, color: message.color } })
				}
			} else if (hype) {
				level = hype.level
				progress = hype.progress
				total = hype.total
				goal = hype.goal
				const contribution: HypeProgress = {
					type: hype.bits ? 'bits' : 'subs',
					amount: hype.bits || hype.subs,
					color: message.color,
				}
				if (initialContributions.length < 3) initialContributions.push(contribution)
				if (!getTrain({ id: trainID }) && initialContributions.length === 3) {
					createTrain({
						id: trainID,
						hype: {
							level,
							progress,
							total,
							goal,
							contributions: [...initialContributions],
						},
					})
				} else if (getTrain({ id: trainID })) {
					addToTrain({
						id: trainID,
						hype: { level, progress, total, goal, contribution },
					})
				}
			}
			if (end) {
				const train = getTrain({ id: trainID })
				endTrain({
					id: trainID,
					grace: train.grace && { combo, score, username: message.username },
					hype: train.hype && { level, progress, total, goal },
				})
			}
		}
		await sleep((hypeMode ? randomIntRange(10, 15) : randomIntRange(2, 7)) * 1000)
	}
}

export function createStaticTrain(hype: boolean) {
	const id = Date.now()
	const grace = {
		colors: fakeUsers.slice(0, 12).map((u) => u[1]),
		score: 1234567,
		combo: 13,
	}
	createTrain({
		id,
		grace,
		hype: hype && {
			total: 4750,
			level: 3,
			progress: 1000,
			goal: 2500,
			contributions: [
				// { type: 'bits', amount: 100, color: null },
				// { type: 'bits', amount: 100, color: null },
				// { type: 'bits', amount: 100, color: null },
				// { type: 'bits', amount: 200, color: null },
				// { type: 'bits', amount: 250, color: null },
				// { type: 'bits', amount: 300, color: null },
				// { type: 'bits', amount: 400, color: null },
				{ type: 'bits', amount: 500, color: null },
				{ type: 'bits', amount: 600, color: null },
				{ type: 'bits', amount: 550, color: null },
				{ type: 'bits', amount: 1000, color: null },
				{ type: 'bits', amount: 2000, color: null },
				// { type: 'subs', amount: 1, color: null },
				// { type: 'subs', amount: 1, color: null },
				// { type: 'subs', amount: 1, color: null },
				// { type: 'subs', amount: 1, color: null },
				// { type: 'subs', amount: 1, color: null },
				// { type: 'subs', amount: 1, color: null },
				// { type: 'subs', amount: 1, color: null },
				{ type: 'subs', amount: 3, color: null },
				// { type: 'bits', amount: 3000, color: null },
			],
		},
	})
	updateTrain({ id, static: true, grace: { ...grace, endUser: 'General_Jackal' } })
}
