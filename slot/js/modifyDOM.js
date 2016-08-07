const numberOfPictures = 10;
var lists = document.querySelectorAll('.jSlots-wrapper ul');
for(var i=0;i<lists.length;i++){
  for(var j=0;j<numberOfPictures;j++){
    lists[i].appendChild(document.createElement('li'));
  }
}
for(var i=0;i<lists.length;i++){
  var items = lists[i].querySelectorAll('li');
  for(var j=0;j<items.length;j++){
    items[j].innerHTML = '<img src="img/slot'+(j%numberOfPictures)+'.png"/>'
  }
}