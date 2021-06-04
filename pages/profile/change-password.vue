<template>
	<HelperNeedAuth>
		<div class="flex justify-center h-4/6">
			<div class="w-4/5 m-auto">
				<FormBasic
					:submitEvent="changePassword"
				>
					<FormBasicInput :model.sync="password" name="password" placeholder="password" type="password" />
					<FormBasicInput :model.sync="passwordConfirmation" name="password_confirmation"
						placeholder="password confirmation" type="password"
					/>
					<FormBasicSubmit>Update account infos</FormBasicSubmit>
					<HelperError>{{errMsg}}</HelperError>
				</FormBasic>
				<HelperSuccess>{{successMsg}}</HelperSuccess>
			</div>
		</div>
	</HelperNeedAuth>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ValidationError } from '~/helpers/types/ApiTypes'
import { displayValidationError } from '~/helpers/errors'

@Component
export default class ProfileChangePassword extends Vue {
	public errMsg: string = ''
	public successMsg: string = ''
	public password: string = ''
	public passwordConfirmation: string = ''

	get token(): string {
		return this.$store.state.connection.token
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
	async changePassword(): Promise<void> {
		try {
			this.$axios.setToken(this.token, 'Bearer')
			await this.$axios.$post(`/profile/change-password`, {
				password: this.password,
				password_confirmation: this.passwordConfirmation,
			})
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
