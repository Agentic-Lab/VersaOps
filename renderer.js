const startButton = document.getElementById('start-interaction')

// add listner to start button
startButton.addEventListener('click', async () => {
  // send message to main process
  const session = await window.api.initSession()

  // Create a peer connection
  const pc = new RTCPeerConnection();

  // Set up to play remote audio from the model
  const audioEl = document.createElement("audio");
  audioEl.autoplay = true;
  pc.ontrack = e => audioEl.srcObject = e.streams[0];

  // Add local audio track for microphone input in the browser
  const ms = await navigator.mediaDevices.getUserMedia({
    audio: true
  });

  pc.addTrack(ms.getTracks()[0]);

  // Set up data channel for sending and receiving events
  const dc = pc.createDataChannel("oai-events");
  dc.addEventListener("message", (e) => {
    // Realtime server events appear here!
    console.log(e);
  });

  // Start the session using the Session Description Protocol (SDP)
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  const sdpResponse = await window.api.getSdpResponse(session, offer);

  const answer = {
    type: "answer",
    sdp: sdpResponse,
  };
  await pc.setRemoteDescription(answer);
})
