// All Tomorrow's Parties -- server

Meteor.publish("directory", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});

Meteor.publish("parties", function () {
  return Parties.find(
    {$or: [{"public": true}, {invited: this.userId}, {owner: this.userId}]});
});

// Meteor.startup( function()
// {
//   // //clear questions
//   // Questions.remove({});
//   // //add questions
//   // for (var i=0; i<5; i++)
//   // {
//   //   var qa = {   
//   //     question: "question " + i,
//   //     answers: ["answer1","answer2"],
//   //     correctAnswer: 1
//   //   };
//   //   //Questions.insert(qa);
//   // }

//     var groceriesId = Lists.insert({name: "Groceries"});
//     Questions.insert({list: groceriesId, name: "Watercress"});
//     Questions.insert({list: groceriesId, name: "Persimmons"});


// });

  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }
  });
