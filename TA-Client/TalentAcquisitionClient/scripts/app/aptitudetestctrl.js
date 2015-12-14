var testCtrl = function ($scope, $location, $http, helper) {
    $scope.questionUrl = 'http://localhost:3113/aptitudetest/';
    $scope.testSubmitUrl = 'http://localhost:3113/aptitudetestsubmit/';
    $scope.sendEmailUrl = 'http://localhost:3113/sendemail';
    $scope.mode = 'instructions';
    $scope.itemsPerPage = 1;
    $scope.candidateID = $location.search()['cid'];
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    $scope.isTestDate = ($location.search()['testdt'] == dd.toString() + mm.toString() + yyyy.toString());
    $scope.hrEmailID = 'v-lasola@microsoft.com';
    $scope.loadQuiz = function (questionUrl) {
        $http.get(questionUrl)
         .then(function (res) {
             $scope.questions = res.data;
             $scope.totalItems = $scope.questions.length;
             $scope.currentPage = 1;
             $scope.mode = 'quiz';
             $scope.timer();
             $scope.$watch('currentPage + itemsPerPage', function () {
                 var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                   end = begin + $scope.itemsPerPage;

                 $scope.filteredQuestions = $scope.questions.slice(begin, end);
             });

         });
    },
     $scope.goTo = function (index) {
         if (index > 0 && index <= $scope.totalItems) {
             $scope.currentPage = index;
             $scope.mode = 'quiz';
         }
     },
    $scope.isAnswered = function (index) {
        var answered = 'Not Answered';
        $scope.questions[index].Options.forEach(function (element, index, array) {
            if (element.Selected == true) {
                answered = 'Answered';
                return false;
            }
        });
        return answered;
    },

    $scope.onSubmit = function () {
        $scope.score = 0;
        $scope.questions.forEach(function (q, index) {
            if ($scope.isCorrect(q)) {
                $scope.score++;
            }
        });
        $scope.mode = 'result';
        var dataObj = {
            candidateID: $scope.candidateID,
            score: $scope.score,
        };
        $http.post($scope.testSubmitUrl, dataObj);
        $scope.SendHttpPostData($scope.candidateID, $scope.score);
    },
     $scope.isCorrect = function (question) {
         var result = 'correct';
         question.Options.forEach(function (option, index, array) {
             if (helper.toBool(option.Selected) != option.IsAnswer) {
                 result = 'wrong';
             }
         });
         if (result == "wrong") {
             return false;
         }
         else {
             return true;
         }
     },
     $scope.onSelect = function (question, option) {
         question.Options.forEach(function (element, index, array) {
             if (element.Id != option.Id) {
                 element.Selected = false;
                 //question.Answered = element.Id;
             }
         });

     }
    $scope.timer = function () {
        var start = new Date();
        var setTimer = setInterval(function () {

            var timeLeft = (1800000 - (new Date() - start)) / 1000;
            // update timer
            if (timeLeft > 0) {
                document.getElementById('timer').innerHTML = "Time left - " + Math.floor(timeLeft / 60) + ":" + Math.floor(timeLeft % 60);
            }
            else {
                document.getElementById('timer').innerHTML = "Time left -  0:0";
            }

            if (timeLeft < 1) {
                stopTimer();
                alert("Sorry, Time Up! The test is being submitted.");
                $scope.onSubmit();
                $scope.$apply();

            }
        }, 1000);

        function stopTimer() {

            clearInterval(setTimer);
        }
    }

    $scope.SendHttpPostData = function (candidateID, score) {

        var req = {
            from: "sl.sravanthi@gmail.com",
            to: $scope.hrEmailID,
            subject: 'Notification: Aptitude Test Submission for candidate: ' + candidateID,
            text: 'Candidate with ID ' + candidateID + ' has completed test with score: ' + score
        };

        $http.post($scope.sendEmailUrl, req,
            { headers: { 'Content-Type': 'application/json' } })
            .success(function (response) {
                alert("failure message: " + response);
            })
    }
}
testCtrl.$inject = ['$scope','$location', '$http', 'helperService'];
testApp.controller('testCtrl', testCtrl);