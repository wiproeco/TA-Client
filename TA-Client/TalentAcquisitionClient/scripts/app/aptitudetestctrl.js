var testCtrl = function ($scope, $location, $http, helper, $filter) {
    $scope.questionUrl = 'http://localhost:3113/aptitudetest/';
    $scope.testSubmitUrl = 'http://localhost:3113/aptitudetestsubmit/';
    $scope.sendEmailUrl = 'http://localhost:3113/sendscoreemail';
    $scope.getTestSlotUrl = 'http://localhost:3113/aptitudetestslot';
    $scope.mode = 'instructions';
    $scope.itemsPerPage = 1;
    $scope.candidateID = $location.search()['cid'];
    $scope.isTestDate = true;
    $scope.hrEmailID = 'v-shkad@microsoft.com';
    $scope.dateTimeFormat = 'ddMMyyyy HH:mm';

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var hrs = today.getHours();
    var mins = today.getMinutes();

    $scope.validateTestSlot = function () {
        $http({
            url: $scope.getTestSlotUrl,
            method: "GET",
            params: { "candidateid": $scope.candidateID }
        }).then(function (res) {
            $scope.candidateDetails = {
                candidateName: res.data[0].fullName,
                employeeType: res.data[0].employeeType,
                testDate: res.data[0].testDate,
                testTime: res.data[0].testTime,
                emailID: res.data[0].email
            };

            if ($scope.candidateDetails.employeeType != 'HR') {
                var testSlot = $scope.candidateDetails.testDate + " " + $scope.candidateDetails.testTime;
                var currentDate = $filter('date')(new Date(), $scope.dateTimeFormat);
                var ms = moment(testSlot, $scope.dateTimeFormat).diff(moment(currentDate, $scope.dateTimeFormat));
                var d = moment.duration(ms);
                var mins = Math.floor(d.asMinutes());
                if (mins >= -30 & mins <= 0) {
                    $scope.isTestDate = true;
                }
                else
                $scope.isTestDate = false;

            }
        })
    };
    $scope.validateTestSlot();

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

        $scope.scorePercent = parseInt($scope.score) * 100 / parseInt($scope.questions.length);
        if ($scope.scorePercent >= 50)
            $scope.isPassed = 'Passed';
        else
            $scope.isPassed = 'Failed';
        $scope.scorePercent = $scope.scorePercent + "%";

        if ($scope.candidateDetails.employeeType != 'HR') {
        var dataObj = {
            candidateID: $scope.candidateID,
            score: $scope.scorePercent,
            isPassed: $scope.isPassed
        };
        $http.post($scope.testSubmitUrl, dataObj);
            $scope.SendHttpPostData($scope.scorePercent, $scope.isPassed);
        }
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

    $scope.SendHttpPostData = function (score, isPassed) {

        var msg = 'Candidate - <b><I>' + $scope.candidateDetails.candidateName + '</b></I> - has completed the test. Below are the details: </br></br>' +
                    '<table>' +
                    '<tr><td><b>Candidate Name</b>:</td><td>' + $scope.candidateDetails.candidateName + '</td></tr>' +
                    '<tr><td><b>Candidate Email</b>:</td><td>' + $scope.candidateDetails.emailID + '</td></tr>' +
                    '<tr><td><b>Score Acquired</b>:</td><td>' + score + '</td></tr>' +
                    '<tr><td><b>Pass/Fail Status</b>:</td><td>' + isPassed + '</td></tr>' +
                    '</table>';

        var req = {
            from: 'wiprocarpool@gmail.com',
            to: $scope.hrEmailID,
            subject: 'Notification: Aptitude Test Submission for candidate: ' + $scope.candidateDetails.candidateName,
            text: msg,
        };

        $http.post($scope.sendEmailUrl, req,
            { headers: { 'Content-Type': 'application/json' } })
            .success(function (response) {
                alert("failure message: " + response);
            })
    }
}
testCtrl.$inject = ['$scope', '$location', '$http', 'helperService', '$filter'];
testApp.controller('testCtrl', testCtrl);