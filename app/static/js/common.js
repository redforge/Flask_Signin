//Sets the visibility of all elements of a class/id
function setVisibility(selector, visibleA) {
  var elements = $(selector);
  if (Array.isArray(elements)) for (var i=0; i<elements.length; i++) setVisibilityByObject(elements[i], visibleA);
  else setVisibilityByObject(elements, visibleA);
}
//Sets the visibilty of a single object/reference
function setVisibilityByObject(object, visible) {
  if (visible) $(object).removeClass("hidden");
  else $(object).addClass("hidden");
}
/*
//If shouldExist is true, return the string with the substring added
//If shouldExist is false, return the string with the substring removed (if it exists)
function setSubstringExistance(mString, subString, exists) {
  if (typeof(mString) != "string") return ""; //If its an invalid datatype, just return an empty string
  if (!exists &&  mString.includes(subString)) return mString.replace(subString,""); //If already added, remove the substring
  if ( exists && !mString.includes(subString)) return (mString + subString); //If not already added, add the substring
  return mString; //if we good, just pass it on through
}*/


$(document).ready(function() {
  //STYLE checkBoxes
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
        $(adjacentElem(-1)).focus();
        e.preventDefault();
        break;

      case 40: // down
        $(adjacentElem(1)).focus();
        console.log(adjacentElem(1));
        e.preventDefault();
        break;

      default: return; // exit this handler for other keys
    }

    //e.preventDefault(); // prevent the default action (scroll / move caret)
  }
});

//Get adjactent element
function adjacentElem(offset) {
  //Create and set variables
  var eOriginal = $(document.activeElement);
  var eWorking = eOriginal;

  //This function is just a shortcut
  function ovs(e) {
    return Object.values(e);
  }

  //Iterate until a sibling is or contains an input
  for (var i=0; i<10; i++) { /* up to 10 "layers" out */
    //Check if this element contains it
    eTemps = $(eWorking).find("input, .selectable").toArray();

    //Check that there's actually anything there
    if (eTemps.length != 0) {
      //Get rid of hidden items
      for (var j=0; j<eTemps.length; j++) {
        parentTree = $(eTemps[j]).parents();
        for (var k=0; k<parentTree.length; k++) {
          if ($(parentTree[k]).hasClass("hidden")) {
            eTemps.splice(j, 1);
            break;
          }
        }
      }

      //Get index, or at least try to
      ogIndex = ovs(eTemps).indexOf( ovs(eOriginal)[0] );

      //See if index wasn't actually found
      if (ogIndex == -1) return eTemps[0];
      else if (ogIndex+offset < eTemps.length && ogIndex+offset >= 0) return eTemps[ogIndex+offset];

    }
    //if not, get parent
    eWorking = $(eWorking).parent();
  }

  //Fail!
  return("fail");
}
