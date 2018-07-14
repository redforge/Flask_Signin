var API_URL = '/api/scan/process';
//var recentList = document.getElementById('recentScans');

var handleResponse = ({ target }) => {
  // when flask responds...
  document.getElementById('recentScans').innerHTML += (target.responseText);

  console.log(target.responseText);
};

var list = document.getElementById('recentScans');

let options = {
  continuous: true,
  video: document.getElementById('preview'),
  mirror: true,
  captureImage: false,
  backgroundScan: false, //run if tab isnt active
  refractoryPeriod: 50,  //how much time between repeat scans in ms
  scanPeriod: 1
};
let scanner = new Instascan.Scanner(options);
scanner.addListener('scan', function (content) {
  //Executes upon a valid scan
  var xhr = new XMLHttpRequest();
  var data = new FormData();

  data.append('input', content);
  xhr.addEventListener('load', handleResponse);
  xhr.open('POST', API_URL);
  xhr.send(data);

  console.log(content);
});
Instascan.Camera.getCameras().then(function (cameras) {
  if (cameras.length > 0) {
    scanner.start(cameras[0]);
  } else {
    console.error('No cameras found.');
  }
}).catch(function (e) {
  console.error(e);
});
