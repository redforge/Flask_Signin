var COUNT_MAX_FRAMES = 0;

var OFFSET = { x: 0, y: 28 };

var boxTarget, boxStart;

$(document).keyup( function() {
  if ($(document.activeElement).prop("id")=="token-input-tokeninput") relocateBox();
});

function showBox() {
  shouldHide = true;
  box = $("div.token-input-dropdown")[0];
  $(box).removeClass("hidden");
  dd = relocateBox();
  $(dd).css("transition-duration","0s");
}

function hideBox() {
  box = $("div.token-input-dropdown")[0];
  $(box).addClass("hidden");
}

function relocateBox() {
  if (window.innerWidth > 600) {
    relocateBoxNonMobile();
  } else {
    //This is redundant, but necessary for some reason. Not a high priority "bug"
    var dd = $("div.token-input-dropdown")[0];
    $(dd).css("bottom", "10px");
  }
}

function relocateBoxNonMobile() {
  var ae = document.activeElement;
  var xy = getCursorXY(document.activeElement);
  var outerBox = $(ae).parent().parent();
  //console.log(xy.x + ":" + xy.y);
  var dd = $("div.token-input-dropdown")[0];
  $(dd).css("transition-duration","0.1s");

  boxWidth  = $(dd).width();
  boxHeight = $(dd).height();
  docWidth = document.body.clientWidth;
  docHeight = document.body.clientHeight;

  var targetX = xy.x + OFFSET.x;
  if (targetX + boxWidth > docWidth) {
     targetX = docWidth - boxWidth - 30 - OFFSET.x;
     $(dd).css("transition-duration","0s");
  }

  var targetY = xy.y + OFFSET.y;
  if (boxHeight + targetY > docHeight) {
    targetY = docHeight - boxHeight - 30 - OFFSET.y;
    $(dd).css("transition-duration","0s");
  }

  $(dd).css("left", targetX + "px");
  $(dd).css("top",  targetY + "px");
  $(dd).css("max-width",  (docWidth-targetX-10) + "px");
  return dd;
}

/**
 * returns x, y coordinates for absolute positioning of a span within a given text input
 * at a given selection point
 * @param {object} input - the input element to obtain coordinates for
 * @param {number} selectionPoint - the selection point for the input
 */
var getCursorXY = (input, selectionPoint) => {
  var {
    offsetLeft: inputX,
    offsetTop: inputY,
  } = input
  // create a dummy element that will be a clone of our input
  var div = document.createElement('div')
  // get the computed style of the input and clone it onto the dummy element
  var copyStyle = getComputedStyle(input)
  for (var prop of copyStyle) {
    div.style[prop] = copyStyle[prop]
  }
  // we need a character that will replace whitespace when filling our dummy element if it's a single line <input/>
  var swap = '.'
  var inputValue = input.tagName === 'INPUT' ? input.value.replace(/ /g, swap) : input.value
  // set the div content to that of the textarea up until selection
  var textContent = inputValue.substr(0, selectionPoint)
  // set the text content of the dummy element div
  div.textContent = textContent
  if (input.tagName === 'TEXTAREA') div.style.height = 'auto'
  // if a single line input then the div needs to be single line and not break out like a text area
  if (input.tagName === 'INPUT') div.style.width = 'auto'
  // create a marker element to obtain caret position
  var span = document.createElement('span')
  // give the span the textContent of remaining content so that the recreated dummy element is as close as possible
  span.textContent = inputValue.substr(selectionPoint) || '.'
  // append the span marker to the div
  div.appendChild(span)
  // append the dummy element to the body
  document.body.appendChild(div)
  // get the marker position, this is the caret position top and left relative to the input
  var { offsetLeft: spanX, offsetTop: spanY } = span
  // lastly, remove that dummy element
  // NOTE:: can comment this out for debugging purposes if you want to see where that span is rendered
  document.body.removeChild(div)
  // return an object with the x and y of the caret. account for input positioning so that you don't need to wrap the input
  return {
    x: spanX + inputX,
    y: spanY - $(document).height() + inputY
  }
}
