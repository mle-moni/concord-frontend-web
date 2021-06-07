import { Socket } from "socket.io-client"
import { UserPublicData } from "../types/ApiTypes"

export default class Peers {
	private socket: Socket
	private peers = new Map<string, RTCPeerConnection>()
	private peersData = new Map<string, UserPublicData>()
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
	private peersVideosIdsContainer: HTMLElement
	public visiblePeer = ''
	constructor(socket: Socket, selfVideo: HTMLVideoElement, peersVideosContainer: HTMLElement, peersVideosIdsContainer: HTMLElement) {
		this.socket = socket
		this.selfVideo = selfVideo
		this.peersVideosContainer = peersVideosContainer
		this.peersVideosIdsContainer = peersVideosIdsContainer
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
			const peerButton = document.getElementById(`peer_id_${peerId}`)
			if (peerButton) {
				peerButton.parentNode!.removeChild(peerButton)
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
		const peerVideo = this.createVideoElement(peerId, this.peers.size)
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
	addPeer(peer: { socketId: string; user: UserPublicData }) {
		const peerId = peer.socketId
		const pc = this.createPeerConnection(peerId)
		this.peersData.set(peerId, peer.user)
		const button = document.getElementById(`peer_id_${peerId}`)
		if (button) {
			button.textContent = peer.user.username
		}
		pc.createOffer()
			.then(sdp => pc.setLocalDescription(sdp))
			.then(() => {
				this.socket.emit('conferences/signaling', peerId, 'offer', pc.localDescription)
			})
	}
	addPeerData(peerId: string, user: UserPublicData) {
		this.peersData.set(peerId, user)
		const button = document.getElementById(`peer_id_${peerId}`)
		if (button) {
			button.textContent = user.username
		}
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
	createVideoElement(peerId: string, peersCount: number) {
		const video = document.createElement('video')
		if (peersCount !== 0) {
			video.style.display = 'none'
		} else {
			this.visiblePeer = peerId
		}
		video.style.width = '90vw'
		video.style.maxHeight = '70vh'
		video.setAttribute('playsinline', '')
		video.setAttribute('autoplay', '')
		video.id = `peer_video_${peerId}`
		this.peersVideosContainer.appendChild(video)
		const button = document.createElement('button')
		button.textContent = this.peersData.get(peerId)?.username || peerId
		button.id = `peer_id_${peerId}`
		button.style.padding = '6px'
		button.onclick = () => {
			this.changePeerVisibility(this, peerId)
		}
		this.peersVideosIdsContainer.appendChild(button)
		return video
	}
	changePeerVisibility(self: Peers, peerId: string) {
		const peerVideoToHide = document.getElementById(`peer_video_${self.visiblePeer}`)
		if (peerVideoToHide) {
			peerVideoToHide.style.display = 'none'
		}
		const peerVideo = document.getElementById(`peer_video_${peerId}`)
		if (peerVideo) {
			peerVideo.style.display = 'block'
			self.visiblePeer = peerId
		}
	}
}
