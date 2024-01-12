import type { HypeProgress } from 'grace-train-lib/trains'
import { TRAIN } from '../constants'
import { getStoreTrain, trains, updateStoreTrain } from '../store'
import { updateTrain, createTrain, endTrain } from '../trains'
import { randomIntRange, sleep } from '../util'
import { chat, planTrain } from './chat'
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
		let trainID = Date.now()
		const initialGraces: { color: string; userId: string }[] = []
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
			const storeTrain = getStoreTrain({ id: trainID })
			if (grace) {
				combo++
				score = grace.totalScore + grace.comboScore
				if (storeTrain && 'hype' in storeTrain) {
					updateTrain({
						id: trainID,
						hype: { level, progress, total, goal, graces: combo },
					})
				} else if (combo < TRAIN.minLength) {
					initialGraces.push({ color: message.color, userId: '' })
				} else if (combo === TRAIN.minLength) {
					initialGraces.push({ color: message.color, userId: '' })
					createTrain({ id: trainID, grace: { graces: initialGraces, combo, score } })
				} else {
					updateTrain({
						id: trainID,
						grace: { combo, score, grace: { color: message.color, userId: '' } },
					})
				}
			} else if (hype) {
				level = hype.level
				progress = hype.progress
				total = hype.total
				goal = hype.goal
				const contribution: HypeProgress = {
					type: hype.bits ? 'bits' : 'subs',
					amount: (hype.bits || hype.subs)!,
					color: message.color,
				}
				if (initialContributions.length < 3) initialContributions.push(contribution)
				if (initialContributions.length === 3) {
					if (storeTrain && !('hype' in storeTrain)) {
						trainID = Date.now()
					}
					if (!getStoreTrain({ id: trainID })) {
						createTrain({
							id: trainID,
							hype: {
								level,
								progress,
								total,
								goal,
								graces: combo,
								contributions: [...initialContributions],
							},
						})
					} else if (getStoreTrain({ id: trainID })) {
						updateTrain({
							id: trainID,
							hype: { level, progress, total, goal, contribution, graces: combo },
						})
					}
				}
			}
			if (end) {
				const endingTrain = getStoreTrain({ id: trainID })!
				if ('grace' in endingTrain) {
					endTrain({ id: trainID, grace: { combo, score, username: message.username } })
				} else {
					endTrain({ id: trainID, hype: { level, total, graces: combo } })
				}
			}
		}
		await sleep((hypeMode ? randomIntRange(10, 15) : randomIntRange(2, 7)) * 1000)
	}
}

export function createStaticTrain(hype: boolean) {
	const id = Date.now()
	const grace = {
		graces: fakeUsers.slice(0, 12).map((u) => ({ color: u[1], userId: '' })),
		score: 1234567,
		combo: 13,
	}
	if (hype) {
		createTrain({
			id,
			hype: {
				total: 4750,
				level: 3,
				progress: 1000,
				goal: 2500,
				graces: grace.combo,
				contributions: [
					{ type: 'bits', amount: 100, color: null },
					// { type: 'bits', amount: 100, color: null },
					// { type: 'bits', amount: 100, color: null },
					// { type: 'bits', amount: 200, color: null },
					{ type: 'bits', amount: 250, color: null },
					// { type: 'bits', amount: 300, color: null },
					// { type: 'bits', amount: 400, color: null },
					{ type: 'bits', amount: 500, color: '#ffffff' },
					{ type: 'bits', amount: 600, color: null },
					{ type: 'bits', amount: 550, color: null },
					{ type: 'bits', amount: 1000, color: null },
					{ type: 'bits', amount: 1000, color: null },
					{ type: 'subs', amount: 2, color: null },
					{ type: 'subs', amount: 1, color: null },
					// { type: 'subs', amount: 1, color: null },
				].map((c, i) => ({ ...c, color: c.color || fakeUsers[i][1] })) as HypeProgress[],
			},
		})
	} else {
		createTrain({ id, grace })
	}

	updateStoreTrain({
		id,
		static: true,
		// grace: { ...grace },
		endUser: 'General_Jackal',
		endTime: 1,
	})
}
