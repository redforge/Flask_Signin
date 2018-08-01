var ADJACENT_ELEM_MAX_LAYERS = 10;

function setVisibilityBySelector(selector, visible) {
  $(selector).each( function () {setVisibilityByObject(this, visible); });
}

function setVisibilityByObject(object, visible) {
  if (visible) $(object).removeClass("hidden");
  else $(object).addClass("hidden");
}

$(document).ready(function() {
  //Set title in-window, seems to not work w jQuery
  document.getElementById("top-title").innerHTML = document.getElementsByTagName("title")[0].innerHTML;
  //Style checkboxes
  $("input[type~=checkbox]").each(function(index, item){
    $(item).attr("id", "cbNo"+index);
    $(item).attr("class", $(item).attr("class")+" css-checkbox");
    $(item).parent().append("<label class='css-label' for='"+"cbNo"+index+"'></label>");
  });
});

$(document).keydown(function(e) {
  if ($(document.activeElement)[0].tagName.toLowerCase() == "input") {
    switch(e.which) {
      case 38: // up
        if (document.activeElement.id == "filterbox")
          $(adjacentElem(-2)).focus();
        else
          $(adjacentElem(-1)).focus();
        e.preventDefault();
        break;


      case 40: // down
        if (!document.activeElement.id.includes("token-input"))
          $(adjacentElem(1)).focus();
        else
          $(adjacentElem(2)).focus();
        e.preventDefault();
        break;

      default: return;
    }
  } //else if (e.which == 8) e.preventDefault();
});

//Dynamic scroll sytle!
$(window).scroll(function(){
    if ($(window).scrollTop() > 1)
      $("#top-bar").addClass("scrolled");
    else
      $("#top-bar").removeClass("scrolled");
});

//Called when the server responds to a request
var handleResponse = ({ target }) => {
  //"Success" indicates no error, anything else is assumed to be an error.
  console.log("Recieved response: " + target.responseText);
  if(target.responseText=="success") {
    if(shouldReload) {
      location.reload();
    }
  }
  else {
    setNote("action-status", "Error: Input seems to be invalid");
  }
};

function adjacentElem(offset) {
  var originalElement = $(document.activeElement);
  var currentContainerElement = originalElement;

  //Iterate until a sibling is or contains an input
  for (var i=0; i<ADJACENT_ELEM_MAX_LAYERS; i++) {
    //Check if this element contains it
    currentChildrenElements = $(currentContainerElement).find("input, .selectable").toArray();

    //omit hidden items
    for (var j=0; j<currentChildrenElements.length; j++)
      if ($(currentChildrenElements[j]).parents().hasClass("hidden"))
        currentChildrenElements.splice(j, 1);

    if (currentChildrenElements.length != 0) {
      originalElementIndex = Object.values(currentChildrenElements).indexOf( Object.values(originalElement)[0] );

      if (originalElementIndex == -1)
        return currentChildrenElements[0];
      else if (originalElementIndex+offset < currentChildrenElements.length && originalElementIndex+offset >= 0)
        return currentChildrenElements[originalElementIndex+offset];

    }
    //If nothing's found, go out a level
    currentContainerElement = $(currentContainerElement).parent();
  }
  return("fail");
}
