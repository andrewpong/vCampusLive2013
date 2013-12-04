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

Meteor.startup( function()
{
  //clear questions
  Questions.remove({});
  //add questions
  for (var i=0; i<5; i++)
  {
    var qa = {   
      question: "question " + i,
      answers: ["answer1","answer2"],
      correctAnswer: 1,
      state: "unanswered"
    };
    Questions.insert(qa);
  }
});

  // Meteor.startup(function () {
  //   if (Players.find().count() === 0) {
  //     var names = ["Ada Lovelace",
  //                  "Grace Hopper",
  //                  "Marie Curie",
  //                  "Carl Friedrich Gauss",
  //                  "Nikola Tesla",
  //                  "Claude Shannon"];
  //     for (var i = 0; i < names.length; i++)
  //       Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
  //   }
  // });
