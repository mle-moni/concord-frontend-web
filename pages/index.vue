<template>
	<div class="flex justify-center h-3/6">
		<div class="w-4/5 m-auto flex">
			<HelperLoading v-if="isLoading" class="m-auto" />
			<div v-else-if="!connected" class="m-auto">
				<h1 class="text-2xl relative right-6 m-2">What is it?</h1>
				<ul class="list-disc">
					<li>Discord-like</li>
					<li>self hosted</li>
					<li>free software</li>
				</ul>
				<br />
				<LinkBasic to="/register"> Create an account </LinkBasic>
			</div>
			<div v-else class="m-auto">
				<h1 class="text-center">
					Hello {{user.username}}
				</h1>
				<br>
				<LinkBasic to="/conferences">
					Join or create a video conference
				</LinkBasic>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { UserPrivateData } from '~/helpers/types/ApiTypes'

@Component
export default class PageHome extends Vue {
	get connected(): boolean {
		return this.$store.state.connection.connected
	}
	get user(): UserPrivateData {
		return this.$store.state.connection.user
	}
	get isLoading(): boolean {
		return this.$store.state.connection.loading
	}
}
</script>
