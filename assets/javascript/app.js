$(document).ready(function() {

    var queryURL="https://opentdb.com/api.php?amount=20"

    var apiReady=false;
    questionObj={}

    function Questions(response){
        this.questions=response;
        this.answersArray=[];
        this.correctAnswers=0;
        this.incorrectAnswers=0;
        this.unAnswered=0;
        this.progressIndex=0
        this.selectQuestion= function(){
            var correctAns=this.questions.results[this.progressIndex].correct_answer;
            var incorrectAns=this.questions.results[this.progressIndex].incorrect_answers;
            this.generateAnswerList(correctAns, incorrectAns)

            var questiontext=this.questions.results[this.progressIndex].question
            var question= $("<h3>");
            question.text(questiontext)
            $(".questions").append(question)

            var answer= $("<p>")
            answer.text(this.answersArray)
            $(".questions").append(answer)


            console.log(this.questions)
            if (this.questions.results[this.progressIndex].type==="boolean"){
                //Answers should be true or false
                console.log("it is boolean")
            }
            else{
                // it is a multiple choice question
                console.log("it is multiple choice")

            }
            //var answer=this.questions.results[this.progressIndex].
           
        };
        this.generateAnswerList = function(ans, incAns){
            var randomPos=Math.floor(Math.random()*(incAns.length+1))
            var counter=0
            for (i=0; i<incAns.length+1;i++){
                if (i==randomPos){
                    this.answersArray.push(ans)
                }
                else{
                    this.answersArray.push(incAns[counter])
                    counter++
                }

            }


        }
    }

    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        apiReady=true
        questionObj = new Questions(response)

    });


    var stopwatch = {
        time: 30,      
        reset: function() {
      
          stopwatch.time = 30;      
          //  TODO: Change the "display" div to "00:00."
          var clockSpace=$("<h2>")
          clockSpace.text("00:30")
          $(".clock").append(clockSpace)
        },
        start: function() {
      
          //  TODO: Use setInterval to start the count here and set the clock to running.
            intervalId=setInterval(stopwatch.count,1000)      
        },
        stop: function() {
      
          //  TODO: Use clearInterval to stop the count here and set the clock to not be running.
          clearInterval(intervalId);
      
        },
        count: function() {
            if(stopwatch.time<=0){
                stopwatch.reset()  
            }

            stopwatch.time--
            var currentTime=stopwatch.timeConverter(stopwatch.time) 
            var clockSpace=$("<h2>")
            clockSpace.text("Time Remaining: "+ currentTime)
            $(".clock").html(clockSpace)     
        },      
        timeConverter: function(t) {      
          //  Takes the current time in seconds and convert it to minutes and seconds (mm:ss).
          var minutes = Math.floor(t / 60);
          var seconds = t - (minutes * 60);
      
          if (seconds < 10) {
            seconds = "0" + seconds;
          }
      
          if (minutes === 0) {
            minutes = "00";
          }
      
          else if (minutes < 10) {
            minutes = "0" + minutes;
          }
      
          return minutes + ":" + seconds;
        }
    };

    




    $(".startgame").click(function(){

        if(apiReady){
        $(".start-button").fadeOut()
        $(".question-hide").removeClass("hide")
        $(".question-hide").addClass("questions-space")
         questionObj.selectQuestion();

        stopwatch.start()
        }
        else{
            alert("API is not ready. Please wait a few seconds and try again")
        }
       // console.log(questionObj)
    });

});