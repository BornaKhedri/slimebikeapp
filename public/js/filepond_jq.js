var imageId = '';
var cont_btn_element = $("#classification_continue");

FilePond.registerPlugin(

        // previews dropped images
        FilePondPluginImagePreview,
    // corrects mobile image orientation
    FilePondPluginImageExifOrientation,
    // encodes the file as base64 data
    // FilePondPluginFileEncode,
    // validates the size of the file
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType, // validate type

    FilePondPluginImageResize,
    FilePondPluginImageTransform
);

// Select the file input and use create() to turn it into a pondd
FilePond.create(
    document.querySelector('input[type="file"]'), {
    acceptedFileTypes: ['image/*'],
    allowImageExifOrientation: true,
    imageCropAspectRatio: '1:1',
    imageResizeTargetWidth: 600,
    imageResizeTargetHeight: 600,
    imageResizeUpscale: false,
    imageResizeMode: 'cover',
    instantUpload: true,
    imageTransformOutputQuality: 85,
    fileMetadataObject: {
        'socketId': socket.id
    },
    // allowFileEncode: false,
    server: {
        process: {
            url: './upload',
            onload: (response) => {
                console.log("file successfully uploaded with id: " + response)
                imageId = JSON.parse(response)[0];
                // show the classification continue button
                cont_btn_element.prop('disabled', false);
                cont_btn_element.html("Continue &nbsp; <i class='fas fa-chevron-right'></i>")
            }
        },
        revert: (uniqueFileId, load, error) => {
            console.log("reverting: " + uniqueFileId);

            cont_btn_element.prop('disabled', true);
            cont_btn_element.html('Continue on image upload &nbsp;<i class="fas fa-chevron-right">')
            // trigger deletion on the server
            socket.emit('delete_image', {
                imageId: imageId
            });
            imageId = '';
            $("#city_name")
                .empty()
                .append("<p id='city'>" + city + "</p>");
            // cont_btn_element.style.visibility = 'hidden';
            // Can call the error method if something is wrong, should exit after
            error('oh my goodness');

            // Should call the load method when done, no parameters required
            load();
        },
        remove: (source, load, error) => {

            // Should somehow send `source` to server so server can remove the file with this source
            console.log("In remove with source: " + source);
            // Can call the error method if something is wrong, should exit after
            error('oh my goodness');

            // Should call the load method when done, no parameters required
            load();
        }

    },
    labelIdle: `<div class="darktext black-border" style="font-size: 1.2rem;"> <span> <i class="far fa-image fa-9x" style="font-size: 2rem;"></i> <bold> <br>Please click to submit a picture </bold></span> </div>`,
    allowRevert: true
}
);

document.addEventListener('FilePond:loaded', e => {
    console.log('FilePond ready for use', e.detail);
    cont_btn_element.prop("disabled", true);
});

const pond = document.querySelector('.filepond--root');
// this is called when a file is added - before it is uploaded
pond.addEventListener('FilePond:addfile', e => {
    // socket.emit('image_received', {
    //     image: e.detail.file.getFileEncodeBase64String()
    // });
    console.log('File added', e.detail);
    e.detail.file.setMetadata("socketId", socket.id);
    $('#infraction_div').removeClass('low-opacity');
    $('#infraction_div').addClass('high-opacity');
    $('#company_div').removeClass('low-opacity');
    $('#company_div').addClass('high-opacity');
    var position = $("#infraction_list").offset().top;
    $("HTML, BODY").animate({
        scrollTop: position
    }, 1000);
});