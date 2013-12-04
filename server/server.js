// All Tomorrow's Parties -- server

Meteor.publish("directory", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});

Meteor.publish("parties", function () {
  return Parties.find(
    {$or: [{"public": true}, {invited: this.userId}, {owner: this.userId}]});
});

Meteor.publish("questions", function () {
  return Questions.find();
});

var questionTime = 10; //seconds
var numberOfQuestion = 5;
var currentQuestionIndex = 0;
var sessionState = "init";
var sessionTime = 0;
var endTime = 10; //seconds
var endTimeCount = 0;

Meteor.startup( function(){

  Meteor.setInterval(gameLoop, 1000);

  });

function gameLoop()
{
  switch(sessionState)
  {
    case "init":
      generateQuestions();
      currentQuestionIndex = 0;
      sessionTime = 0;
      sessionState = "displayNewQuestion";
      console.log("init");
      break;
    case "displayNewQuestion":
      sessionTime++;
      var temp = (currentQuestionIndex + 1) * questionTime;
      
      if(sessionTime >= temp)
      {
        currentQuestionIndex++;
        console.log("displayNewQuestion: " + currentQuestionIndex);
        if(currentQuestionIndex >= numberOfQuestion)
        {
          sessionState = "end";
          endTimeCount = 0;
          console.log("end");


        }
      };
      break;
    case "end":
      endTimeCount++;
      console.log("endTimeCount: " + endTimeCount);
      if(endTimeCount > endTime)
      {
        sessionState = "init";
      }

      break;
    default:
      //code to be executed if n is different from case 1 and 2
  }
};


var sessionCount = 0;

function generateQuestions()
{
  //clear questions
  Questions.remove({});
  //add questions
  for (var i=0; i<20; i++)
  {
    var qa = {   
      question: "Why did Benny eat " + i + " spicy chickens?",
      answers: ["answer1","answer2"],
      correctAnswer: 1,
      state: "unanswered"
    };
    Questions.insert(qa);
  }
  sessionCount++;
  console.log("sessonCount: " + sessionCount);
}