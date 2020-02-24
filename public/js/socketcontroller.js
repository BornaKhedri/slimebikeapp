// Code related to creating and managing the socket connection etc. 
var socket = io.connect('https://128.95.204.113:3000');

socket.on('news', function (data) {
  console.log(data);

});

var socket_submit = function() {

  socket.emit('case_report', {
    case_data: {
      img: dataURL, 
      location: [longitude, latitude], 
      infraction_ids: infraction_ids, 
      company_ids: company_ids, 
      vehicle_id: vehicle_id, 
      city: city
    }
  });

  window.location.href = "./html/thanks.html";
}