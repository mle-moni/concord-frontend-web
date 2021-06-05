<template>
	<HelperNeedAuth>
		<!-- You are in {{roomName}} -->
		<!-- my video -->
		<div v-if="!roomJoined" class="flex justify-center">
			<button class="" @click="joinTheRoom">Join room</button>
		</div>
		<video id="main-video" class="w-1/6 fixed" playsinline autoplay muted></video>
		<div id="peers-videos" class="w-full flex justify-center">
			<!-- peers' videos will be created inside this div -->
		</div>
		<div id="peers-videos-ids"></div>

		<div class="fixed left-0 bottom-0 w-full flex flex-col justify-center">
			<button @click="showOptions">
				Show options
			</button>
			<div :class="{'hidden': !showOpts}">
				<div class="p-10">
					<section class="select">
						<label for="audio-source">Audio device : </label>
						<select id="audio-source"></select>
					</section>

					<section>
						<label for="video-source">Video device : </label>
						<select id="video-source"></select>
					</section>
				</div>
			</div>
		</div>
	</HelperNeedAuth>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Socket } from 'socket.io-client'
import { getSocket, setCallback } from '~/helpers/socket.io/init'
import Peers from '~/helpers/conferences/Peers'
import {
	MyVideoParameter,
	getStream,
	setMyVideoParam,
	joinRoom,
	initStreamSource,
} from '~/helpers/conferences/streams'

@Component
export default class ConferenceRoom extends Vue {
	public roomJoined: boolean = false
	public showOpts: boolean = false
	public roomName: string = this.$route.params.room
	public peers: Peers | undefined
	public myVideo: MyVideoParameter | undefined
	public socket: Socket | undefined

	showOptions() {
		this.showOpts = !this.showOpts
	}

	setupEvents(socket: Socket) {
		this.socket = socket
		this.myVideo = {
			elem: <HTMLVideoElement>document.getElementById('main-video'),
			audioSource: <HTMLSelectElement>document.getElementById('audio-source'),
			videoSource: <HTMLSelectElement>document.getElementById('video-source'),
			stream: null,
		}
		setMyVideoParam(this.myVideo)
		const peersContainer = document.getElementById('peers-videos')!
		const peersContainerIds = document.getElementById('peers-videos-ids')!
		this.myVideo.audioSource.onchange = getStream
		this.myVideo.videoSource.onchange = getStream

		// user start to see his video stream
		initStreamSource()

		this.peers = new Peers(socket, this.myVideo.elem, peersContainer, peersContainerIds)
		this.peers.setupEvents() // init socket events
		this.socket.on('conferences/getRoomUsers', this.getRoomUsers)
	}

	unsetEvents(socket: Socket) {
		if (this.peers) {
			this.peers.unsetEvents()
		}
		socket.off('conferences/getRoomUsers', this.getRoomUsers)
		if (this.myVideo) {
			this.myVideo.audioSource.innerHTML = ''
			this.myVideo.videoSource.innerHTML = ''
		}
	}

	mounted() {
		setCallback('login', this.setupEvents)
	}

	beforeDestroy() {
		if (this.socket) {
			this.socket.emit('conferences/partRoom', this.roomName)
			this.unsetEvents(this.socket)
		}
		if (this.myVideo?.stream) {
			this.myVideo.stream.getTracks().forEach((track) => {
				if (track.readyState == 'live') {
					track.stop()
				}
			})
			this.myVideo.stream = null
		}
	}

	joinTheRoom() {
		if (!this.socket) throw new Error('socket is not defined')
		this.roomJoined = true
		joinRoom(this.socket, this.roomName)
	}
	// socket event
	getRoomUsers(usersArray: string[]) {
		for (let peerId of usersArray) {
			this.peers!.addPeer(peerId)
		}
	}
}
</script>
