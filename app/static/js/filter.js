//The function that is called when text in the filter/search box is changed
function filter (s, displayType) {
  try {
    document.getElementsByClassName("select-all-box")[0].checked = false;
  } catch {
    console.log("Seems like this is the read only version, some errors are expected.");
  }

  s = s.trim();
  function get(e,v) {return e.getElementsByClassName(v)[0].innerHTML;}
  //Define options for Fuse
  var options = {
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

  //Show or hide things (&order) from the main table based on Fuse's results
  for (var i=0; i < lines.length; i++) {
    index = results.indexOf(""+i);
    if (index > -1) {
      setVisibilityByObject(lines[i], true );
      lines[i].style.order = index;
    } else {
      setVisibilityByObject(lines[i], false);
      lines[i].style.order = "";
    }
  }

  //Update the highlights
  refindOdds();
}
