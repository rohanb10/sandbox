var particle = new Particle();
var token;

particle.login({username: 'oceanseacrest@yahoo.com', password: 'abcd1234'}).then(
  function(data) {
    token = data.body.access_token;
    console.log("Logged in");
    console.log(token)
  },
  function (err) {
    console.log('Could not log in.', err);
  }
);

var password="123456";
var attempt = "";
var num_attempts = 0;

function tap(number){
  if(attempt.length<6){
    console.log(number);
    attempt += number;
  }
  updateDisplay();
}

function deleteTap(){
  if(attempt.length >= 1){
    attempt = attempt.substring(0,attempt.length-1);
    updateDisplay();
  }
}

function go(){
  if(attempt.length==6){
    var fnPr = particle.callFunction({ deviceId: '370031001051353338363333', name: 'attempt', argument: attempt, auth: token });

    fnPr.then(
      function(data) {
        console.log('Function called succesfully:', data);
        if(data.body.return_value == 0){
          num_attempts += 1;
          attempt="";
          updateDisplay();
        }
        if(data.body.return_value == 1){
          document.getElementById('prompt').innerHTML = "Welcome In";
          disableAll();
        }
      }, function(err) {
        console.log('An error occurred:', err);
      }
    );
  }
}

function forgot(){
  var num = Math.floor(Math.random() * 900000) + 100000;
  var d = new Date()
  num = ""+ num;
  console.log(num);
  var fnPr = particle.callFunction({ deviceId: '370031001051353338363333', name: 'reset', argument: num, auth: token });

  fnPr.then(
    function(data) {
      console.log('Function called succesfully:', data);
      if(data.body.return_value == 0){
        document.getElementById('message').innerHTML = "Unable to reset password. Please try again.";
      }
      if(data.body.return_value == 1){
        document.getElementById('message').innerHTML = "A new password was sent to the owner's phone at "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
      }
    }, function(err) {
      console.log('An error occurred:', err);
    }
  );
}

function updateDisplay(){
  //disable submit button if less than 6
  if(attempt.length==6){
    document.getElementById('go').classList.remove("disabled");
  }
  else{
    if(document.getElementById('go').classList.length<2){
      document.getElementById('go').classList.add("disabled");
    }
  }
  //disable back button if 0
  if(attempt.length==0){
    document.getElementById('back').classList.add("disabled");

  }
  else{
    if(document.getElementById('back').classList.length<=2){
      document.getElementById('back').classList.remove("disabled");
    }
  }
  var code = attempt;
  while(code.length<6){
    code+="_";
  }
  code = code.split('').join(' ');
  document.getElementById("keys").innerHTML = code;
}

function disableAll(){
  var buttons = document.getElementsByClassName('button');
  for(var i=0;i<buttons.length;i++){
    buttons[i].classList.add('disabled');
  }
}


// var url = "https://api.particle.io/v1/devices/370031001051353338363333/attempt?access_token=23980d2c1bd524bb8d4e8ce880639c45125e55b3"
