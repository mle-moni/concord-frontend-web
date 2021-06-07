<template>
	<HelperLoading v-if="isLoading" />
	<HelperAlreadyConnected v-else-if="connected" />
	<div v-else class="flex justify-center h-4/6">
		<div class="w-4/5 m-auto">
			<FormBasic
				:submitEvent="createAccount"
			>
				<FormBasicInput :model.sync="email" name="email" placeholder="email" />
				<FormBasicInput :model.sync="username" name="username" placeholder="username" />
				<FormBasicInput :model.sync="password" name="password" placeholder="password" type="password" />
				<FormBasicInput :model.sync="passwordConfirmation" name="password_confirmation"
					placeholder="confirm password" type="password"
				/>
				<FormBasicSubmit>Create account</FormBasicSubmit>
				<HelperError>{{errMsg}}</HelperError>
			</FormBasic>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ValidationError, LoginSuccessResponse } from '~/helpers/types/ApiTypes'
import { displayValidationError } from '~/helpers/errors'

@Component
export default class Register extends Vue {
	public errMsg: string = ''
	public email: string = ''
	public username: string = ''
	public password: string = ''
	public passwordConfirmation: string = ''

	async createAccount(): Promise<void> {
		try {
			const res = <LoginSuccessResponse>await this.$axios.$post('/users', {
				email: this.email,
				username: this.username,
				password: this.password,
				password_confirmation: this.passwordConfirmation,
			})
			this.$store.commit('connection/setToken', res.token.token)
			this.$store.commit('connection/setUser', res.user)
			this.$store.commit('connection/setConnected', true)
			const url: string = this.$store.state.connection.afterLoginUrl
			this.$store.commit('connection/setUrl', '/')
			this.$router.push(url)
			return
		} catch (error) {
			if (!error.response) {
				return
			}
			if (error.response.status === 500) {
				this.errMsg = `error: API seems to be down, please contact website admin`
				return
			}
			const res = error.response.data
			const err = <ValidationError>res.errors[0]
			this.errMsg = `error: ${displayValidationError(err)}`
			return
		}
	}
	get isLoading(): boolean {
		return this.$store.state.connection.loading
	}
	get connected(): boolean {
		return this.$store.state.connection.connected
	}
}
</script>
