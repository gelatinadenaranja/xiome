
import {html} from "../../../../../framework/component.js"

export function renderXiomeConfig(appId: string) {
	const h = (syntax: string, s: string) => html`<span data-syntax=${syntax}>${s}</span>`
	const tag = (s: string) => h("tag", s)
	const attr = (s: string) => h("attr", s)
	const data = (s: string) => h("data", s)
	const glue = (s: string) => h("glue", s)
	const quote = "" // glue(`"`)
	return html`
		${glue(`<`)}${tag(`xiome-config`)} ${attr(`app`)}${glue(`=`)}${quote}${data(appId)}${quote}${glue(`>`)}${glue(`</`)}${tag(`xiome-config`)}${glue(`>`)}
	`
}
