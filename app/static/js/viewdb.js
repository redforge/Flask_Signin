const API_URL = '/api/edit';

$(document).ready(function() {
  $('#actionsForm').submit(function () {
   sendRequest();
   return false;
  });
});

const handleResponse = ({ target }) => {
  // when flask responds...
  console.log(target.responseText);
  if(target.responseText=="success") {
    location.reload();
  }
};

function grabIds() {
  var checkBoxes = document.forms['camperList'].elements['select-box'];
  var checkedIds = [];
  for(var i = 0; i<checkBoxes.length; i++) {
    if (checkBoxes[i].checked) {
      //Values defined to be IDs by html template
      checkedIds.push(checkBoxes[i].value);
    }
  }
  console.log (checkedIds);
  return checkedIds;
}

function sendRequest() {
  var newValue = [document.forms['actionsForm']['actionSelect'].value];

  const xhr = new XMLHttpRequest();
  const data = new FormData();

  data.append('field-to-set', 'location')
  data.append('new-value', newValue)
  data.append('ids-to-apply-to', grabIds());
  xhr.addEventListener('load', handleResponse);
  xhr.open('POST', API_URL);
  xhr.send(data);

  document.getElementById('actionStatus').innerHTML = "Request sent, page should reload shortly."
}
