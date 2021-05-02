
import {onesie} from "../../../toolbox/onesie.js"
import {Pubsub, pubsub} from "../../../toolbox/pubsub.js"
import {Service} from "../../../types/service.js"
import {greenTopic} from "../topics/green-topic.js"
import {AuthTokens} from "../types/tokens/auth-token.js"
import {AccessToken} from "../types/tokens/access-token.js"
import {RefreshToken} from "../types/tokens/refresh-token.js"
import {isTokenValid} from "../tools/tokens/is-token-valid.js"
import {AccessPayload} from "../types/tokens/access-payload.js"
import {AccessEventListener} from "./types/access-event-listener.js"
import {decodeAccessToken} from "../tools/tokens/decode-access-token.js"
import {FlexStorage} from "../../../toolbox/flex-storage/types/flex-storage.js"

export function makeAuthMediator({
		appId,
		storage,
		greenService,
	}: {
		appId: string
		storage: FlexStorage
		greenService: Service<typeof greenTopic>
	}) {

	const accessEvent = pubsub<AccessEventListener>()

	const key = `auth-tokens-${appId}`
	type AccessDetails = {access: AccessPayload; accessToken: AccessToken}
	const emptyTokens = () => ({accessToken: undefined, refreshToken: undefined})
	const getTokens = () => storage.read<AuthTokens>(key) ?? emptyTokens()
	const setTokens = (tokens: AuthTokens) => storage.write(key, tokens)

	async function commitTokens(tokens: AuthTokens) {
		const access = decodeAccessToken(tokens.accessToken)
		await setTokens(tokens)
		await accessEvent.publish(access)
		return access
	}

	async function authorize(refreshToken: undefined | RefreshToken) {
		const accessToken = await greenService.authorize({
			appId,
			refreshToken,
			scope: {core: true},
		})
		const access = await commitTokens({accessToken, refreshToken})
		return {access, accessToken}
	}

	const obtainAccessAndReauthorizeIfNecessary = onesie(
		async(): Promise<AccessDetails> => {
			const {accessToken, refreshToken} = await getTokens()
			return isTokenValid(accessToken)
				? {accessToken, access: decodeAccessToken(accessToken)}
				: isTokenValid(refreshToken)
					? authorize(refreshToken)
					: authorize(undefined)
		}
	)

	return {
		subscribeToAccessChange: accessEvent.subscribe,
		async initialize() {
			const {access} = await obtainAccessAndReauthorizeIfNecessary()
			await accessEvent.publish(access)
			return access
		},
		async getAccess() {
			return (await obtainAccessAndReauthorizeIfNecessary()).access
		},
		async getAccessToken() {
			return (await obtainAccessAndReauthorizeIfNecessary()).accessToken
		},
		async login(tokens: AuthTokens) {
			return commitTokens(tokens)
		},
		async logout() {
			await setTokens(emptyTokens())
			return (await obtainAccessAndReauthorizeIfNecessary()).access
		},
		async reauthorize(): Promise<AccessPayload> {
			const tokens = await getTokens()
			await setTokens({...tokens, accessToken: undefined})
			return (await obtainAccessAndReauthorizeIfNecessary()).access
		},
	}
}
