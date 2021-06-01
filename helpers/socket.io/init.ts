import { io, Socket } from 'socket.io-client'
import { setupEvents } from './events'

let socket: Socket | undefined
let authenticated = false

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

export { initSocket, getSocket, getAuthenticated, setAuthenticated }
