import { Socket } from "socket.io-client"

export default class Peers {
	private socket: Socket
	private peers: Map<string, RTCPeerConnection>
	private constraints = { audio: true, video: true }
	private config = {
		iceServers: [
			{
				'urls': 'stun:stun.l.google.com:19302',
			},
			{
				'urls': 'turn:mle-moni.fr',
				'username': 'test',
				'credential': 'test123'
			}
		]
	}
	private selfVideo: HTMLVideoElement
	private peersVideosContainer: HTMLElement
	constructor(socket: Socket, selfVideo: HTMLVideoElement, peersVideosContainer: HTMLElement) {
		this.socket = socket
		this.selfVideo = selfVideo
		this.peersVideosContainer = peersVideosContainer
		this.peers = new Map<string, any>()
	}
	unsetEvents() {
		const socket = <any>this.socket
		socket.removeAllListeners('conferences/userGone')
		socket.removeAllListeners('conferences/signaling')
	}
	setupEvents() {
		this.socket.on('conferences/userGone', (peerId: string) => {
			const pc = this.peers.get(peerId)
			if (!pc) return
			const peerVideo = document.getElementById(`peer_video_${peerId}`)
			if (peerVideo) {
				peerVideo.parentNode!.removeChild(peerVideo)
			}
			pc.close()
			this.peers.delete(peerId)
		})
		this.socket.on('conferences/signaling', (peerId: string, type: string, body: any) => {
			const pc = this.peers.get(peerId)
			if (type === 'offer') {
				this.newPeerOffer(peerId, body)
				return
			}
			if (!pc) throw new Error(`Bad peer id ${peerId} at signaling event ${type}`)
			if (type === 'candidate') {
				pc.addIceCandidate(new RTCIceCandidate(body))
			} else if (type === 'answer') {
				pc.setRemoteDescription(body)
			} else {
				console.error(`Unknown signaling event: ${type}`)
			}
		})
	}
	newPeerOffer(peerId: string, description: any) {
		const newPc = this.createPeerConnection(peerId)
		if (!newPc) return
		const offerPc = newPc
		offerPc.setRemoteDescription(description)
			.then(() => offerPc.createAnswer())
			.then(sdp => offerPc.setLocalDescription(sdp))
			.then(() => {
				this.socket.emit('conferences/signaling', peerId, 'answer', offerPc.localDescription)
			})
	}
	getAll() {
		return this.peers
	}
	createPeerConnection(peerId: string) {
		const peerVideo = this.createVideoElement(peerId)
		const pc = new RTCPeerConnection(this.config)
		this.peers.set(peerId, pc)
		this.setupIceEvent(pc, peerId)
		this.setupPeerStreamEvent(pc, peerVideo)
		this.sendStreamToPeer(pc)
		return pc
	}
	sendStreamToPeer(pc: RTCPeerConnection) {
		const stream = <MediaStream>this.selfVideo.srcObject
		if (!stream) {
			return
		}
		stream.getTracks().forEach((track: any) => pc.addTrack(track, stream))
	}
	// setup peer and start signaling process
	addPeer(peerId: string) {
		const pc = this.createPeerConnection(peerId)

		pc.createOffer()
			.then(sdp => pc.setLocalDescription(sdp))
			.then(() => {
				this.socket.emit('conferences/signaling', peerId, 'offer', pc.localDescription)
			})
	}
	setupIceEvent(pc: RTCPeerConnection, peerId: string) {
		pc.onicecandidate = event => {
			if (event.candidate) {
				this.socket.emit('conferences/signaling', peerId, 'candidate', event.candidate)
			}
		}
	}
	setupPeerStreamEvent(pc: RTCPeerConnection, peerVideo: HTMLVideoElement) {
		pc.ontrack = event => {
			peerVideo.srcObject = event.streams[0]
		}
	}
	createVideoElement(peerId: string) {
		const video = document.createElement('video')
		video.setAttribute('playsinline', '')
		video.setAttribute('autoplay', '')
		video.id = `peer_video_${peerId}`
		this.peersVideosContainer.appendChild(video)
		return video
	}
}

