import React, { useState } from "react";
// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImageResize,
  FilePondPluginImageTransform
);

function Classification() {
  const [image, setImage] = useState([]);

  return (
    <div>
      <div className="App">
        <FilePond
          data-max-file-size="10MB" 
          files={image}
          allowMultiple={false}
          onupdatefiles={setImage}
          labelIdle='<div class="darktext black-border" style="font-size: 1.2rem;"> <span> <i class="far fa-image fa-9x" style="font-size: 2rem;"></i> <bold> <br>Please click to submit a picture </bold></span> </div>'
        />
      </div>
    </div>
  );
}

export default Classification;
