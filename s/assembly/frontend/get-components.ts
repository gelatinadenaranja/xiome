
import {Await} from "../../types/fancy.js"
import {assembleModels} from "./assemble-models.js"
import {share2, themeComponents} from "../../framework/component.js"

import theme from "../../framework/theme.css.js"

import {XioExample} from "../../features/xio-components/example/xio-example.js"
import {XioLoading} from "../../features/xio-components/loading/xio-loading.js"
import {XioTextInput} from "../../features/xio-components/inputs/xio-text-input.js"
import {XiomeAppManager} from "../../features/auth/components/apps/xiome-app-manager.js"
import {XioProfileCard} from "../../features/xio-components/profile-card/xio-profile-card.js"
import {XiomeLoginPanel} from "../../features/auth/components/login-panel/xiome-login-panel.js"

export function getComponents(models: Await<ReturnType<typeof assembleModels>>) {
	return themeComponents(theme, {
		XioExample,
		XioLoading,
		XioTextInput,
		XioProfileCard,
		XiomeAppManager: share2(XiomeAppManager, {appModel: models.appModel}),
		XiomeLoginPanel: share2(XiomeLoginPanel, {authModel: models.authModel}),
	})
}
