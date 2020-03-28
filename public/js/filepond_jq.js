var imageId = '';

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

// Select the file input and use create() to turn it into a pond
FilePond.create(
    document.querySelector('input'), {
    acceptedFileTypes: ['image/*'],
    allowFileEncode: true,
    server: {
        process: {
            url: './upload',
            onload: (response) => {
                console.log("file successfully uploaded with id: " + response)
                imageId = response;
            }
        },
        revert: (uniqueFileId, load, error) => {
            console.log("reverting: " + uniqueFileId);
            imageId = '';


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
pond.addEventListener('FilePond:addfile', e => {
    console.log('File added', e.detail);
});