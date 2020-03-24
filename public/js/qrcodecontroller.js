var vehicle_id = '';
const constraints = window.constraints = {
  audio: false, 
  video: {
    facingMode: {
      exact: "environment"
    }
  },
};

window.addEventListener('load', function () {
  let selectedDeviceId;
  const codeReader = new ZXing.BrowserMultiFormatReader()
  console.log('ZXing code reader initialized')
  codeReader.getVideoInputDevices()
    .then((videoInputDevices) => {
      console.log(videoInputDevices);

      codeReader.decodeFromConstraints(constraints, 'video', (result, err) => {
        if (result) {
          vehicle_id = result.text
          console.log(result)
          document.getElementById('result').textContent = vehicle_id
          codeReader.stopContinuousDecode()
          jQuery('#video').remove();
        }
        if (err && !(err instanceof ZXing.NotFoundException)) {
          console.error(err)
          document.getElementById('result').textContent = err
        }
        // document.getElementById('startButton').addEventListener('click', () => {
        //   codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
        //     if (result) {
        //       vehicle_id = result
        //       console.log(result)
        //       document.getElementById('result').textContent = result.text
        //     }
        //     if (err && !(err instanceof ZXing.NotFoundException)) {
        //       console.error(err)
        //       document.getElementById('result').textContent = err
        //     }
        //   })
        //   console.log(`Started continous decode from camera with id ${selectedDeviceId}`)
        // })

        // document.getElementById('resetButton').addEventListener('click', () => {
        //   codeReader.reset()
        //   document.getElementById('result').textContent = '';
        //   console.log('Reset.')
        // })

      })
        .catch((err) => {
          console.error(err)
        })
    })
  });