import { Socket } from "socket.io-client"
import { setAuthenticated } from "./init"

function getToken(): string {
	return localStorage.getItem('token') || ''
}

function setupEvents(socket: Socket) {
	socket.on('auth', (type) => {
		switch (type) {
			case 'request':
				socket.emit('auth', getToken())
				break
			case 'failure':
				throw new Error('could not authenticate socket')
			case 'success':
				console.log('socket auth success')
				setAuthenticated(true)
				break
		}
	})
}

export { setupEvents }
