let datas, rainy, snowy, other;
var started = false;
let userInputRef = db.collection('userInput');
let userIdsRef = db.collection('usersIds');

$(document).ready(function(){
  $('.fixed-action-btn').floatingActionButton();
  $('.modal').modal({
    onCloseEnd: function() {
      window.location.reload();
    }
  });
  $('.trigger-modal').modal();
  $('select').formSelect();
  $('.sidenav').sidenav({edge: 'right'});
  $('.collapsible').collapsible({
    accordion: false,
  });
});

/*  READING USERINPUT FROM DATABASE */
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
  console.log("got data");
  return datas;
});

/*  GET USERS EMAILS FROM DATABASE  */
function getEmails(){
  let promise = userIdsRef.get().then(querySnap => {
    let usersEmails = [];
    querySnap.forEach(doc => {
      let thatEmail = doc.data().email;
      usersEmails.push(thatEmail);
    });
    return usersEmails;
  });
  return promise;
}

/*  SEND TO DATABASE  */
//Create new document in usersIds collection
function newUserIdDocument(firstName, lastName, email){
  let newUsersIds = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };
  userIdsRef.add(newUsersIds);
}

//Create new document in UserInput collection
function newUserInputDocument(feeling, sky, temperature, email){
  let newUserInput = {
    feeling: feeling,
    skyColor: sky,
    temperature: temperature,
    email: email
  };
  userInputRef.add(newUserInput);
}

/*  USER INPUT  */
//IDCHECKBOX
$('#email-check').click(function(){
  if($(this).is(':checked')){
    $('#first_name').attr("disabled", true);
    $('#last_name').attr("disabled", true);
  }else{
    $('#first_name').attr("disabled", false);
    $('#last_name').attr("disabled", false);
  }
});

//FORM SUBMIT
$("#formid").submit(async function(e) {
  e.preventDefault();
  let firstName = $("#first_name").val();
  let lastName = $("#last_name").val();
  let email = $("#email").val();
  let feeling = $( ".feeling" ).val();
  let sky = $( ".sky" ).val();
  let temperature = $( ".temperature" ).val();

  if($('#email-check').is(":not(:checked)")){
    newUserIdDocument(firstName, lastName, email);
    newUserInputDocument(feeling, sky, temperature, email);
  }else {
    let allEmails = await getEmails();
    if(allEmails.includes(email)){
      newUserInputDocument(feeling, sky, temperature, email);
    }else{
      alert("This email doesn't exist in our database");
    }
  }
});

/*  QUERYING DATA TO VISUALIZE  */
//SIDENAV TODO


/*  CONVERTING TO COLORS  */
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
      case "Excited!":
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

/*  DRAW SKY 1/2 CIRCLE, FEELING 1/2 CIRCLE, TEMP LINES  */
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

/*  DRAW WHOLE CIRCLES  */
function moodCircles(x, y, skyC, feelingC, temp) {
  skyCircle(skyC, x, y);
  feelingCircle(feelingC, x, y)
  tempLines(x, y, temp);
}

/*  AT SETUP  */
async function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  imageMode(CENTER);
  rainy = loadImage('assets/stripes.png');
  snowy = loadImage('assets/dots.png')
  other = loadImage('assets/other.png')
  await getData;
  convert(datas);
  started = true;
  noLoop();
}

/*  DRAW  */
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
