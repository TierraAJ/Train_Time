// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyDYxrnWiarxrYMY6hb7-WZVbJBqN6Mqs64",
    authDomain: "traintime-1bba5.firebaseapp.com",
    databaseURL: "https://traintime-1bba5.firebaseio.com",
    projectId: "traintime-1bba5",
    storageBucket: "",
    messagingSenderId: "865825771391"
  };
  
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // 2. Button for adding Trains
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var startTime = moment($("#start-input").val().trim(), "HH:mm").format("X");
    var frequency = $("#frequency").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      start: startTime,
      rate: frequency
    };
  
    // Uploads train data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.rate);
  
    // alert("Train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency").val("");
  });
  
  // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var startTime = childSnapshot.val().start;
    var frequency = childSnapshot.val().rate;
  
    // Train Info
    console.log(trainName);
    console.log(trainDestination);
    console.log(startTime);
    console.log(frequency);
  
    // Prettify the train start
    var startTimeObject = moment.unix(startTime);

    //Getting current time.
    var now = moment();

    // Finding minutes from the startTime to the currentTime.
    var timeBetween = now.diff(startTimeObject, "minutes");
    console.log(timeBetween);
  
    // Getting remainder of divinding timeBetween by frequency.
    //"%" : This JS-divides the two and returns remainder.
    var remainder = timeBetween % frequency;
    console.log(remainder);
  
    //Mins to next train.
    var nextTrainMin = frequency - remainder;
    console.log(nextTrainMin);

    //Retuns the Clock time as an object.
    var nextTrainObject = now.add(nextTrainMin, "minutes");
    var arrivalTime = nextTrainObject.format("HH:mm");

    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDestination),
      $("<td>").text(frequency),
      $("<td>").text(arrivalTime),
      $("<td>").text(nextTrainMin)
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });