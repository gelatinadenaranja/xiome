
import {LingoShape} from "../../../../toolbox/lingo/lingo.js"
import {ClientsideHandlers} from "../../common/types/chat-concepts.js"

export const clientsideShape:
		LingoShape<ClientsideHandlers> = {
	chatStatusChange: true,
	populateNewMessages: true,
	deleteMessages: true,
	muteUsers: true,
}
