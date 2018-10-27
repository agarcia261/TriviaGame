$(document).ready(function() {

    var queryURL="https://opentdb.com/api.php?amount=3"

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
            $(".questions").empty()

            if(this.progressIndex>=this.questions.results.length){
                console.log("need to show results")
                stopwatch.stop()
                var headingResult=$("<h3>")
                headingResult.text("Here is how you did:")
                $(".questions").append(headingResult)

                var finalResults=$("<div>")
                finalResults.append("<p>Number of Correct Answers: " + this.correctAnswers+"</p>")
                finalResults.append("<p>Number of Incorrect Answers: " + this.incorrectAnswers+"</p>")
                finalResults.append("<p>Number of Questions Unanswers: " + this.unAnswered+"</p>")
                $(".questions").append(finalResults)

                var restartBtn= $("<button>")
                restartBtn.text("Restart the Questions")
                restartBtn.addClass("restart-questions btn btn-lg btn-warning")
                $(".questions").append(restartBtn)

            }
            else{
                
                this.answersArray=[]
                var correctAns=this.questions.results[this.progressIndex].correct_answer;
                var incorrectAns=this.questions.results[this.progressIndex].incorrect_answers;
                this.generateAnswerList(correctAns, incorrectAns)

                var questiontext=this.questions.results[this.progressIndex].question
                var question= $("<h3>");
                question.text(questiontext)
                $(".questions").append(question)

                var answer= $("<ol>")
                for (i=0; i<this.answersArray.length; i++){
                    var libutton=$("<li><button class='btn btn-lg'>"+this.answersArray[i]+"</button></li>")
                    libutton.attr("ansValue",this.answersArray[i])
                    libutton.addClass("answerbtn center")
                    answer.append(libutton)
                }
                $(".questions").append(answer)
            }
           
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


        };
        this.verifyAnswer = function (event){
            var answer=$(event).attr("ansValue")
            var correctAnswer=this.questions.results[this.progressIndex].correct_answer
            if(answer==correctAnswer){
                this.correctAnswers++
                $(".questions").empty()
                var message= $("<h3>");
                message.text("Well Done!!")
                $(".questions").append(message)
                var correctAnswer=$("<p> The correct answer was: "+this.questions.results[this.progressIndex].correct_answer+"</p>")
                $(".questions").append(correctAnswer)
            }
            else{
                this.incorrectAnswers++
                $(".questions").empty()
                var message= $("<h3>");
                message.text("Sorry Buddy!")
                $(".questions").append(message)
                var correctAnswer=$("<p> The correct answer is: "+this.questions.results[this.progressIndex].correct_answer+"</p>")
                $(".questions").append(correctAnswer)
            }

        }
        this.ifTimerExpires = function(){
            this.unAnswered++
            $(".questions").empty()
            var message= $("<h3>");
            message.text("Sorry, you ran out of time!!")
            $(".questions").append(message)
            var correctAnswer=$("<p> The correct answer is: "+this.questions.results[this.progressIndex].correct_answer+"</p>")
            $(".questions").append(correctAnswer)

        }
        this.restartQuestions = function(){
            this.answersArray=[];
            this.correctAnswers=0;
            this.incorrectAnswers=0;
            this.unAnswered=0;
            this.progressIndex=0
            this.selectQuestion()
            stopwatch.reset()
            stopwatch.start()

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
        time2:2,
        inBetQuestions:false,      
        reset: function() {
      
          stopwatch.time = 30;  
          stopwatch.time2 = 2;    
          //  TODO: Change the "display" div to "00:00."
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

            if (stopwatch.inBetQuestions){
                if(stopwatch.time2<=0){
                    questionObj.progressIndex++
                    questionObj.selectQuestion()
                    stopwatch.inBetQuestions=false 
                    stopwatch.reset() 

                }
                else{

                stopwatch.time2--
                }

            }
            else{

                if(stopwatch.time<=0){
                    //stopwatch.reset() 
                    stopwatch.inBetQuestions=true 
                    questionObj.ifTimerExpires()
                }
                else{
                stopwatch.time--
                }
                var currentTime=stopwatch.timeConverter(stopwatch.time) 
                var clockSpace=$("<h2>")
                clockSpace.text("Time Remaining: "+ currentTime)
                $(".clock").html(clockSpace) 
            }    
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



    // $("li").mouseover(function(){
    //     console.log("testing testing")

    // });

    $(document).on("click", ".answerbtn", mouseoverfunc);

     function mouseoverfunc(){
        stopwatch.inBetQuestions=true
        questionObj.verifyAnswer(this)
     }

     $(document).on("click", ".restart-questions", restartGame);

     function restartGame(){

        questionObj.restartQuestions()
     }

     

});