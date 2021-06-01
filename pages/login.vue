<template>
	<div class="flex justify-center h-4/6">
		<div class="w-4/5 m-auto">
			<form class="flex flex-col" @submit.prevent="login">
				<input
					v-model="email"
					class="border block mx-auto my-2 rounded-md p-1"
					type="text"
					name="email"
					placeholder="email"
				/>
				<input
					v-model="password"
					class="border block mx-auto my-2 rounded-md p-1"
					type="password"
					name="password"
					placeholder="password"
				/>
				<button class="m-auto p-2 rounded-sm">Login</button>
				<div class="text-red-500 text-center">{{errMsg}}</div>
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	name: 'Login',
	data() {
		return {
			errMsg: '',
			email: '',
			password: '',
		}
	},
	methods: {
		async login(): Promise<void> {
			const status: number = await this.$store.dispatch('connection/login', {
				email: this.email,
				password: this.password,
			})
			switch (status) {
				case 200:
					this.$router.push('/')
					return
				case 500:
					this.errMsg = 'error: API seems to be down, please contact website admin'
					return
				case 400:
					this.errMsg = 'Invalid credentials'
					return
				default:
					this.errMsg = `Unknown error, please contact site admin, give him this: [err ${status} on login]`
					return
			}
		},
	},
})
</script>
