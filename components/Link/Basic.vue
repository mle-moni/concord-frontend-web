<template>
	<nuxt-link :to="to" class="">
		<slot></slot>
	</nuxt-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class LinkBasic extends Vue {
	@Prop({ default: '' })
	to!: string
}
</script>
