var app = angular.module('aptitudeTestApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap', "ngTouch", "angucomplete"]);
var schedulerCtrl = function ($scope, $http, $filter) {
    $scope.getCandidateUrl = 'http://localhost:3113/getcandidates/';
    $scope.submitUrl = 'http://localhost:3113/schedulersubmit/';
    $scope.sendEmailUrl = 'http://localhost:3113/sendmail';
    $scope.hrEmailID = 'suryakumarduvvuri@gmail.com'; //'v-shkad@microsoft.com', 'v-suduv@microsoft.com', 'v-lasola@microsoft.com';
    $scope.test = '';

    $scope.ClearDateTimePickerError = function (msg) {
        jQuery("label[for='lbldateTimePickerCtrlError']").html("");
    }

    $http.get($scope.getCandidateUrl).then(function (response) {
        $scope.empData = response.data;
        $('#dateTimePickerCtrl').val("");
    });
          
    $scope.onSubmit = function (scheduler) {
       
        if (scheduler.test == 'Aptitude')
        {
            var dataObj = {
                candidateID: scheduler.ddlNames.id,
                candidateName: scheduler.ddlNames.name,
                date: $filter('date')(scheduler.date4, 'ddMMyyyy'),
                time: ''
                //time: $filter('time')(scheduler.mytime, 'hhmm')
            };
            $http.post($scope.submitUrl, dataObj);
            $scope.SendHttpPostData(dataObj);
        }
        else if (scheduler.test == 'Technical') {
            var dataObj = {
                candidateID: scheduler.ddlNames.id,
                candidateName: scheduler.ddlNames.name,
                date1: $filter('date')(scheduler.date1, 'ddMMyyyy'),
                date2: $filter('date')(scheduler.date2, 'ddMMyyyy'),
                date3: $filter('date')(scheduler.date3, 'ddMMyyyy'),
                time:''
                //time: $filter('time')(scheduler.mytime, 'hhmm')
            };
            $http.post($scope.submitUrl, dataObj);
            $scope.SendHttpPostData(dataObj);
        }
        alert("submitted successfully");
        
    }
    
    $scope.SendHttpPostData = function (dataObj) {

        var req = {
            from: "suryakumarduvvuri@gmail.com",
            to: $scope.hrEmailID,
            subject: 'Notification: Aptitude Test Date for candidate: ' + dataObj.candidateName,
            text: 'You have a Aptitude test on: ' + dataObj.date + ' at: ' + dataObj.time + '. Please click on the link http://172.25.174.68/#/home?cid=' + dataObj.candidateID + '&testdt=' + dataObj.date + '&testtm=' + dataObj.time

        };

        $http.post($scope.sendEmailUrl, req,
            { headers: { 'Content-Type': 'application/json' } })
            .success(function (response) {
                alert("failure message: " + response);
            })
    }

    $scope.sendEmail = function (msg) {
        if ($('#dateTimePickerCtrl1').val() == null || $('#dateTimePickerCtrl1').val() == "") {
            jQuery("label[for='lbldateTimePickerCtrlError1']").html("This field is required");
            return false;
        }
        if ($('#dateTimePickerCtrl2').val() == null || $('#dateTimePickerCtrl2').val() == "") {
            jQuery("label[for='lbldateTimePickerCtrlError2']").html("This field is required");
            return false;
        }
        if ($('#dateTimePickerCtrl3').val() == null || $('#dateTimePickerCtrl3').val() == "") {
            jQuery("label[for='lbldateTimePickerCtrlError3']").html("This field is required");
            return false;
        }
        var emailTo = "";
        $scope.selectedEmployees.forEach(function (element) {
            emailTo += element.EmailID + ";";
        }, this);
        if (emailTo == "") {
            jQuery("label[for='lblSelectPanelError']").html("Select employee to add");
            return false;
        }
        if (emailTo) {
            var confirmURL = "~D:/POC/App/App/EmployeeConfirmation.html?date=" + $('#dateTimePickerCtrl').val();
            var emailBody = "Hi,<br/><p> You have been Selected for the Interview Slot.<br/>Please Confirm by Clicking below URL.<br/><a href=\"" + confirmURL + "\">Confirm</a><p><br/>Thanks & Regards,<br/>Admin."
            var req = { from: "vivekgupta1981@gmail.com", to: emailTo, subject: "TA - Employee booked for Interview Slot - " + $('#dateTimePickerCtrl').val(), text: emailBody };
            $http.post($scope.sendEmailUrl, req,
            { headers: { 'Content-Type': 'application/json' } })
        }
        location.reload();
    };
}

schedulerCtrl.$inject = ['$scope', '$http', "$filter"];
app.controller('schedulerCtrl', schedulerCtrl);