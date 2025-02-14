
import {makeChatState} from "../../../models/state/chat-state.js"
import {ChatPost, ChatStatus} from "../../../common/types/chat-concepts.js"

export function prepareChatClientsideLogic({state, onChange}: {
		state: ReturnType<typeof makeChatState>
		onChange: () => void
	}) {

	async function triggerChange() {
		await state.wait()
		onChange()
	}

	return {
		async roomStatusChanged(room: string, status: ChatStatus) {
			state.writable.cache = {
				...state.writable.cache,
				rooms: {
					...state.writable.cache.rooms,
					[room]: {
						...state.writable.cache.rooms[room],
						status,
					},
				},
			}
			await triggerChange()
		},
		async postsAdded(room: string, posts: ChatPost[]) {
			state.writable.cache = {
				...state.writable.cache,
				rooms: {
					...state.writable.cache.rooms,
					[room]: {
						...state.writable.cache.rooms[room],
						posts: [
							...state.writable.cache.rooms[room]?.posts ?? [],
							...posts,
						]
					},
				},
			}
			await triggerChange()
		},
		async postsRemoved(room: string, postIds: string[]) {
			state.writable.cache = {
				...state.writable.cache,
				rooms: {
					...state.writable.cache.rooms,
					[room]: {
						...state.writable.cache.rooms[room],
						posts: (state.writable.cache.rooms[room]?.posts ?? [])
							.filter(post => !postIds.includes(post.postId))
					},
				},
			}
			await triggerChange()
		},
		async roomCleared(room: string) {
			state.writable.cache = {
				...state.writable.cache,
				rooms: {
					...state.writable.cache.rooms,
					[room]: {
						...state.writable.cache.rooms[room],
						posts: [],
					},
				},
			}
			await triggerChange()
		},
		async usersMuted(userIds: string[]) {
			state.writable.cache = {
				...state.writable.cache,
				mutedUserIds: [
					...state.writable.cache.mutedUserIds,
					...userIds,
				],
			}
			await triggerChange()
		},
		async usersUnmuted(userIds: string[]) {
			state.writable.cache = {
				...state.writable.cache,
				mutedUserIds: state.writable.cache.mutedUserIds
					.filter(userId => !userIds.includes(userId)),
			}
			await triggerChange()
		},
		async unmuteAll() {
			state.writable.cache = {
				...state.writable.cache,
				mutedUserIds: [],
			}
			await triggerChange()
		},
	}
}
