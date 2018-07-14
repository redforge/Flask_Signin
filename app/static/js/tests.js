var API_URL = '/api/test/print';
//var recentList = document.getElementById('recentScans');

var handleResponse = ({ target }) => {
  // when flask responds...
  console.log(target.responseText);
};

$(document).ready(function() {
  $('#form1').submit(function () {
   printForm();
   return false;
  });
});

function printForm() {
  var content = [document.forms["form1"]["text-to-print"].value];
  console.log('printing: ' + content);

  var xhr = new XMLHttpRequest();
  var data = new FormData();

  data.append('input', content);
  xhr.addEventListener('load', handleResponse);
  xhr.open('POST', API_URL);
  xhr.send(data);

  return false;
}
