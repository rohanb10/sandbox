var rodInterval, alarmInterval;

function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

$('.lever-handle').draggable({
  axis: 'y',
  revert: true,
  revertDuration: 500,
  containment: ".lever-container",
  drag: function(event, ui){
    rodInterval = setInterval(rod,15);
    if($('.lever-handle').offset().top >= $('.lever-handle-target').offset().top-10){
      eventFire(document.getElementById('playBtn'), 'click');
    }
  }
});

function alarm(){
  var img = $('#alarm-img');
  if(img.attr('src').split('/').pop()=='alarm1.png'){
    img.attr('src','img/alarm2.png');
  }
  else{
    img.attr('src','img/alarm1.png');
  }
}

function rod(){
  var handleTop = $('.lever-handle').offset().top;
  var baseTop = $('.lever-base').offset().top;
  var rod = $('.lever-rod');
  if(handleTop>=baseTop){
    var difference = handleTop-baseTop;
    rod.css('height',difference);
    rod.css('top',baseTop);
  }
  else{
    var difference = baseTop-handleTop;
    rod.css('height',difference);
    rod.css('top',handleTop+10);
  }
}

var winnerArray = [];

$('.slot').jSlots({
  spinner: '#playBtn',
  easing: 'easeOutSine',
  onStart: function(){
    $('.control-panel').addClass('spinning');
    // if(alarmInterval==null){
    //   setInterval(alarm,100);
    // }
    clear()
  },
  onEnd: function(finalNumbers){
    winnerArray.push(finalNumbers[0]);
    checkIfWinner();
    clearInterval(rodInterval);
  },
  time: 8000,
  loops: 10
});

function checkIfWinner(){
  if(winnerArray.length===3){
    if(winnerArray[0] === winnerArray[1] || winnerArray[0] === winnerArray[2]){
      console.log(winnerArray);
      winner(winnerArray[0]-1);
    }
    else if(winnerArray[1] === winnerArray[2]){
      winner(winnerArray[1]-1);
    }
    else {
      loser();
    }
    winnerArray = [];
    $('.control-panel').removeClass('spinning');
    clearInterval(alarmInterval);
  }
  return;
}

function clear(){
  document.getElementsByClassName('result-status')[0].innerHTML = '';
  document.getElementsByClassName('product-image')[0].src = '';
  document.getElementsByClassName('product-brand')[0].innerHTML = '';
  document.getElementsByClassName('product-name')[0].innerHTML = '';
  document.getElementsByClassName('product-price')[0].innerHTML = '';
  document.getElementsByClassName('result-product')[0].style.display = 'none';
}

function winner(winningItem){
  document.getElementsByClassName('result-status')[0].innerHTML = 'WINNER';
  document.getElementsByClassName('product-brand')[0].innerHTML = 'Brand Name';
  document.getElementsByClassName('product-name')[0].innerHTML = 'Unnecessarily Long Product Name';
  document.getElementsByClassName('product-price')[0].innerHTML = '$999.99';
  document.getElementsByClassName('product-image')[0].src = 'img/slot'+winningItem+'.png';
  document.getElementsByClassName('result-product')[0].style.display = 'flex';
}

function loser(){
  document.getElementsByClassName('result-status')[0].innerHTML = 'LOSER';
}