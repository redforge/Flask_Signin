API_LOGIN_URL = "/login/login"
API_SIGNUP_URL= "/login/signup"
API_LOGOUT_URL= "/login/logout"
var shouldAlert = false;


function loginRequest() {
  sendAccountRequest(API_LOGIN_URL);
}
function logOutRequest() {
  sendAccountRequest(API_LOGOUT_URL, logout=true)
}
function signUpRequest() {
  document.getElementById("login-note").innerHTML = "";
  if ( $("#password-box").val() == $("#password-confirm-box").val() ) {
    console.log("Attempting to create an account. Expect a response shortly...");
    sendAccountRequest(API_SIGNUP_URL);
    shouldAlert = true;
  } else {
    document.getElementById("login-note").innerHTML = "<br> Passwords do not match.";
  }
}

function signUpReady() {
  $("#signin-buttons").addClass("hidden");
  $("#signup-extra").removeClass("hidden");
}

function sendAccountRequest(url, logout=false) {
  var xhr = new XMLHttpRequest();
  var data = new FormData();
  if (!logout) {
    username = $("#username-box").val();
    password = $("#password-box").val();
    rolecode = $("#rolecode-box").val();

    data.append("username", username);
    data.append("password", password);
    data.append("rolecode", rolecode);

  }

  xhr.open("POST", url);
  shouldReload = true;
  xhr.addEventListener("load", handleAccountResponse);
  xhr.send(data);
}

var handleAccountResponse = ({ target }) => {
  // when flask responds...
  if(target.responseText=="success") {
    if(shouldAlert)
      alert("Account created successfully. You will be now taken to the login page.")
    if(shouldReload)
      location.reload();
  } else {
    console.log(target.responseText);
    document.getElementById("login-note").innerHTML = "<br>" + target.responseText;
  }
};
