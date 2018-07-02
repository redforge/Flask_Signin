const API_EDIT_URL = "/api/edit";
const API_ADD_URL  = "/api/add";

const ADD_LIST_ENTRY =
`<span class='add-item'>
  <input class='add-fn' name='new-fn' type='text' placeholder='Name (required)'><input class='add-ln' name='new-ln' type='text' placeholder='Surname'>
  <input class='add-nk' name='new-nk' type='text' placeholder='Nickname'><input class='add-ns' name='new-ns' type='text' placeholder='Notes'>
  <hr>
</span>`
;

shouldReload = false;

$(document).ready(function() {
  //Run once page loads
  setVisibility("id-col", false);
  setNote("edit-save-message", "No manual changes yet...");
  changeAction("sign-in");

  document.getElementById("action-select").value = "sign-in";

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

//Called when the server responds to a request
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

//Fuction called by the page, casts the value and sends it to the fuction below
function changeActionMeta(e) {
  changeAction(""+e.value);
}
//Called when the action (e.g. Sign out) is changed
function changeAction(value) {
  //Hide everything
  document.getElementById("signin-options").style.display= "none";
  document.getElementById("remove-confirm").style.display= "none";
  document.getElementById("add-options").style.display= "none";

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

    case "add":
      document.getElementById("add-options").style.display= "";
      document.getElementById("add-list").innerHTML = "";
      appendNewEntry();
      break;

    default:
      console.log("Invalid Action")
  }
}

//Add entry to the 'add new' list

function appendNewEntry() {
  entry = document.createElement("div");
  entry.innerHTML = ADD_LIST_ENTRY;
  document.getElementById("add-list").appendChild(entry.firstChild);
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

//Sets the innerHTML of a span/div, used to make code slightly neater
function setNote(id, text) {
  document.getElementById(id).innerHTML = text
}

//Sets all the checkboxes to the same value, called when the top box is toggled
function checkAll(cb) {
  var checkBoxes = document.forms["camperList"].elements["select-box"];
  //cb.checked = !cb.checked;
  for (var i = 0; i < checkBoxes.length; i++) {
    checkBoxes[i].checked=cb.checked;
  }
}

//Grab all IDs that are currently checked/selected
function grabIds() {
  var checkBoxes = document.forms["camperList"].elements["select-box"];
  var checkedIds = [];
  for(var i = 0; i<checkBoxes.length; i++) {
    if (checkBoxes[i].checked && checkBoxes[i].value != "") {
      //Values defined to be IDs by html template
      checkedIds.push(checkBoxes[i].value);
    }
  }
  console.log (checkedIds);
  console.log (checkBoxes.length);
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
  xhr.open("POST", API_EDIT_URL);
  xhr.send(data);
}

//Submit stuff filled in into the Basic Actions form
function submitRequest() {
  var action = ""+[document.forms["actionsForm"]["action-select"].value];
  var fieldToSet, newValue;
  switch (action) {
    case "sign-in":
      fieldToSet = "location"
      newValue = [document.forms["actionsForm"]["location-select"].value];
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

    case "add":
      shouldReload=true;
      addNewCampers();
      return false;

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

function addNewCampers() {
  var loc = document.getElementById("add-location-select").value;
  function get(t,v) {return t.getElementsByClassName(v)[0].value;}
  var newCampers = [];

  $(".add-item").each(function() {
    if (!(get(this, "add-fn")=="")) {
      var cObj = { "firstname":get(this, "add-fn"), "lastname":get(this, "add-ln"), "nickname":get(this, "add-nk"), "note":get(this, "add-ns"), "location":loc};
      console.log(cObj);
      newCampers.push(cObj);
    }
  });

  out = JSON.stringify(newCampers);

  const xhr = new XMLHttpRequest();
  const data = new FormData();

  data.append("new-campers", out);
  xhr.open("POST", API_ADD_URL);
  xhr.addEventListener("load", handleResponse);
  xhr.send(data);
}
