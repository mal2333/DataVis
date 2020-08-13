# Data Visusalisation

https://mal2333.github.io/DataVis/

Inspired by [Dear Data](http://www.dear-data.com/) and their visual journal to document the world around us and discover more about ourselves, I decided to create a website that allows us to record this data and maybe highlight a pattern in our lives, feelings and moods!
![](https://i.imgur.com/6i3ehe1.jpg)

# Weather I am happy or not?!  :sunny: :cloud: :sun_small_cloud: :thunder_cloud_and_rain:

Data, feelings, and temperatures with p5.js and firestore

:::info
Does the weather affect your mood? Being back in Europe for the holidays and surrounded by some "negative" feelings... associated with politics, COVID, or the weather :sun_behind_rain_cloud:, I ponder coming from a hot and sunny place:
**Is this mood associated to the weather?**
:::

This database project will compile a data of your mood and the weather by asking you to note details about the sky, your percieved temperature, and your feeling.

1. **How is the sky today?**

Rainy, sunny, foggy, cloudy, other

2. **How cold is it?**

Too cold!, chillly but ok, warm, too hot!

3. **How are you feeling?**

Think about how you are generally feeling, don't correlate it to the sky, you will see the correlations at the end!

Sad, grumpy, okay/calm, joyful happy, excited!
<br><br>

## Datacollection and database structure

Users collection
- User-id (document)
    - input1 (fields)
        - day stamp
        - time stamp
        - location
        - sky color
        - temperature
        - feelings
    - input2
- User-id

**OR**

users input collection
- userinput 1
    - day/time stamp
    - location
    - sky color
    - temperature
    - feelings
    - id1
- userinput 2
    - day/time stamp
    - location
    - sky color
    - temperature
    - feelings
    - id1

users info collection
- user 1 (id1)
    - id1
    - first name
    - last name
- user 2
    - id2
    - first name
    - last name
![](https://i.imgur.com/NkAsSqB.png)
![](https://i.imgur.com/2XoWYxo.png)

### Get the data

```javascript
/*  READING USERINPUT FROM DATABASE */
function getData(ref) {
  let promise = ref.get().then(querySnap => {
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
  return promise;
}
```

## P5.js

1. `setup()`
Creates the canvas, loads a few images, gets the data from the database, and converts it
```javascript
/*  AT SETUP  */
async function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  imageMode(CENTER);
  rainy = loadImage('assets/stripes.png');
  snowy = loadImage('assets/dots.png')
  other = loadImage('assets/other.png')
  datas = await getData(userInputRef);
  convert(datas);
  started = true;
  noLoop();
}
```
2. `draw()`
Draws each circle with the data from the database.
```javascript
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
```
3. `convert(data array)`
Convert allows us to change the data inputed (words) into colors
```javascript
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
      //...
    }
    switch (d.feeling) {
      //...
    }
    switch (d.temperature) {
     //...
    }
  }
}
```
4. `skycircle(color, x, y)`
Draws the bottom 1/2 circle with the sky's color
```javascript
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
```
5. `feelingcircle(color, x, y)`
Draws the top 1/2 circle with the feeling's color
```javascript
function feelingCircle(feelingC, x, y) {
  fill(feelingC);
  arc(x, y, 100, 100, PI - PI / 18, TWO_PI - PI / 18);
}
```
5. `tempLines(x, y, numOfLines)`
Draws the lines in the centered linked to the temperature
```javascript
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
```
5. `moodCircles(x, y, colorSky, colorFeeling, numOfLines)`
Combines all of the 1/2 circles
```javascript
/*  DRAW WHOLE CIRCLES  */
function moodCircles(x, y, skyC, feelingC, temp) {
  skyCircle(skyC, x, y);
  feelingCircle(feelingC, x, y)
  tempLines(x, y, temp);
}
```

## Data input
![](https://i.imgur.com/S7UgHT6.png)
1. check `Returning User`
```javascript
//IDCHECKBOX
$('#email-check').click(function() {
  if ($(this).is(':checked')) {
    $('#first_name').attr("disabled", true);
    $('#last_name').attr("disabled", true);
  } else {
    $('#first_name').attr("disabled", false);
    $('#last_name').attr("disabled", false);
  }
});
```
2. `Submit` form
Assign all Values to corresponding variables

- If the user is new, load the form's data to the database
    - Create a new User Id that will contain: first Name, last Name, email
    - Create a new User Input that will contain: feeling, sky, temp, email

- If the user checked `Returning User` check the email provided vs. all emails of our users in our database.
    - If it exists, create a new User Input but no new User Id
    - If it doesn't exist, return an error

:warning: I didn't feel the need of getting my data in real time as my `draw()` function has to be called for each redraw, and different users inputting at the same time won't affect others' inputs.

:warning: I could have used Firestore's authorisation, which would have made the whole email/new/returning user maneuvre easier. Next time!

```javascript
//FORM SUBMIT
$("#formid").submit(async function(e) {
  e.preventDefault();
  let firstName = $("#first_name").val();
  let lastName = $("#last_name").val();
  let email = $("#email").val();
  let feeling = $(".feeling").val();
  let sky = $(".sky").val();
  let temperature = $(".temperature").val();

  if ($('#email-check').is(":not(:checked)")) {
    newUserIdDocument(firstName, lastName, email);
    newUserInputDocument(feeling, sky, temperature, email);
  } else {
    let allEmails = await getEmails();
    if (allEmails.includes(email)) {
      newUserInputDocument(feeling, sky, temperature, email);
    } else {
      alert("This email doesn't exist in our database");
    }
  }
  datas = await getData(userInputRef);
  convert(datas);
  clear();
  redraw();
});
```
3. `getEmails()`
```javascript
function getEmails() {
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
```
4. `newUserIdDocument(firstName, lastName, email)`
```javascript
/*  SEND TO DATABASE  */
//Create new document in usersIds collection
function newUserIdDocument(firstName, lastName, email) {
  let newUsersIds = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };
  userIdsRef.add(newUsersIds);
}
```
5. `newUserInputDocument(feeling, sky, temperature, email)`
```javascript
//Create new document in UserInput collection
function newUserInputDocument(feeling, sky, temperature, email) {
  let newUserInput = {
    feeling: feeling,
    skyColor: sky,
    temperature: temperature,
    email: email
  };
  userInputRef.add(newUserInput);
}
```

## Data Querying

![](https://i.imgur.com/j0ZCJAS.png)

1. Check if filtering data by email (personalized or all users)
```javascript
$('#switch').click(function() {
  if ($(this).is(':checked')) {
    $('#email-personalize').attr("disabled", false);
  } else {
    $('#email-personalize').attr("disabled", true);
  }
});
```
2. Getting all values selected and assigning to variables, clear canvas, and redraw
```javascript
//SIDENAV FILTER OUT OPTIONS
$("#filterOut").submit(async function(e) {
  e.preventDefault();
  let email = null;
  var checkFeeling = $(".feelingChoices input:checkbox:checked").map(function() {
    return $(this).val();
  }).get();
  var checkTemp = $(".tempChoices input:checkbox:checked").map(function() {
    return $(this).val();
  }).get();
  var checkSky = $(".skyChoices input:checkbox:checked").map(function() {
    return $(this).val();
  }).get();

  if ($("#switch").is(":checked")) {
    email = $("#email-personalize").val();
  }

  var allCheck = checkFeeling.concat(checkTemp, checkSky);
  editTag(allCheck);

  var filtered = await getFilteredOutData(email, checkFeeling, checkTemp, checkSky);
  datas = filtered;
  convert(datas);
  clear();
  redraw();
});
```
3. Querying the data
:warning: I had to seperate the way I was querring as we are limited when using `where("", "in", x)`.
- Verifying validity of email if selected otherwise revert to all data
```javascript
/*  GET FILTERED OUT DATA  */
async function getFilteredOutData(email, checkFeeling, checkTemp, checkSky) {
  var allQuery, feelingQuery, feelingData, tempQuery, tempData, skyQuery, skyData, allData, emailData;

  if (email != null) {
    let allEmails = await getEmails();
    if (!allEmails.includes(email)) {
      email = null;
      alert("This email doesn't exist in our database, displaying all data.");
    }
  }
```
- If we are looking for personalized data, then we check what other variable we have to consider before querying the database.
```javascript
  if (email != null && (checkFeeling.length != 0)) {
    feelingQuery = userInputRef.where("feeling", "in", checkFeeling);
    feelingData = await getData(feelingQuery.where("email", "==", email));
    allQuery = [...feelingData];
  }
  if (email != null && (checkTemp.length != 0)) {
//...
  }
  if (email != null && (checkSky.length != 0)) {
 //...
  }
  ```
 - Looking at all data, then we check what other variable we have to consider before querying the database.
  ```javascript
  if (email == null && (checkFeeling.length != 0)) {
    feelingQuery = userInputRef.where("feeling", "in", checkFeeling);
    feelingData = await getData(feelingQuery);
    allQuery = [...feelingData];
  }
  if (email == null && (checkTemp.length != 0)) {
//...
  }
  if (email == null && (checkSky.length != 0)) {
//...
```
4. Edits the tags at the top to know what variables we selected in our query.
```javascript
/*  EDIT TAGS FOR FILTERED DATA  */
function editTag(tags){
  $('#tags').children('div').remove();
  if(tags.length !== 0){
    for(t of tags){
    $('#tags').append(`<div class="chip">${t}</div>`);
    }
  }else{
    $('#tags').append(`<div class="chip">All Data</div>`);
  }
}
```
