<template>
	<nav class="w-full flex justify-between p-4">
		<nuxt-link class="font-bold text-2xl" to="/"> Concord </nuxt-link>
		<div v-if="connected" class="flex">
			<button v-on:click="logout">Logout</button>
		</div>
		<div v-else class="flex">
			<nuxt-link to="/login" class="mx-2">Login</nuxt-link>
			<nuxt-link to="/register" class="mx-2">Register</nuxt-link>
		</div>
	</nav>
</template>


<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	computed: {
		connected(): boolean {
			return this.$store.state.connection.connected
		},
		token(): string {
			return this.$store.state.connection.token
		},
	},
	methods: {
		async logout() {
			await this.$store.dispatch('connection/logout', this.token)
		},
	},
})
</script>
