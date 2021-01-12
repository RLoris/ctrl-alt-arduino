const canvas = document.querySelector('#canvas');
const preview = document.querySelector('#preview');
const ctx = canvas.getContext('2d');
const ctx2 = preview.getContext('2d');
const video = document.createElement('video');
let net = null, width = 0, height = 0, modelLoaded = false, timeoutId = null, ws, isDetected = false, isInitialSetup = false, initialPose = {}, isPlaying = false, defeatRadius = 30;

const bodyParts = {
    nose: "nose",
    leftEye: "leftEye",
    rightEye: "rightEye",
    leftEar: "leftEar",   
    rightEar: "rightEar",
    leftShoulder: "leftShoulder",     
    rightShoulder: "rightShoulder",
    leftElbow: "rightElbow",
    rightElbow: "leftElbow",
    leftWrist: "leftWrist",
    rightWrist: "rightWrist",
    leftHip: "leftHip",     
    rightHip: "rightHip",
    leftKnee: "leftKnee",
    rightKnee: "rightKnee",
    leftAnkle: "leftAnkle",
    rightAnkle: "rightAnkle"
}

const requiredBodyParts = [bodyParts.leftShoulder, bodyParts.rightShoulder, bodyParts.leftElbow, bodyParts.rightElbow, bodyParts.nose, bodyParts.rightEye, bodyParts.leftEye];

window.onload = () => {
  ws = io('http://localhost:3000');
}

let isLaunched = false;

window.addEventListener('keydown', (ev) => {
  if(ev.code === 'Space' && !isLaunched) {
    isLaunched = true;
    setTimeout(() => {
      isInitialSetup = true;
      ws.emit('init', {});
    }, 3000);
    startCapture();
  }
});

function startCapture() {
  navigator.mediaDevices.getUserMedia({audio: false, video: true}).then(
    (stream) => {
      console.log('stream loaded');
      video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth;
        preview.width = video.videoWidth;
        width = video.videoWidth;
        canvas.height = video.videoHeight;
        preview.height = video.videoHeight;
        height = video.videoHeight;
        setup(width, height);
      });
      video.addEventListener('play', drawToCanvas);
      video.srcObject = stream;
      video.muted = true;
      video.controls = false;
      video.play();
    }
  ).catch((e) => { console.log('error ', e); });
}

async function setup(w, h) {
  try {
    net = await posenet.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: { width: w, height: h },
      multiplier: 0.5
    });
    modelLoaded = true;
    preview.style.left = canvas.getBoundingClientRect().x + 'px';
    preview.style.top = canvas.getBoundingClientRect().y + 'px';
  } catch(e) {
    modelLoaded = false;
  }
}

async function drawToCanvas() {
  // draw to canvas
  ctx.drawImage(video, 0, 0);
  if (modelLoaded) {
    const pose = await net.estimateSinglePose(canvas, {
      flipHorizontal: false
    });
    ctx2.clearRect(0, 0, preview.width, preview.height);
    if(pose.score < 0.5) {
      if(timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        ctx2.clearRect(0, 0, preview.width, preview.height);
        if (isDetected) {
          isDetected = false;
          ws.emit('move', {});
        }
      }, 1000); 
    }
    const msg = {};
    pose.keypoints.forEach(p => {
      if (p.score > 0.5) {
        if (p.position.x >= 0 && p.position.y >= 0 && requiredBodyParts.indexOf(p.part) !== -1) {
          if(initialPose[p.part] && initialPose[p.part].color === 'red') {
            ctx2.fillStyle = 'red';
          } else {
            ctx2.fillStyle = 'orange';
          }
          ctx2.beginPath();
          ctx2.fillRect(p.position.x, p.position.y, 5, 5);
          ctx2.stroke();
          msg[p.part] = p.position;
          isDetected = true;
          if(isInitialSetup) {
            // save first pose location
            initialPose[p.part] = p.position;
            initialPose[p.part].color = 'green';
            if(Object.keys(initialPose).length === requiredBodyParts.length) {
              console.log(initialPose);
              isInitialSetup = false;
              isPlaying = true;
            } 
          } else if(isPlaying) {
            const partLocation = initialPose[p.part];
            if((p.position.x > partLocation.x + defeatRadius || p.position.x < partLocation.x - defeatRadius) && (p.position.y > partLocation.y + defeatRadius || p.position.y < partLocation.y - defeatRadius)) {
              console.log('lost', p.part, p, partLocation);
              ws.emit('move', p);
              partLocation.color = 'red';
              isPlaying = false;
            }
          }
        }
      }
    });
    Object.values(initialPose).forEach(partLocation => {
      ctx2.strokeStyle = partLocation.color;
      ctx2.beginPath();
      ctx2.arc(partLocation.x, partLocation.y, defeatRadius, 0, 2 * Math.PI);
      ctx2.stroke();
      if (partLocation.color === 'red') {
        video.pause();
      }
    });
    /*
    if(ws && ws.connected) {
      if(send) {
        ws.emit('detection', msg);
      } else if(isDetected) {
        isDetected = false;
        ws.emit('detectionLost', {});
      }
    }*/
    // console.log(pose.keypoints);
  }
  requestAnimationFrame(drawToCanvas);
}