<template>
	<form
		class="flex flex-col"
		@submit.prevent="submitEvent"
	>
		<slot></slot>
	</form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class FormBasic extends Vue {
	@Prop()
	submitEvent!: () => Promise<void>
}
</script>
