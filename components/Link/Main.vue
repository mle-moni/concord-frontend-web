<template>
	<nuxt-link :to="to" class="font-bold text-2xl">
		<slot></slot>
	</nuxt-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class LinkMain extends Vue {
	@Prop({ default: '' })
	to!: string
}
</script>
