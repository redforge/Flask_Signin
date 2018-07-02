function peskySpaces (s) {

}


//The function that is called when text in the filter/search box is changed
function filter (s, displayType) {
  s = s.trim();
  function get(e,v) {return e.getElementsByClassName(v)[0].innerHTML;}
  //Define options for Fuse
  const options = {
    id: "index",
    shouldSort: true,
    threshold: 0.1,
    tokenize: true,
    location: 0,
    distance: 100,
    maxPatternLength: s.length+5,
    minMatchCharLength: 1,
    keys: [
      "firstname",
      "lastname"
    ]
  };

  //Grab relevant elements
  table = document.getElementById("camperList").parentNode;
  lines = table.getElementsByTagName("tr");

  //Prepare data for Fuse
  list = []
  for (var i=0; i < lines.length; i++) {
    var l = lines[i];
    list.push( { "firstname":get(l,"fn-col"), lastname:get(l,"ln-col"), "nickname":"", "index":i} )
  }

  //Run fuse filter check on out data
  var fuse = new Fuse(list, options);
  var results = fuse.search(s);
  //console.log (results);

  switch (displayType) {
    case "showHide":
      //Show or hide things from the main table based on Fuse's results
      for (var i=0; i < lines.length; i++) {
        if (results.indexOf(""+i) > -1) {
          lines[i].style.display = "";
        } else {
          lines[i].style.display = "none";
        }
      }
      break;

    case "ordered":
      //Show or hide things from the main table based on Fuse's results
      for (var i=0; i < lines.length; i++) {
        index = results.indexOf(""+i);
        if (index > -1) {
          lines[i].style.display = "";
          lines[i].style.order = index;
        } else {
          lines[i].style.display = "none";
          lines[i].style.order = "";
        }
      }
      break;

    default:
      console.log("invalid or undefined display type");
      break;
  }

}
