const player = document.getElementById('player');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureButton = document.getElementById('capture');
var dataURL = '';

const constraints = {
    video: {
        facingMode: {
            exact: 'environment'
        }
    }
};

captureButton.addEventListener('click', () => {
    context.drawImage(player, 0, 0, canvas.width, canvas.height);
    var video_element = document.getElementById("player");
    video_element.parentNode.removeChild(video_element);
    var cont_btn_element = document.getElementById("classification_continue");
    cont_btn_element.style.visibility = 'visible';
    var capture_btn_element = document.getElementById('capture');
    capture_btn_element.style.visibility = 'hidden';
    // Stop all video streams.
    player.srcObject.getVideoTracks().forEach(track => track.stop());
    dataURL = canvas.toDataURL();
});

navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        // Attach the video stream to the video element and autoplay.
        player.srcObject = stream;
    });