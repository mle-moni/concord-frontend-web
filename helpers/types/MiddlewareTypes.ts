import { Store } from 'vuex'

interface MiddlewareParam {
	store: Store<any>
	redirect: (path: string) => {}
}

export { MiddlewareParam }
