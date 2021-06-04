<template>
	<a :href="to" @click.prevent="onclick" class="">
		<slot></slot>
	</a>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class LinkBasic extends Vue {
	@Prop({ default: '' })
	to!: string

	@Prop({
		default: () => {},
	})
	onclick!: () => void
}
</script>
