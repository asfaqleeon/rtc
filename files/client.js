var socket = io.connect('http://localhost:3000')

function addUser() {
    let name = $('#userName').val()
    
    socket.emit('add user', name)

    $('#addUser').prop('disabled',true)
}

function msg1() {
    let name = $('#userName').val()
    let message = $('#msg1').val()
    
    socket.emit('msg1', name+': '+message)
}

function call() {
    const peerConnection = new RTCPeerConnection()

    navigator.mediaDevices.getUserMedia({video:true, audio:true})
        .then( stream => {
            const localCam = document.getElementById('localCam')
    
            localCam.srcObject = stream
            localCam.onloadedmetadata = e => {
                localCam.play()
            }
    
            peerConnection.addStream(stream)
            peerConnection.createOffer()
            .then(sdp=>{
                peerConnection.setLocalDescription(sdp)
            })
            
        })
        .then( () => {
            console.log(peerConnection.localDescription)
            socket.emit('offer', peerConnection.localDescription)
        })
        .catch( e=> {
            console.log(e)
        })

        peerConnection.onaddstream = event => {
        }
}

function receive() {
    const peerConnection = new RTCPeerConnection()

    socket.on('offer', message => {
        peerConnection.setRemoteDescription(message)
        .then( () => peerConnection.createAnswer())
        .then( sdp => peerConnection.setLocalDescription(sdp))
        .then( () => {
            socket.emit('answer', peerConnection.localDescription)
        })
    })

    peerConnection.onaddstream = event => {

    }
}

socket.on('get users', data => {
    console.log(data)

    var ul = document.getElementById('userList');
    ul.innerHTML = '';

    data.forEach(userName => {
        $('#userList').append(`<li>${userName}</li>`)
    });
})

socket.on('print msg1', data => {
    $('#si-msg').append(`<li>${name}: ${data}</li>`)
})
