  const imageInput = document.getElementById('wheel_image');
  const imageControl = document.getElementById('image_control');
  var dataURL = '';
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  imageInput.addEventListener('change', handleFileSelect, false);


  function handleFileSelect(event) {
      // Get the FileList object from the file select event
      var files = event.target.files;

      // Check if there are files in the FileList
      if (files.length === 0) {
          return;
      }

      // For this example we only want one image. We'll take the first.
      var file = files[0];

      // Check that the file is an image
      if (file.type !== '' && !file.type.match('image.*')) {
          return;
      }
      // The URL API is vendor prefixed in Chrome
      window.URL = window.URL || window.webkitURL;

      // Create a data URL from the image file
      var imageURL = window.URL.createObjectURL(file);

      loadAndDrawImage(imageURL);
  }

  function loadAndDrawImage(url) {
      // Create an image object. This is not attached to the DOM and is not part of the page.
      var image = new Image();

      // When the image has loaded, draw it to the canvas
      image.onload = function() {
          // draw image...
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          dataURL = canvas.toDataURL();
          imageControl.parentNode.removeChild(imageControl);
          var cont_btn_element = document.getElementById("classification_continue");
          cont_btn_element.style.visibility = 'visible';
      }

      // Now set the source of the image that we want to load
      image.src = url;
  }
  