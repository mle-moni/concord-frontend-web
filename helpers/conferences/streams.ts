import { Socket } from "socket.io-client"

interface MyVideoParameter {
	elem: HTMLVideoElement
	audioSource: HTMLSelectElement
	videoSource: HTMLSelectElement
	stream: MediaStream | null
}

let myVideo: MyVideoParameter | undefined
let ready = false
let socket: Socket | undefined
let localDeviceInfo: MediaDeviceInfo[] = []
let roomName = ''

function setMyVideoParam(param: MyVideoParameter) {
	myVideo = param
}

function getStream() {
	if (!myVideo) throw new Error('Error in getStream, myVideo is undefined')
	if (myVideo.stream) {
		myVideo.stream.getTracks().forEach(track => track.stop())
	}
	const audioSourceValue = myVideo.audioSource.value
	const videoSourceValue = myVideo.videoSource.value
	const constraints = {
		audio: { deviceId: audioSourceValue ? { exact: audioSourceValue } : undefined },
		video: { deviceId: videoSourceValue ? { exact: videoSourceValue } : undefined },
	}
	return navigator.mediaDevices
		.getUserMedia(constraints)
		.then(newStream)
		.catch(e => console.error(e))
}

function newStream(stream: MediaStream) {
	if (!myVideo) throw new Error('Error in newStream, myVideo is undefined')
	myVideo.audioSource.selectedIndex = [...(myVideo.audioSource.options as any)].findIndex(
		option => option.text === stream.getAudioTracks()[0].label
	)
	myVideo.videoSource.selectedIndex = [...(myVideo.videoSource.options as any)].findIndex(
		option => option.text === stream.getVideoTracks()[0].label
	)
	myVideo.stream = stream
	myVideo.elem.srcObject = stream
	if (ready) {
		socket!.emit('conferences/joinRoom', roomName)
	}
}

// create a stream in order to init #video-source and #audio-source options
function initStreamSource() {
	const ret = getStream()
	if (!ret) throw new Error('Error in initStreamSource, getStream did not return the promise')
	if (!myVideo) throw new Error('Error in initStreamSource, myVideo is undefined')
	ret.then(() => navigator.mediaDevices.enumerateDevices())
		.then(deviceInfos => {
			localDeviceInfo = deviceInfos
			for (let device of deviceInfos) {
				const option = document.createElement('option')
				option.value = device.deviceId
				if (device.kind === 'videoinput') {
					option.text = device.label || `camera with no label`
					myVideo!.videoSource.appendChild(option)
				} else if (device.kind === 'audioinput') {
					option.text = device.label || 'mic with no label'
					myVideo!.audioSource.appendChild(option)
				}
			}
		})
}

function joinRoom(sock: Socket, name: string) {
	socket = sock
	ready = true
	roomName = name
	getStream()
}


export { MyVideoParameter, setMyVideoParam, initStreamSource, joinRoom, getStream }
