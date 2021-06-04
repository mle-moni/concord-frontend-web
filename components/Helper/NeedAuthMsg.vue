<template>
	<div class="flex flex-col m-auto">
		<HelperError>You need to be connected</HelperError>
		<div class="flex justify-center">
			<LinkBasic to="/login" class="mx-2">Login</LinkBasic>
			<p class="mx-2">or</p>
			<LinkBasic to="/register" class="mx-2">Register</LinkBasic>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class NeedAuthMsg extends Vue {
	mounted() {
		this.$store.commit('connection/setUrl', location.pathname)
	}
}
</script>
