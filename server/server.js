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

var questionTime = 15; //seconds
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
      sessionState = "generatingQuestions";
      changeQuestionState(currentQuestionIndex,"active");
      console.log("init");
      break;
    case "generatingQuestions":
      if(Questions.find().count() > 4)
      {
        sessionState = "displayNewQuestion";
        console.log("questionsGenerated")
      }
      break;
    case "displayNewQuestion":
      sessionTime++;
      var temp = (currentQuestionIndex + 1) * questionTime;

      if(sessionTime >= temp)
      {
        changeQuestionState(currentQuestionIndex-1,"answered");
        changeQuestionState(currentQuestionIndex,"active");
        currentQuestionIndex++;
        console.log("displayNewQuestion: " + currentQuestionIndex);
        if(currentQuestionIndex >= numberOfQuestion)
        {
          changeQuestionState(currentQuestionIndex-1,"answered");
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

function changeQuestionState(i,qstate){
  Questions.update({index: i},{$set:{state: qstate}});
};
function generateQuestions()
{
  //clear questions
  Questions.remove({});
  //add questions
  for (var i=0; i<5; i++)
  {

    generateQuestion(i);
  }
  sessionCount++;
  console.log("sessonCount: " + sessionCount);
};

function generateQuestion(i)
{
    
      if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined'
                  ? args[number]
                  : match
                ;
            });
        };
      }

    var webApiServer = "vcl13hack.pica.pipreview.com/saturn1";
    var afServer = "your-af-server-name";
    var afDatabase = "your-database-name";
    var piServer = "delorean1"

    var plantSearchUrlFormat = "http://{0}/piwebapi/pisystems/{1}/databases/{2}/elements?template=Plant&nameFilter={3}";
    var constrainedPumpSearchUrlFormat = "http://{0}/piwebapi/pisystems/{1}/databases/{2}/elements?template=Pump&searchRoot={3}";
    var tagSnapshotUrlFormat = "https://{0}/piwebapi/piservers/{1}/points/{2}/snapshot";

    var wichitaPlantSearchUrl = plantSearchUrlFormat.format(webApiServer, afServer, afDatabase, "Wichita");
    
    var getTagSnapshot = tagSnapshotUrlFormat.format(webApiServer,piServer,"cdt158");
    //console.log(getTagSnapshot);
    if(i===0)
    {
      var urlCall = "https://vcl13hack.pica.pipreview.com/saturn1/piwebapi/pisystems/delorean1/databases/weather/elements/6c1e7597-862b-4b4e-a9d0-4f0c52303fb2/attributes/ff4d67b8-f16b-0557-0831-d671c1f629de/snapshot";
      var qa = {   
          question: "What is the chance of rain today in Honolulu?",
          answers: ["0%", "0%"],
          correctAnswer: 0,
          state: "unanswered",
          index: i
        };
      var test = getPIData(urlCall,qa);
    }
    if(i===1)
    {
      var urlCall = "https://vcl13hack.pica.pipreview.com/saturn1/piwebapi/pisystems/delorean1/databases/weather/elements/dd171368-90ef-4e70-a94e-db855473492e/attributes/120f3e31-0adc-071a-118a-cd58b0c4918d/snapshot";
      var qa = {   
          question: "What is the % cloud cover today in Devner?",
          answers: ["0%", "0%"],
          correctAnswer: 0,
          state: "unanswered",
          index: i
        };
      var test = getPIData(urlCall,qa);
    }
    if(i===2)
    {
      var urlCall = "https://vcl13hack.pica.pipreview.com/saturn1/piwebapi/pisystems/delorean1/databases/weather/elements/f2457c7c-520f-417c-808e-22aeb2d40bcb/attributes/048105f8-1599-0746-0d81-2eb38e37b0f2/snapshot"
      var qa = {   
          question: "What is the current temperature in Dover?",
          answers: ["0F", "0F"],
          correctAnswer: 0,
          state: "unanswered",
          index: i
        };
      var test = getPIData(urlCall,qa);
    }
    if(i===3)
    {
      var urlCall = "https://vcl13hack.pica.pipreview.com/saturn1/piwebapi/pisystems/delorean1/databases/weather/elements/d84ef72a-cd3e-43f1-940a-e75d6f2da1dd/attributes/7bc7099f-185d-02b6-3c8a-73b47f9b366e/snapshot";
      var qa = {   
          question: "What is the population of Boston?",
          answers: ["0", "0"],
          correctAnswer: 0,
          state: "unanswered",
          index: i
        };
      var test = getPIData(urlCall,qa);
    }
    if(i===4)
    {
      var urlCall = "https://vcl13hack.pica.pipreview.com/saturn1/piwebapi/pisystems/delorean1/databases/weather/elements/2f4c4a59-a47e-415d-a9a6-97fbc5dbf730/attributes/bc1f5876-d33e-0f44-0847-0e86561de15c/snapshot";
      var qa = {   
          question: "What is the chance of rain tomorrow in Boise?",
          answers: ["0%", "0%"],
          correctAnswer: 0,
          state: "unanswered",
          index: i
        };
      var test = getPIData(urlCall,qa);
    }


    //var city2 = getPIData("test");

    // var qa = {   
    //   question: "question " + i,
    //   answers: ["answer1","answer2"],
    //   correctAnswer: 1,
    //   state: "unanswered",
    //   index: i
    // };
    // return qa;
};

function getPIData(query, qa){
      // code to run on server at startupvar url = "https://vcl13hack.pica.pipreview.com/saturn1/piwebapi/piservers/delorean1/points/cdt158/snapshot"
      //var url = "https://vcl13hack.pica.pipreview.com/saturn1/piwebapi/piservers/delorean1/points/cdt158/snapshot"
      var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjFxUVd1bGFVN3lINVRvMDB4QWJhMWdFY19pNCJ9.eyJhdWQiOiJ1cmk6dmNsMTNoYWNrLlBJQ0EiLCJpc3MiOiJodHRwczovL29zaXNvZnRkZW1vaWRlbnRpdHlzZXJ2aWNlLmFjY2Vzc2NvbnRyb2wud2luZG93cy5uZXQvIiwibmJmIjoxMzg2MTE1MzEyLCJleHAiOjEzODYyMDE3MTIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvYXV0aGVudGljYXRpb25pbnN0YW50IjoiMjAxMy0xMi0wNFQwMDowMTo1Mi4zNTZaIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbm1ldGhvZCI6InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphYzpjbGFzc2VzOlBhc3N3b3JkUHJvdGVjdGVkVHJhbnNwb3J0IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9wcmltYXJ5c2lkIjoiUy0xLTUtMjEtMjU5OTgyOTc2LTE5ODQ1Mjg4ODAtMjIzODgzMTkzMS0yMTc0IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy93aW5kb3dzYWNjb3VudG5hbWUiOiJWQ0FNUFVTTElWRTEzXFx2Y2lkMDcxIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoidmNpZDA3MUB2Y2FtcHVzbGl2ZTEzLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3VwbiI6InZjaWQwNzFAdmNhbXB1c2xpdmUxMy5jb20iLCJodHRwOi8vd3d3LmhvdWRpbmlkZXYuY29tL2NsYWltcy91cG4iOiJ2Y2lkMDcxQHZjYW1wdXNsaXZlMTMuY29tIiwiaHR0cDovL3NjaGVtYXMub3Npc29mdC5jb20vY2xhaW1zL3JlbHlpbmdwYXJ0eXRlbmFudGlkZW50aWZpZXIiOiJ2Y2wxM2hhY2siLCJpZGVudGl0eXByb3ZpZGVyIjoiaHR0cDovL1Byb2dIYWNrMTNBREZTLnZDYW1wdXNsaXZlMTMuY29tL2FkZnMvc2VydmljZXMvdHJ1c3QifQ.prrr3eNNtixFVaZlcPZlH7cZmyBz1ArqImGIYivIouXkxM5JJol7jNyVEKBGSTWvMscW4UX6MuQ9GymvklqJjn_apkXuxMXMCHvbCPSXgklO5wYotZeei6NbvdijpUFZAVkxw1TqEU62p26zZBO6Hsw2-cpGi-qQlSOCqMQP7wm8qkzNtz3SvyVRVD714DSL-GknJc2Ehmn26jSHpNdN-OivSAAeGBPDiwmyThEBjcHnaSHVs94WuGK90rcxaA1qVPT6da3aSrdYKdJnXJCFAdBkXm0E2r2To_9RmtG4z5_4XoC3Z6ytMzlpnijkOL23Ah_SUBH6a61p0AEHE_nAbg";
      var data;
      Meteor.http.call("GET", query,
      {
        "headers": {'Authorization': 'JWT token="'+ token +'"'}
      },


       function (error, result) {
        if(error) {
            //console.log(error);
        } else {
            console.log('http get SUCCESS');
            if (result.statusCode === 200) {
                console.log('Status code = 200!');
                console.log(result.content);
                var data = JSON.parse(result.content);
                if(qa.index === 0)
                {
                  qa.answers = [data.Value + "%", data.Value + 5 + "%"];
                  qa.correctAnswer = 0;
                }
                if(qa.index === 1)
                {
                  qa.answers = [data.Value + "%", data.Value + 10 + "%"];
                  qa.correctAnswer = 0;
                }
                if(qa.index === 2)
                {
                  qa.answers = [data.Value - 11 + "F", data.Value + "F"];
                  qa.correctAnswer = 1;
                }
                if(qa.index === 3)
                {
                  qa.answers = [data.Value + 18929, data.Value];
                  qa.correctAnswer = 1;
                }
                if(qa.index === 4)
                {
                  qa.answers = [data.Value + "%", data.Value + 20 + "%"];
                  qa.correctAnswer = 0;
                }
                console.log(qa);
                Questions.insert(qa);
                return result.content;
            }
        }
      });
};
