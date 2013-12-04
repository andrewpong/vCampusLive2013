// All Tomorrow's Parties -- server

Meteor.publish("directory", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});

Meteor.publish("parties", function () {
  return Parties.find(
    {$or: [{"public": true}, {invited: this.userId}, {owner: this.userId}]});
});

Meteor.startup( function()
{
  var weatherStates = [];
  var questions = [];
  
  for (var i=0; i<5; i++)
  {
    var qa = {   
      question: "question " + i,
      answers: ["answer1","answer2"],
      correctAnswer: 1
    };
    questions.push(qa);
  }
  console.log(questions);
});
