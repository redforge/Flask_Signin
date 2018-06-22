const API_URL = "/api/edit";
shouldReload = false;

$(document).ready(function() {
  //Run once page loads
  setVisibility("id-col", false);
  setNote("edit-save-message", "No manual changes yet...");
  changeAction("sign-in");

  //jQuery bindings
  $("#actionsForm").submit(function () {
   submitRequest();
   return false;
  });

  $(".editable").bind("click",
    function(){
        $(this).attr("contentEditable",true);
        $(this).focus();

        setNote("edit-save-message", "Click outside of the text box to save.");
    }).blur(
        function() {
            $(this).attr("contentEditable", false);
            fieldToSet = $(this).prop("id");
            newValue = $(this).text();
            idToSet = $(this).parent().prop("id");
            //console.log (fieldToSet+" "+newValue+" "+idToSet)
            shouldReload = false;
            sendRequest(fieldToSet, newValue, idToSet);

            setNote("edit-save-message", "Change saved.");
        });

});

//Called when the server responds
const handleResponse = ({ target }) => {
  //"Success" indicates no error, anything else is assumed to be an error.
  console.log(target.responseText);
  if(target.responseText=="success") {
    if(shouldReload) {
      location.reload();
    }
  }
  else {
    setNote("action-status", "Error: Input seems to be invalid");
  }
};

//Called when the action (e.g. Sign out) is changed
function changeActionMeta(e) {
  changeAction(""+e.value);
}
function changeAction(value) {
  //Hide everything
  document.getElementById("signin-options").style.display= "none";
  document.getElementById("remove-confirm").style.display= "none";

  //Unhide relevant things
  switch (value) {
    case "sign-in":
      document.getElementById("signin-options").style.display= "";
      break;

    case "sign-out":
      break;

    case "remove":
      document.getElementById("remove-confirm").style.display= "";
      break;

    default:
      console.log("Invalid Action")
  }
}

//Sets the visibility of all elements of a class
function setVisibility(htmlClass, visible) {
  var elements = document.getElementsByClassName(htmlClass)
  for (var i=0; i<elements.length; i++) {
    if (visible) {
      elements[i].style.display= "";
    } else {
      elements[i].style.display= "none";
    }
  }
}

//Function called when any normal check box is changed
function normalCheck(cb) {
  document.getElementById("select-all-box").checked = false;
}

function setNote(id, text, success) {
  document.getElementById(id).innerHTML = text
}

function checkAll(cb) {
  var checkBoxes = document.forms["camperList"].elements["select-box"];
  //cb.checked = !cb.checked;
  for (var i = 0; i < checkBoxes.length; i++) {
    checkBoxes[i].checked=cb.checked;
  }
}

function grabIds() {
  var checkBoxes = document.forms["camperList"].elements["select-box"];
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

//Actually send the request to the server
function sendRequest(fieldToSet, newValue, idsToApplyTo) {
  const xhr = new XMLHttpRequest();
  const data = new FormData();

  data.append("field-to-set", fieldToSet)
  data.append("new-value", newValue)
  data.append("ids-to-apply-to", idsToApplyTo);
  xhr.addEventListener("load", handleResponse);
  xhr.open("POST", API_URL);
  xhr.send(data);
}

//Submit stuff filled in into the Basic Actions form
function submitRequest() {
  var action = ""+[document.forms["actionsForm"]["actionSelect"].value];
  var fieldToSet, newValue;
  switch (action) {
    case "sign-in":
      fieldToSet = "location"
      newValue = [document.forms["actionsForm"]["locationSelect"].value];
      break;

    case "sign-out":
      fieldToSet = "location";
      newValue = "Signed Out";
      break;

    case "remove":
      if (document.getElementById("yes-im-sure").checked) {
        fieldToSet = "remove";
        newValue = "remove";
      } else {
        return false;
      }
      break;

    default:
      console.log("Invalid Action: " + action);
      return false;
      break;
  }
  shouldReload = true;
  ids = grabIds();
  if (ids.length > 0) {
    sendRequest(fieldToSet, newValue, ids);
    setNote("action-status", "Request sent, page should reload shortly.");
    return true;
  } else {
    setNote("action-status", "Please select at least one person!");
    return false;
  }
}
