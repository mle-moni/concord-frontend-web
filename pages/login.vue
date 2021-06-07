<template>
	<HelperLoading v-if="isLoading" />
	<HelperAlreadyConnected v-else-if="connected" />
	<div v-else class="flex justify-center h-4/6">
		<div class="w-4/5 m-auto">
			<FormBasic
				:submitEvent="login"
			>
				<FormBasicInput :model.sync="email" name="email" placeholder="email" />
				<FormBasicInput :model.sync="password" name="password" placeholder="password" type="password" />
				<FormBasicSubmit>Login</FormBasicSubmit>
				<HelperError>{{errMsg}}</HelperError>
			</FormBasic>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class Login extends Vue {
	public errMsg: string = ''
	public email: string = ''
	public password: string = ''

	async login(): Promise<void> {
		const status: number = await this.$store.dispatch('connection/login', {
			email: this.email,
			password: this.password,
		})
		switch (status) {
			case 200:
				const url: string = this.$store.state.connection.afterLoginUrl
				this.$store.commit('connection/setUrl', '/')
				this.$router.push(url)
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
	}
	get isLoading(): boolean {
		return this.$store.state.connection.loading
	}
	get connected(): boolean {
		return this.$store.state.connection.connected
	}
}
</script>

