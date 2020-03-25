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
  window.performance.mark('start_qrcodeLoad');
  let selectedDeviceId;
  const codeReader = new ZXing.BrowserMultiFormatReader()
  console.log('ZXing code reader initialized')
  codeReader.getVideoInputDevices()
    .then((videoInputDevices) => {
      console.log(videoInputDevices);

      codeReader.decodeFromConstraints(constraints, 'video', (result, err) => {
        window.performance.mark('start_decodeFromConstraints');
        if (result) {
          vehicle_id = result.text
          console.log(result)
          document.getElementById('result').textContent = vehicle_id
          codeReader.stopContinuousDecode()
          $('#video').remove();
        }
        if (err && !(err instanceof ZXing.NotFoundException)) {
          console.error(err)
          document.getElementById('result').textContent = err
        }
        window.performance.mark('end_decodeFromConstraints');
        window.performance.measure('get_decodeFromConstraints_exec', 'start_decodeFromConstraints', 'end_decodeFromConstraints');
      })
        .catch((err) => {
          console.error(err)
        })

    })
  window.performance.mark('end_qrcodeLoad');
  window.performance.measure('get_qrcodeLoad_exec', 'start_qrcodeLoad', 'end_qrcodeLoad');
});