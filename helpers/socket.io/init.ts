import { io, Socket } from 'socket.io-client'
import { setupEvents } from './events'
import { Store } from 'vuex'

let socket: Socket | undefined
let authenticated = false
let store: Store<any> | undefined

function initSocket() {
	const url = localStorage.getItem('apiUrl')
	if (!url) {
		throw new Error("error: apiUrl not defined in localStorage")
	}
	socket = io(url)
	setupEvents(socket)
}

function getSocket() {
	return socket
}

function getAuthenticated() {
	return authenticated
}

function setAuthenticated(val: boolean) {
	authenticated = val
	if (!val && socket) {
		socket.disconnect()
		socket = undefined
	}
}

function getStore() {
	return store
}

function setStore(val: Store<any>) {
	store = val
}

export { initSocket, getSocket, getAuthenticated, setAuthenticated, getStore, setStore }
