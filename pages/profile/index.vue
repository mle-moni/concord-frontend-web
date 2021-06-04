<template>
	<div v-if="!connected">
		Loading...
	</div>
	<div v-else class="flex justify-center h-4/6">
		<div class="w-4/5 m-auto">
			<FormBasic
				:submitEvent="editProfile"
			>
				<FormBasicInput :model.sync="userbis.username" name="username" placeholder="username" />
				<FormBasicSubmit>Update account infos</FormBasicSubmit>
				<HelperError>{{errMsg}}</HelperError>
			</FormBasic>
			<HelperSuccess>{{successMsg}}</HelperSuccess>
			<br>
			<div class="flex">
				<LinkBasic to="/profile/change-password" class="m-auto"> Change your password </LinkBasic>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { UserPrivateData, ValidationError } from '~/helpers/types/ApiTypes'
import { displayValidationError } from '~/helpers/errors'

@Component
export default class ProfileIndex extends Vue {
	public errMsg: string = ''
	public successMsg: string = ''
	public username: string = ''

	get connected(): boolean {
		return this.$store.state.connection.connected
	}
	get token(): string {
		return this.$store.state.connection.token
	}
	get user(): UserPrivateData {
		return this.$store.state.connection.user
	}
	get userbis(): UserPrivateData {
		return { ...this.user }
	}

	setMsg(msg: string, success = false): void {
		if (success) {
			this.successMsg = msg
			this.errMsg = ''
			return
		}
		this.errMsg = msg
		this.successMsg = ''
	}
	async editProfile(): Promise<void> {
		try {
			this.$axios.setToken(this.token, 'Bearer')
			const res = await this.$axios.$put(`/users/${this.user.id}`, {
				username: this.userbis.username,
			})
			this.$store.commit('connection/setUser', res.user)
			this.setMsg('Profile updated!', true)
			return
		} catch (error) {
			if (!error.response) {
				return
			}
			this.handleError(error)
		}
	}
	handleError(error: any) {
		const status = error.response.status
		switch (status) {
			case 500:
				this.setMsg('error: API seems to be down, please contact website admin')
				return
			case 401:
				this.setMsg('You need to be connected in order to update your profile')
				return
			case 404:
				this.setMsg('Cannot find your profile, weird')
				return
			case 422:
				const res = error.response.data
				const err = <ValidationError>res.errors[0]
				this.setMsg(`error: ${displayValidationError(err)}`)
				return
			default:
				this.setMsg(
					`Unknown error, please contact site admin, give him this: [err ${status} on update profile]`
				)
				return
		}
	}
}
</script>
