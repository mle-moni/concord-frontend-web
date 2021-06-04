<template>
	<HelperNeedAuth>
		<div class="flex justify-center h-4/6">
			<div class="w-4/5 m-auto">
				<FormBasic
					:submitEvent="joinRoom"
				>
					<FormBasicInput :model.sync="roomName" placeholder="Conference name" />
					<FormBasicSubmit>Join or create conference</FormBasicSubmit>
				</FormBasic>
			</div>
		</div>
	</HelperNeedAuth>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class PageConferences extends Vue {
	public roomName: string = ''

	async joinRoom(): Promise<void> {
		if (this.roomName !== '') {
			this.$router.push(`/conferences/${this.roomName}`)
		}
	}
}
</script>
