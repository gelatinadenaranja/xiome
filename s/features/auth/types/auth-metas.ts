
import {AuthTables} from "./auth-tables.js"
import {AccessPayload} from "./auth-tokens.js"
import {DamnId} from "../../../toolbox/damnedb/damn-id.js"
import {AppTables} from "../aspects/apps/types/app-tables.js"
import {StatsHub} from "../aspects/permissions/types/stats-hub.js"
import {PrivilegeChecker} from "../aspects/permissions/types/privilege-checker.js"
import {UnconstrainedTables} from "../../../framework/api/types/table-namespacing-for-apps.js"
import {appPermissions, platformPermissions} from "../../../assembly/backend/permissions/standard-permissions.js"

export type GreenMeta = undefined

export interface GreenAuth {
	appTables: AppTables
	authTables: UnconstrainedTables<AuthTables>
}

export interface AnonMeta {
	accessToken: string
}

export interface AnonAuth {
	access: AccessPayload
	authTables: AuthTables
	checker: PrivilegeChecker<typeof appPermissions["privileges"]>
}

export interface LoginAuth extends AnonAuth {
	appTables: AppTables
}

export interface UserMeta extends AnonMeta {}

export interface UserAuth extends AnonAuth {}

export interface PlatformUserMeta extends UserMeta {}

export interface PlatformUserAuth extends Omit<UserAuth, "authTables" | "checker"> {
	statsHub: StatsHub
	appTables: AppTables
	authTables: UnconstrainedTables<AuthTables>
	checker: PrivilegeChecker<typeof platformPermissions["privileges"]>
}

export interface AppOwnerMeta extends PlatformUserMeta {}

export interface AppOwnerAuth extends Omit<PlatformUserAuth, "authTables"> {
	authTablesForPlatform: AuthTables
	authorizeAppOwner(appId: DamnId): Promise<{authTables: AuthTables}>
}
