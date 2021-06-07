<template>
	<HelperLoading v-if="isLoading"/>
	<HelperNeedAuthMsg v-else-if="!connected"/>
	<div v-else class="w-full h-4/5">
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class NeedAuth extends Vue {
	get connected(): boolean {
		return this.$store.state.connection.connected
	}

	get isLoading(): boolean {
		return this.$store.state.connection.loading
	}
}
</script>
