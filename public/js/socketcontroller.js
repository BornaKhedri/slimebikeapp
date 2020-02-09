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
      infraction_types: infraction_types, 
      company: company_name, 
      vehicle_id: vehicle_id
    }
  });

  window.location.href = "./html/thanks.html";
}