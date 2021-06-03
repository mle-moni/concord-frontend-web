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
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { UserPrivateData } from '~/helpers/types/ApiTypes'

@Component
export default class FormBasicInput extends Vue {
	get connected(): boolean {
		return this.$store.state.connection.connected
	}
	get user(): UserPrivateData {
		return this.$store.state.connection.user
	}
}
</script>
