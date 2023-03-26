import { chat, graceTrains } from '../store'
import { randomIntRange, sleep } from '../util'
import { planTrain } from './chat'
import { fakeUsers } from './strings'

const MAX_MESSAGES = 18

let runTime: number

export type Train = {
	startTime: number
	endTime?: number
	status: 'running' | 'ended'
	graces: any[]
	offScreen: boolean
	endUser?: string
	showInfo: boolean
}

export async function runChatLoop() {
	const chatLoopStartTime = Date.now()
	runTime = chatLoopStartTime
	while (chatLoopStartTime === runTime) {
		const startTime = Date.now()
		const train: Train = {
			startTime,
			status: 'running',
			graces: [],
			offScreen: false,
			showInfo: false,
		}
		// Delete finished trains that are off screen
		// TODO: Calculate the time needed for an ended grace train to be off-screen
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
				if (grace.type === 'end') {
					train.status = 'ended'
					train.endTime = Date.now()
					train.endUser = message.username
					setTimeout(() => {
						train.showInfo = false
						graceTrains.update((trains) => [...trains]) // Trigger refresh
						// graceTrains.update(trains=>[...trains.filter(t=>t!==train)])
					}, 5 * 1000)
				} else {
					train.showInfo = true
					train.graces.push({ ...grace, userColor: message.color })
				}
				graceTrains.update((trains) => [...trains]) // Trigger refresh
			}
		}

		await sleep(randomIntRange(3, 9) * 1000)
	}
}

export function createStaticTrain() {
	graceTrains.set([
		{
			startTime: Date.now(),
			status: 'running',
			graces: fakeUsers.map((u) => ({
				userColor: u[1],
				totalScore: 234567,
				comboScore: 0,
				delta: 0,
			})),
			offScreen: true,
			showInfo: true,
			endUser: 'General_Jackal',
		},
	])
}
