var API_EDIT_URL = "/api/edit";
var API_ADD_URL  = "/api/add";

var ADD_LIST_ENTRY =
`<span class='add-item'>
  <br>
  <input class='add-fn' name='new-fn' type='text' placeholder='Name (required)'><input class='add-ln' name='new-ln' type='text' placeholder='Surname'>
  <input class='add-nk' name='new-nk' type='text' placeholder='Nickname'><input class='add-ns' name='new-ns' type='text' placeholder='Notes'>
  <hr>
</span>`
;

shouldReload = false;

var tokenbox = null;

$(document).ready(function() {

  //Run once page loads
  document.getElementById("action-select").value = "sign-in";
  changeAction("sign-in");

  tokenbox = $("#tokeninput");
});

function addRemoveToken(item, isAdd) {
//  console.log (item.id + isAdd);
  cbTemp = $("#"+item.id).find("input[type~='checkbox']");
  normalCheck (cbTemp, changeVal=true, newVal=isAdd, editSelect=false);
}

function setSubmitText(str) {
  $("#submit-action").attr("value",str);
}

//Fuction called by the page, casts the value and sends it to the fuction below
function changeActionMeta(e) {
  changeAction(""+e.value);
}

//Called when the action (e.g. Sign out) is changed
function changeAction(value) {
  //Hide everthing
  setVisibilityBySelector("#sign-in-options" , false);
  setVisibilityBySelector("#sign-out-options", false);
  setVisibilityBySelector("#remove-options", false);
  setVisibilityBySelector("#add-options"   , false);

  //Unhide relevant things
  switch (value) {
    case "sign-in":
      setVisibilityBySelector("#sign-in-options", true);
      setSubmitText("Sign in selected campers to "+$("#location-select").val());
      break;

    case "sign-out":
      setVisibilityBySelector("#sign-out-options", true);
      setSubmitText("Sign out selected campers");
      break;

    case "remove":
      setVisibilityBySelector("#remove-options", true);
      setSubmitText("Remove selected campers and their data from the database");
      break;

    case "add":
      setVisibilityBySelector("#add-options"   , true);
      document.getElementById("add-list").innerHTML = "";
      appendNewEntry();
      setSubmitText("Add the campers entered above to the database");
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

//Sets the innerHTML of a span/div, used to make code slightly neater
function setNote(id, text) {
  document.getElementById(id).innerHTML = text
}

//Submit stuff filled in into the Basic Actions form
function submitRequest() {
  var action = ""+[document.forms["actionsForm"]["action-select"].value];
  var fieldToSet, newValue;
  switch (action) {
    case "sign-in":
      fieldToSet = "location"
      newValue = [document.forms["actionsForm"]["location-select"].value];
      if (newValue == "other") newValue = $("#signin-custom-location").val();
      break;

    case "sign-out":
      fieldToSet = "location";
      newValue = "Signed Out";
      break;

    case "remove":
      if ($(".yes-im-sure")[0].checked == true) {
        fieldToSet = "remove";
        newValue = "remove";
      } else {
        return false;
      }
      break;

    case "add":
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
      newCampers.push(cObj);
    }
  });

  out = JSON.stringify(newCampers);

  var xhr = new XMLHttpRequest();
  var data = new FormData();

  data.append("new-campers", out);
  xhr.open("POST", API_ADD_URL);
  xhr.addEventListener("load", handleResponse);
  xhr.send(data);
}
