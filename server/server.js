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
      sessionState = "displayNewQuestion";
      changeQuestionState(currentQuestionIndex,"active");
      console.log("init");
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

    Questions.insert(generateQuestion(i));
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
    var test = getPIData(getTagSnapshot);

    //var city2 = getPIData("test");

    var qa = {   
      question: "question " + i,
      answers: ["answer1","answer2"],
      correctAnswer: 1,
      state: "unanswered",
      index: i
    };
    return qa;
};

function getPIData(query){
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
            console.log(error);
        } else {
            console.log('http get SUCCESS');
            if (result.statusCode === 200) {
                console.log('Status code = 200!');
                console.log(result.content);
                return result.content;
            }
        }
      });
};
