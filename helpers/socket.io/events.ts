import { Socket } from "socket.io-client"
import { setAuthenticated, getStore } from "./init"


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
	// example of getStore usage
	// getStore()!.state.connection.user
}

export { setupEvents }
