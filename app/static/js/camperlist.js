var DBLCLICK_TIMER = 250;
var currentEditableField = null;
var prevText = "";
//Most of this is to prevent counting doubleclick
var clickCountDc = 0;
var timerDc, prevElemDc, functionDc;

$(document).ready(function() {

  //Run once page loads
  setVisibilityBySelector(".id-col", false);
  refindOdds();

  //Uncheck everything in list
  try {
    //Stuff that will run if its the full table
    $(".select-all-box")[0].checked = false;
    checkAll(false);
  }catch{
    console.log("Seems read only")
  }

  //Bind for directly editable items
  $(".editable").bind("dblclick",
    function(){
      currentEditableField = this;
      prevText = this.innerHTML;
      $(this).attr("contentEditable",true);
      $(this).focus();
      document.execCommand('selectAll',false,null);
      setNote("edit-save-message", "Click outside of the text box to save.");
    }).blur(
      function() {
        currentEditableField = null;
        $(this).attr("contentEditable", false);
        fieldToSet = $(this).prop("id");
        newValue = $(this).text();
        idToSet = $(this).parent().prop("id");
        //console.log (fieldToSet+" "+newValue+" "+idToSet)
        shouldReload = false;
        if (this.innerHTML != prevText)
          sendRequest(fieldToSet, newValue, idToSet);

        setNote("edit-save-message", "Change saved.");
      }
  );
  refindColumns();

  //Big chunk of code that just selects stuff on a single, but not double, click
  $("#chart-wrapper td:not('input'):not('.check')").bind("click",
    function() {
      //Sets the timer
      function setTimer() {
        prevElemDc = that;
        clickCountDc = that;
        thatBkp = that;
        functionDc = {f:function() {
          //Start a timer
          cb = $(thatBkp).parent().find("input[type~=checkbox]")[0];
          cb.checked = !cb.checked;
          normalCheck(cb);
          clickCountDc = 0;
        }}
        timerDc = ( setTimeout(functionDc.f, DBLCLICK_TIMER) );
      }
      //Setup some values
      that = this;
      clickCountDc++;
      //Check if this is the 1st click
      if (clickCountDc == 1) {
        setTimer(); //If it is, set the timer
      } else {
        //If not...
        //If this is a different element, select the previous one, and start a new timer
        if(prevElemDc != that) {
          functionDc.f();
          clearTimeout(timerDc);
          setTimer();
          console.log(prevElemDc);
          console.log(that);

        } else {
          clearTimeout(timerDc); //This is in the else so we don't clear the new timer
        }
        clickCountDc = 0;
      }
  });

  $(".check").bind("click",
  function(e) {
    if ((!$(e.target).is('input'))) {
      cb = $(this).find("input")[0];
      $(cb).prop("checked", !$(cb).prop("checked"));
      normalCheck(cb);
    }
    e.preventDefault();
  });

  colVis(".id-col",$(".id-vis").first().prop("checked"));
  colVis(".fn-col",$(".fn-vis").first().prop("checked"));
  colVis(".ln-col",$(".ln-vis").first().prop("checked"));
  colVis(".nk-col",$(".nk-vis").first().prop("checked"));
  colVis(".lc-col",$(".lc-vis").first().prop("checked"));
  colVis(".nt-col",$(".nt-vis").first().prop("checked"));
});

window.onbeforeunload = function (e) {
  fieldToSet = $(currentEditableField).prop("id");
  newValue = $(currentEditableField).text();
  idToSet = $(currentEditableField).parent().prop("id");
  shouldReload = true;
  sendRequest(fieldToSet, newValue, idToSet);
  return undefined;
}

$(document).keyup(function(e) {
  if(e.keyCode==32) {
    ae = $(document.activeElement)[0];
    if ($(ae).parent().hasClass("check")) {
      $(ae).prop("checked", !$(ae).prop("checked"));
      normalCheck(ae);
    }
  }
});

function colVis(s,c) {
  setVisibilityBySelector(s,c);
  eAll = $("thead th");
  var eVis=[];
  for (var i=0; i<eAll.length; i++) {
    $(eVis[eVis.length-1]).removeClass("last-col");
    if (!$(eAll[i]).hasClass("hidden")) eVis.push(eAll[i]);
  }
  $(eVis[eVis.length-1]).addClass("last-col");
}

function refindOdds() {
  var i=0;
  $("tbody tr:not(.hidden)").each( function() {
    i++;
    if (i%2 == 0) {
      $(this).addClass("odd-row");
    } else {
      $(this).removeClass("odd-row");
    }
  });
}

function listFocus(e, isFocus) {
  row = $(e).parent().parent();
  if (isFocus) $(row).addClass("list-focus");
  else $(row).removeClass("list-focus");
}

function refindColumns() {
  $("th").each(function(){ $(this).removeClass("last-col")});
  $("th:not(.hidden)").last().addClass("last-col");
}

//Function called when any normal check box is changed
function normalCheck(cb, changeVal=false, newVal=false, editSelect=true, isChecked="") {
  if (isChecked == "") isChecked=cb.checked;
  if (!isChecked && !newVal) $(".select-all-box").first().prop("checked",false);

  var row = $(cb).parent().parent()

  if (changeVal) {
    $(cb).prop("checked", newVal);
    isChecked = newVal;
  }
  function getName() {
    mid = " ";
    nickname = $(row).find(".nk-col").html().trim();
    if (typeof(nickname) == "string" && nickname.length > 0) mid = " \""+nickname+"\" ";
    return $(row).find(".fn-col").html().trim() +mid+ $(row).find(".ln-col").html().trim();
  }
  if (isChecked) {
    $(row).addClass("highlight");
    if (editSelect) {
      tokenFocusOverride = true;
      try { tokenbox.tokenInput("add", { id: $(row).prop("id"), name: getName()} ); } catch {}
    }
  } else {
    $(row).removeClass("highlight");
    if (editSelect) {
      tokenFocusOverride = true;
      try { tokenbox.tokenInput("remove", { id: $(row).prop("id"), name: getName()} ); } catch {}
    }
  }
}

//Sets all the checkboxes to the same value, called when the top box is toggled
function checkAll(mainVal) {
  var checkBoxes = document.forms["camperList"].elements["select-box"];

  for (var i = 0; i < checkBoxes.length; i++) {
    //Set values
    cbi = checkBoxes[i];
    var row = $(cbi).parent().parent();

    //Check if row isn't hidden
    if (!$(row).hasClass("hidden")) {
      normalCheck(cbi, changeVal=true, newVal=mainVal);
    }
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
  //console.log (checkedIds);
  //console.log (checkBoxes.length);
  return checkedIds;
}

//Actually send the request to the server
function sendRequest(fieldToSet, newValue, idsToApplyTo) {
  var xhr = new XMLHttpRequest();
  var data = new FormData();

  data.append("field-to-set", fieldToSet)
  data.append("new-value", newValue)
  data.append("ids-to-apply-to", idsToApplyTo);
  xhr.addEventListener("load", handleResponse);
  xhr.open("POST", API_EDIT_URL);
  xhr.send(data);
}
