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
import Infraction from './Infraction';
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

var infractions = '';

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImageResize,
  FilePondPluginImageTransform
);

function createInfraction(infraction) {
  return <Infraction key={infraction.infractiontype_id} id={infraction.infractiontype_id} infraction_description={infraction.infraction_description} />;
}

function populateInfractions(infractions) {
  console.log("Populate Infractions called")
  if(infractions.length > 0)
    return infractions.map(createInfraction);
}

function populateCompanies(companies) {

}


function Classification(props) {
  const [image, setImage] = useState([]);
  let socket = props.socket;
  let latitude = props.lnglat[1];
  let longitude = props.lnglat[0];
  var imageId = "";

  if (!isNaN(parseFloat(longitude)) && !isNaN(parseFloat(latitude))) {
    socket.emit("location_sent", {
      lng: longitude,
      lat: latitude,
    });

    socket.on("cityName", function (data) {
      if (data.cityName.length === 1) {
        props.updateCity(data.cityName[0].cityname);

        socket.on("cityInfractions", function (data) {
          console.log(data);
          infractions = data.infractions;
          // if (infractions.length > 0) {
          //   populateInfractions(infractions);
          // } else {
          //   if (!alert("Error: No infractions found."))
          //     window.location.href = "./html/error_noinfractions_company.html";
          // }
        });

        socket.on("cityCompanies", function (data) {
          console.log(data);
          var companies = data.companies;
          if (companies.length > 0) {
            populateCompanies(companies);
          } else {
            if (!alert("Error: No companies found."))
              window.location.href = "./html/error_noinfractions_company.html";
          }
        });
      }
    });
  }

  function onAddFile(err, file) {
    if (err) {
      console.log("File add error ");
      return;
    }
    console.log("File added", file);
  }

  const fetchInfractions = () => {

  };

  const fetchCompanies = () => {};

  var serverActions = {
    process: {
      url: "http://localhost:3002/upload",
      onload: (response) => {
        console.log("file successfully uploaded with id: " + response);
        imageId = JSON.parse(response)[0];
      },
    },
    revert: (uniqueFileId, load, error) => {
      console.log("reverting: " + uniqueFileId);
      // trigger deletion on the server
      socket.emit("delete_image", {
        imageId: imageId,
      });
      imageId = "";

      // Can call the error method if something is wrong, should exit after
      error("oh my goodness");

      // Should call the load method when done, no parameters required
      load();
    },
    remove: (source, load, error) => {
      // Should somehow send `source` to server so server can remove the file with this source
      console.log("In remove with source: " + source);
      // Can call the error method if something is wrong, should exit after
      error("oh my goodness");

      // Should call the load method when done, no parameters required
      load();
    },
  };

  return (
    <div>
      <div className="App">
        <FilePond
          maxFileSize={"10MB"}
          acceptedFileTypes={["image/*"]}
          files={image}
          allowMultiple={false}
          imageCropAspectRatio={"1:1"}
          imageResizeTargetWidth={"300"}
          imageResizeTargetHeight={"300"}
          imageResizeMode={"cover"}
          instantUpload={true}
          imageTransformOutputQuality={"85"}
          onupdatefiles={setImage}
          labelIdle='<div class="darktext black-border" style="font-size: 1.2rem;"> <span> <i class="far fa-image fa-9x" style="font-size: 2rem;"></i> <bold> <br>Please click to submit a picture </bold></span> </div>'
          onaddfile={onAddFile}
          server={serverActions}
        />

        {populateInfractions(infractions)}
        {fetchCompanies()}
      </div>
    </div>
  );
}

export default Classification;
