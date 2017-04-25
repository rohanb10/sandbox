var particle = new Particle();
var token, num_attempts;
var attempt = "";

window.addEventListener('DOMContentLoaded', function() {
  particle.login({username: 'oceanseacrest@yahoo.com', password: 'abcd1234'}).then(
    function(data) {
      token = data.body.access_token;
      console.log("Logged in");

      particle.getVariable({ deviceId: '370031001051353338363333', name: 'num_attempts', auth: token }).then(function(data) {
        num_attempts = data.body.result
        console.log("Attempts: "+num_attempts)
        document.getElementById('attempts').innerHTML = 3 - num_attempts;
        if(num_attempts<3 && num_attempts>=0){
          enableAll();
        }
        else{
          disableAll();
          document.getElementById('prompt').innerHTML = "The door is really locked. Contact the owner to enable the door.";
        }
      }, function(err) {
        console.log('Unable to get current num_attempts');
      });
    },
    function (err) {
      console.log('Could not log in.', err);
    }
  );
},true);

function tap(number){
  if(attempt.length<6){
    console.log(number);
    attempt += number;
  }
  updateDisplay();
}

function deleteTap(){

  if(attempt.length >= 1 && document.getElementById('back').classList.length>=2){
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
          attempt="";
          num_attempts += 1;
          document.getElementById('attempts').innerHTML = 3 - num_attempts;
          if(num_attempts >= 3){
            document.getElementById('prompt').innerHTML = "The door is really locked. Contact the owner to enable the door.";
            disableAll();
          }
          console.log("wrong code")
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
  //format code for printing
  while(code.length<6){
    code+="_";
  }
  code = code.split('').join(' ');
  document.getElementById("keys").innerHTML = code;
}

//disables all buttons
function disableAll(){
  var buttons = document.getElementsByClassName('button');
  for(var i=0;i<buttons.length;i++){
    buttons[i].classList.add('disabled');
  }
}


function enableAll(){
  var buttons = document.getElementsByClassName('button');
  for(var i=0;i<buttons.length;i++){
    buttons[i].classList.remove('disabled');
  }
  updateDisplay();
}
