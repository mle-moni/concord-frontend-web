<template>
	<div class="flex justify-center h-4/6">
		<div class="w-4/5 m-auto">
			<form
				class="flex flex-col"
				@submit.prevent="createAccount"
			>
				<input
					v-model="email"
					class="border block mx-auto my-2 rounded-md p-1"
					type="text"
					name="email"
					placeholder="email"
				/>
				<input
					v-model="username"
					class="border block mx-auto my-2 rounded-md p-1"
					type="text"
					name="username"
					placeholder="username"
				/>
				<input
					v-model="password"
					class="border block mx-auto my-2 rounded-md p-1"
					type="password"
					name="password"
					placeholder="password"
				/>
				<input
					v-model="passwordConfirmation"
					class="border block mx-auto my-2 rounded-md p-1"
					type="password"
					name="password_confirmation"
					placeholder="confirm password"
				/>
				<button class="m-auto p-2 rounded-sm">Create account</button>
				<div class="text-red-500 text-center">{{errMsg}}</div>
			</form>
		</div>
	</div>
</template>
<script lang="ts">
import Vue from 'vue'
import { ValidationError, LoginSuccessResponse } from '~/helpers/types/ApiTypes'
import { displayValidationError } from '~/helpers/errors'

export default Vue.extend({
	name: 'Register',
	data() {
		return {
			errMsg: '',
			email: '',
			username: '',
			password: '',
			passwordConfirmation: '',
		}
	},
	methods: {
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
				this.$router.push('/')
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
		},
	},
})
</script>
