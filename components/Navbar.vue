<template>
	<nav class="w-full flex justify-between p-4">
		<LinkMain to="/"> Concord </LinkMain>
		<div v-if="connected" class="flex">
			<LinkBasic to="/profile" class="mx-2">Profile</LinkBasic>
			<LinkFake to="/logout" :onclick="logout" class="mx-2">Logout</LinkFake>
		</div>
		<div v-else class="flex">
			<LinkBasic to="/login" class="mx-2">Login</LinkBasic>
			<LinkBasic to="/register" class="mx-2">Register</LinkBasic>
		</div>
	</nav>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { UserPrivateData } from '~/helpers/types/ApiTypes'
import { setStore } from '~/helpers/socket.io/init'

@Component
export default class Navbar extends Vue {
	fetchOnServer() {
		return false
	}
	async fetch() {
		setStore(this.$store)
		localStorage.setItem('apiUrl', this.$axios.defaults.baseURL!)
		await this.$store.dispatch('connection/init')
	}

	get connected(): boolean {
		return this.$store.state.connection.connected
	}
	get token(): string {
		return this.$store.state.connection.token
	}
	get user(): UserPrivateData {
		return this.$store.state.connection.user
	}

	async logout() {
		await this.$store.dispatch('connection/logout', this.token)
		this.$router.push('/')
	}
}
</script>
