<template>
	<div v-if="!connected">
		Loading...
	</div>
	<div v-else class="flex justify-center h-4/6">
		<div class="w-4/5 m-auto">
			<form
				class="flex flex-col"
				@submit.prevent="editProfile"
			>
				<input
					v-model="userbis.username"
					class="border block mx-auto my-2 rounded-md p-1"
					type="text"
					name="username"
					placeholder="username"
				/>
				<button class="m-auto p-2 rounded-sm">Update account infos</button>
				<div class="text-red-500 text-center">{{errMsg}}</div>
			</form>
			<div class="text-green-500 text-center">{{successMsg}}</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { UserPrivateData, ValidationError } from '~/helpers/types/ApiTypes'
import { displayValidationError } from '~/helpers/errors'

export default Vue.extend({
	name: 'EditProfile',
	data() {
		return {
			errMsg: '',
			successMsg: '',
			email: '',
			username: '',
		}
	},
	computed: {
		connected(): boolean {
			return this.$store.state.connection.connected
		},
		token(): string {
			return this.$store.state.connection.token
		},
		user(): UserPrivateData {
			return this.$store.state.connection.user
		},
		userbis(): UserPrivateData {
			return { ...this.user }
		},
	},
	methods: {
		setMsg(msg: string, success = false): void {
			if (success) {
				this.successMsg = msg
				this.errMsg = ''
				return
			}
			this.errMsg = msg
			this.successMsg = ''
		},
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
		},
	},
})
</script>
