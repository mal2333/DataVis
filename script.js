let datas, rainy, snowy, other;
var started = false;
let userInputRef = db.collection('userInput');

/*  READING FROM DATABASE */
let getData = userInputRef.get().then(querySnap => {
  let userInputList = [];

  querySnap.forEach(doc => {
    let input = {};
    input.skyColor = doc.data().skyColor;
    input.feeling = doc.data().feeling;
    input.temperature = doc.data().temperature;
    userInputList.push(input);
  });
  datas = userInputList;
  //console.log(datas);
  console.log("got data");
  return datas;
});

/* PUSHING TO DATABASE */
/*
let todosRef  = db.collection('todos');
	var newTodo = {
    task: inputEl.value,
    done: false
  };
	data.push(newTodo);
  todosRef.add(newTodo);
*/


/* ASKING USER*/
//MODAL
/*document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
  var elem = document.querySelector('#modal1');
  var instance = M.Modal.getInstance(elem);
  const modalbtn = document.querySelector('.modal-trigger');
  modalbtn.addEventListener('click', () => {
    instance.open();
  });
  const modalbtnsubmit = document.querySelector('#modal-submit');
  modalbtnsubmit.addEventListener('click', () => {
    instance.close();
  })
});*/

$(document).ready(function(){
  $('.fixed-action-btn').floatingActionButton();
  $('.modal').modal();
  $('.trigger-modal').modal();
  $('select').formSelect();
  $('.sidenav').sidenav({edge: 'right'});
});

//FORM


/* QUERYING DIFFERENT DATA */

/* CONVERTING TO COLORS */
function convert(datas) {
  for (d of datas) {
    switch (d.skyColor) {
      case "Sunny":
        d.skyColor = '#FFD810';
        break;
      case "Foggy":
        d.skyColor = '#EAF6F6';
        break;
      case "Cloudy":
        d.skyColor = '#9CB3C9';
        break;
      case "Rainy":
        d.skyColor = '#6490BF';
        break;
      case "Snowy":
        d.skyColor = '#E3E7FE';
        break;
      case "Other":
        d.skyColor = '255';
        break;
    }
    switch (d.feeling) {
      case "Joyful/happy":
        d.feeling = '#FCFD70';
        break;
      case "Grumpy":
        d.feeling = '#BF7AA0';
        break;
      case "Sad":
        d.feeling = '#C4D7FF';
        break;
      case "Okay/calm":
        d.feeling = '#94D7F2'; //#CCCC55';
        break;
      case "Excited":
        d.feeling = '#F05053';
        break;
    }
    switch (d.temperature) {
      case "Too cold!":
        d.temperature = 0;
        break;
      case "Chilly but ok":
        d.temperature = 1;
        break;
      case "Warm":
        d.temperature = 2;
        break;
      case "Too hot!":
        d.temperature = 3;
        break;
    }
  }
  console.log("converted datas");
}

/* DRAW SKY 1/2 CIRCLE, FEELING 1/2 CIRCLE, TEMP LINES */
function skyCircle(skyC, x, y) {
  fill(skyC);
  arc(x, y, 100, 100, TWO_PI - PI / 18, PI - PI / 18, PIE);
  if (skyC == '#6490BF') {
    image(rainy, x, y, 100, 100);
  } else if (skyC == '#E3E7FE') {
    image(snowy, x, y, 100, 100);
  } else if (skyC == '255') {
    image(other, x, y, 100, 100);
  }
}

function feelingCircle(feelingC, x, y) {
  fill(feelingC);
  arc(x, y, 100, 100, PI - PI / 18, TWO_PI - PI / 18);
}

function tempLines(x, y, temp) {
  noFill();
  switch (temp) {
    case 0:
      break;
    case 1:
      line(x - 50, y + 5, x + 49, y - 13);
      break;
    case 2:
      line(x - 50, y + 5, x + 49, y - 13);
      line(x - 49, y + 13, x + 49, y - 4);
      break;
    case 3:
      line(x - 50, y + 5, x + 49, y - 13);
      line(x - 49, y + 13, x + 49, y - 4);
      line(x - 50, y, x + 48, y - 17);
      break;
  }
}

/* DRAW WHOLE CIRCLES */
function moodCircles(x, y, skyC, feelingC, temp) {
  skyCircle(skyC, x, y);
  feelingCircle(feelingC, x, y)
  tempLines(x, y, temp);
}

/* AT SETUP */
async function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  imageMode(CENTER);
  rainy = loadImage('assets/stripes.png');
  snowy = loadImage('assets/dots2.png')
  other = loadImage('assets/other.png')
  await getData;
  convert(datas);
  started = true;
  noLoop();
}

/* DRAW */
function draw() {
  if (started) {
    var x = 100;
    var y = 100;
    for (d of datas) {
      moodCircles(x, y, d.skyColor, d.feeling, d.temperature);
      if (x < (width - 180)) {
        x += 120;
      } else {
        y += 120;
        x = 100;
      }
    }
  }
}
