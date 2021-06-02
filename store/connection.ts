import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { RootState } from '~/store'

import { UserPrivateData, Token, LoginSuccessResponse } from '~/helpers/types/ApiTypes'
import { getSocket, initSocket, setAuthenticated } from '~/helpers/socket.io/init'

interface ConnectionInfos {
	email: string
	password: string
}

export const state = () => ({
	connected: false,
	user: { id: 0, username: '', email: '' } as UserPrivateData,
	token: '',
})

export type ConnectionState = ReturnType<typeof state>

export const getters: GetterTree<ConnectionState, RootState> = {
}

export const mutations: MutationTree<ConnectionState> = {
	setToken: (state, token: string) => {
		state.token = token
		if (token === '') {
			localStorage.removeItem('token')
			return
		}
		localStorage.setItem('token', token)
	},
	setUser: (state, user: UserPrivateData) => {
		state.user.id = user.id
		state.user.email = user.email
		state.user.username = user.username
	},
	setConnected: (state, connected: boolean) => {
		state.connected = connected
		if (!connected) {
			setAuthenticated(false)
			return
		}
		if (!getSocket()) {
			initSocket()
		}
	},
}

export const actions: ActionTree<ConnectionState, RootState> = {
	async init({ commit }, token = null) {
		if (!token) {
			token = localStorage.getItem('token') || ''
		}
		try {
			this.$axios.setToken(token, 'Bearer')
			const res = await this.$axios.$get('/me')
			const user: UserPrivateData = res.user
			commit('setToken', token)
			commit('setUser', user)
			commit('setConnected', true)
			return true
		} catch (error) {
			return false
		}
	},
	async login({ commit }, params: ConnectionInfos) {
		try {
			const res: LoginSuccessResponse = await this.$axios.$post('/login', {
				email: params.email,
				password: params.password,
			})
			commit('setToken', res.token.token)
			commit('setUser', res.user)
			commit('setConnected', true)
			return 200
		} catch (error) {
			return error.response.status
		}
	},
	async logout({ commit }, token: string) {
		try {
			this.$axios.setToken(token, 'Bearer')
			await this.$axios.$post('/logout')
		} catch (error) {
		}
		const emptyUser: UserPrivateData = {
			id: 0,
			email: '',
			username: '',
		}
		commit('setToken', '')
		commit('setUser', emptyUser)
		commit('setConnected', false)
	}
}
