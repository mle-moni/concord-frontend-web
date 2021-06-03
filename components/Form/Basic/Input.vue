<template>
	<input
		v-model="modelProp"
		class="border block mx-auto my-2 rounded-md p-1"
		:name="name"
		:type="type"
		:placeholder="placeholder"
	/>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class FormBasicInput extends Vue {
	@Prop()
	model!: string

	@Prop()
	name!: string

	@Prop({ default: 'text' })
	type!: string

	@Prop({ default: '' })
	placeholder!: string

	public get modelProp(): string {
		return this.model
	}

	public set modelProp(value: string) {
		this.$emit('update:model', value)
	}
}
</script>
