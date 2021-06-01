<template>
	<div class="hidden"></div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	name: 'HelperInitState',
	async fetch() {
		localStorage.setItem('apiUrl', this.$axios.defaults.baseURL!)
		await this.$store.dispatch('connection/init')
	},
	fetchOnServer: false,
})
</script>
