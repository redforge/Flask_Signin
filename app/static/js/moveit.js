const COUNT_MAX_FRAMES = 0;
const BOX_MIN_WIDTH = 200;

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

function relocateBox() {
  var xy = getCursorXY(document.activeElement);
  //console.log(xy.x + ":" + xy.y);
  var dd = $("div.token-input-dropdown")[0]
  $(dd).css("transition-duration","0.1s");
  var target = xy.x;
  if (target + BOX_MIN_WIDTH > $(document).width()) {
     target = $(document).width() - BOX_MIN_WIDTH - 4;
   }
  target -= 10;
  $(dd).css("margin-left", target + "px");
  return dd;
}

/**
 * returns x, y coordinates for absolute positioning of a span within a given text input
 * at a given selection point
 * @param {object} input - the input element to obtain coordinates for
 * @param {number} selectionPoint - the selection point for the input
 */
const getCursorXY = (input, selectionPoint) => {
  const {
    offsetLeft: inputX,
    offsetTop: inputY,
  } = input
  // create a dummy element that will be a clone of our input
  const div = document.createElement('div')
  // get the computed style of the input and clone it onto the dummy element
  const copyStyle = getComputedStyle(input)
  for (const prop of copyStyle) {
    div.style[prop] = copyStyle[prop]
  }
  // we need a character that will replace whitespace when filling our dummy element if it's a single line <input/>
  const swap = '.'
  const inputValue = input.tagName === 'INPUT' ? input.value.replace(/ /g, swap) : input.value
  // set the div content to that of the textarea up until selection
  const textContent = inputValue.substr(0, selectionPoint)
  // set the text content of the dummy element div
  div.textContent = textContent
  if (input.tagName === 'TEXTAREA') div.style.height = 'auto'
  // if a single line input then the div needs to be single line and not break out like a text area
  if (input.tagName === 'INPUT') div.style.width = 'auto'
  // create a marker element to obtain caret position
  const span = document.createElement('span')
  // give the span the textContent of remaining content so that the recreated dummy element is as close as possible
  span.textContent = inputValue.substr(selectionPoint) || '.'
  // append the span marker to the div
  div.appendChild(span)
  // append the dummy element to the body
  document.body.appendChild(div)
  // get the marker position, this is the caret position top and left relative to the input
  const { offsetLeft: spanX, offsetTop: spanY } = span
  // lastly, remove that dummy element
  // NOTE:: can comment this out for debugging purposes if you want to see where that span is rendered
  document.body.removeChild(div)
  // return an object with the x and y of the caret. account for input positioning so that you don't need to wrap the input
  return {
    x: inputX + spanX,
    y: inputY + spanY,
  }
}
