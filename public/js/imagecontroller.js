// This file handles the image related tasks in the classification tab 

// TODO: Ensure the canvas displays a smaller than actual one and 
//          that still looks good and saves the full reslution image to the database.

const imageInput = document.getElementById('wheel_image');
const imageControl = document.getElementById('image_control');
var dataURL = '';
// imageInput.addEventListener('change', handleFileSelect, false);
// window.onload = getExif;
$("#wheel_image").change(function () {
    window.performance.mark('start_imageChange');
    var file = this.files[0];  // file
       
    // Make sure the orientation of the displayed image is appropriate
    EXIF.getData(file, function () {
        window.performance.mark('start_exifGetData');
        var orientation = EXIF.getTag(this, "Orientation");
        var can = document.getElementById("canvas");
        var ctx = can.getContext('2d');
        var thisImage = new Image;

        thisImage.onload = function () {
            window.performance.mark('start_exifOnLoad');
            // can.width = thisImage.width;
            // can.height = thisImage.height;
            ctx.save();
            var width = can.width; var styleWidth = can.style.width;
            var height = can.height; var styleHeight = can.style.height;
            if (orientation) {
                if (orientation > 4) {
                    // can.width = height; can.style.width = styleHeight;
                    // can.height = width; can.style.height = styleWidth;
                }
                switch (orientation) {
                    case 2: 
                        ctx.translate(width, 0); 
                        ctx.scale(-1, 1); 
                        break;
                    case 3: 
                        ctx.translate(width, height); 
                        ctx.rotate(Math.PI); 
                        break;
                    case 4: 
                        ctx.translate(0, height); 
                        ctx.scale(1, -1); 
                        break;
                    case 5: 
                        ctx.rotate(0.5 * Math.PI); 
                        ctx.scale(1, -1); 
                        break;
                    case 6: 
                        ctx.rotate(0.5 * Math.PI); 
                        ctx.translate(0, -height); 
                        break;
                    case 7: 
                        ctx.rotate(0.5 * Math.PI); 
                        ctx.translate(width, -height); 
                        ctx.scale(-1, 1); 
                        break;
                    case 8: 
                        ctx.rotate(-0.5 * Math.PI); 
                        ctx.translate(-width, 0); 
                        break;
                }
            }

            ctx.drawImage(thisImage, 0, 0, width, height);
            ctx.restore();
            dataURL = can.toDataURL();
            // imageControl.parentNode.removeChild(imageControl);
            var cont_btn_element = document.getElementById("classification_continue");
            cont_btn_element.style.visibility = 'visible';
            // at this point you can save the image away to your back-end using 'dataURL'

            window.performance.mark('end_exifOnLoad');
            window.performance.measure('get_exifOnLoad_exec', 'start_exifOnLoad', 'end_exifOnLoad');
        }
        // The URL API is vendor prefixed in Chrome
        window.URL = window.URL || window.webkitURL;

        // Create a data URL from the image file
        thisImage.src = window.URL.createObjectURL(file);

        // // now trigger the onload function by setting the src to your HTML5 file object (called 'file' here)
        // thisImage.src = URL.createObjectURL(file);
        window.performance.mark('end_exifGetData');
        window.performance.measure('get_exifGetData_exec', 'start_exifGetData', 'end_exifGetData');

    });

    window.performance.mark('end_imageChange');
    window.performance.measure('get_imageChange_exec', 'start_imageChange', 'end_imageChange');
})