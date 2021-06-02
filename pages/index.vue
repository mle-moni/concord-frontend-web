<template>
	<div class="flex justify-center h-3/6">
		<div class="w-4/5 m-auto flex">
			<div v-if="!connected" class="m-auto">
				<h1 class="text-2xl relative right-6 m-2">What is it?</h1>
				<ul class="list-disc">
					<li>Discord-like</li>
					<li>self hosted</li>
					<li>free software</li>
				</ul>
				<br />
				<nuxt-link to="/register"> Create an account </nuxt-link>
			</div>
			<div v-else class="m-auto">
				Hello {{user.username}}
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { UserPrivateData } from '~/helpers/types/ApiTypes'
export default Vue.extend({
	computed: {
		connected(): boolean {
			return this.$store.state.connection.connected
		},
		user(): UserPrivateData {
			return this.$store.state.connection.user
		},
	},
})
</script>
