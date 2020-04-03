var imageId = '';
var cont_btn_element = document.getElementById("classification_continue");

FilePond.registerPlugin(

    // encodes the file as base64 data
    FilePondPluginFileEncode,

    // validates the size of the file
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType, // validate type

    // corrects mobile image orientation
    FilePondPluginImageExifOrientation,

    // previews dropped images
    FilePondPluginImagePreview
);

// Select the file input and use create() to turn it into a pondd
FilePond.create(
    document.querySelector('input[type="file"]'), {
    acceptedFileTypes: ['image/*'],

    allowFileEncode: false,
    server: {
        process: {
            url: './upload',
            onload: (response) => {
                console.log("file successfully uploaded with id: " + response)
                imageId = JSON.parse(response)[0];
                // show the classification continue button
                cont_btn_element.style.visibility = 'visible';
            }
        },
        revert: (uniqueFileId, load, error) => {
            console.log("reverting: " + uniqueFileId);
            // trigger deletion on the server
            socket.emit('delete_image', {
                imageId: imageId
            });
            imageId = '';

            cont_btn_element.style.visibility = 'hidden';
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
    labelIdle: `Please click to submit a picture`,
    allowRevert: true
}
);

document.addEventListener('FilePond:loaded', e => {
    console.log('FilePond ready for use', e.detail);
});

const pond = document.querySelector('.filepond--root');
// this is called when a file is added - before it is uploaded
pond.addEventListener('FilePond:addfile', e => {
    // socket.emit('image_received', {
    //     image: e.detail.file.getFileEncodeBase64String()
    // });
    console.log('File added', e.detail);
    $('#infraction_div').removeClass('low-opacity');
    $('#infraction_div').addClass('high-opacity');
    $('#company_div').removeClass('low-opacity');
    $('#company_div').addClass('high-opacity');
    var position = $("#infraction_list").offset().top;
    $("HTML, BODY").animate({
        scrollTop: position
    }, 1000);
});