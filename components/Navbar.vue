<template>
	<nav class="w-full flex justify-between p-4">
		<nuxt-link class="font-bold text-2xl" to="/"> Concord </nuxt-link>
		<div v-if="connected" class="flex">
			<nuxt-link to="/profile" class="mx-2">Profile</nuxt-link>
			<a href="/logout" @click.prevent="logout">Logout</a>
		</div>
		<div v-else class="flex">
			<nuxt-link to="/login" class="mx-2">Login</nuxt-link>
			<nuxt-link to="/register" class="mx-2">Register</nuxt-link>
		</div>
	</nav>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { UserPrivateData } from '~/helpers/types/ApiTypes'

@Component
export default class Navbar extends Vue {
	fetchOnServer() {
		return false
	}
	async fetch() {
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
