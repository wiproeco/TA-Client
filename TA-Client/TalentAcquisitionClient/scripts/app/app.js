//Define an angular module for our app
var talentAcquisitionApp = angular.module('talentAcquisitionApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'ngTouch', 'angucomplete']);

//Define Routing for app
//Uri /AddNewOrder -> template add_order.html and Controller AddOrderController
//Uri /ShowOrders -> template show_orders.html and Controller AddOrderController
talentAcquisitionApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        }).
        when('/registration', {
            templateUrl: 'views/registration.html',
            controller: 'RegistrationController'
        }).
        when('/Home', {
            templateUrl: 'views/Home.html',
            controller: 'HomeController'
        }).
        when('/search', {
            templateUrl: 'views/search.html',
            controller: 'SearchController'
        }).
        when('/panelselection', {
            templateUrl: 'views/panelselection.html',
            controller: 'PanelSelectionController'
        }).
        when('/interviewscheduler', {
            templateUrl: 'views/interviewscheduler.html',
            controller: 'InterviewSchedulerController'
        }).
        when('/EmployeeConfirmation', {
            templateUrl: 'views/EmployeeConfirmation.html',
            controller: 'EmployeeConfirmationController'
        }).
        when('/aptitudetest', {
            templateUrl: 'views/aptitudetest.html',
            controller: 'AptitudeTestController'
        }).
        when('/technicalfeedback', {
            templateUrl: 'views/technicalfeedback.html',
            controller: 'TechnicalFeedbackController'
        }).
         when('/logout', {
             templateUrl: 'views/logout.html',
             controller: 'LogoutController'
         }).
        otherwise({
             redirectTo: '/login'
        });
  }]);

talentAcquisitionApp.controller('LoginController', function ($scope, $http) {
    //debugger;
    $("#regScreen").hide();   
    $("#searchScreen").hide();
    $("#panelScreen").hide();
    $("#interviewScreen").hide();
    $("#technicalFbkScreen").hide();
    $("#employeeConfScreen").hide();
    $("#logoutScreen").hide();
    $("#UserName").hide();
    $scope.login = function () {
        $http.get("http://localhost:3113/login/", { params: { "userId": $scope.userName, "password": $scope.userPassword } })
       .success(function (response) {
           if (response.length != 0) {
               //alert("Hi");
               appData = response;
               location.href = '#Home';
               sessionStorage.setItem('empName', appData[0].fullName);
               sessionStorage.setItem('empType', appData[0].employeeType);
               sessionStorage.setItem('userID', appData[0].id);

           }
           else {
               alert("Invalid user, please enter correct username and password");
           }
       }).error(function (error) {
           alert(error);
       });
    }

});

talentAcquisitionApp.controller('HomeController', function ($scope) {
    //debugger;
    var empType = [];
    var empName = [];
    var elem = document.getElementById("user");
    var userId = sessionStorage.getItem('userID');
    if (userId == null) {
        empType = appData[0].employeeType;
        empName = appData[0].fullName;
        sessionStorage.setItem('empName', appData[0].fullName);
        sessionStorage.setItem('empType', appData[0].employeeType);
        sessionStorage.setItem('userID', appData[0].id);

    }
    else {
        empType = sessionStorage.getItem('empType');
        empName = sessionStorage.getItem('empName');

    }

    elem.value = empName;
    //$("#User1").val() = empName;
    if (empType == "Candidate") {
        $("#regScreen").hide();
        $("#ContainerForm").hide();
        $("#searchScreen").hide();
        $("#panelScreen").hide();
        $("#logoutScreen").show();
        $("#UserName").show();
        $("#interviewScreen").hide();
        $("#employeeConfScreen").hide();
        $("#technicalFbkScreen").hide();
        $("#footer").hide();
    }
    else if (empType == "HR") {
        $("#regScreen").hide();
        $("#ContainerForm").hide();
        $("#searchScreen").show();
        $("#panelScreen").show();
        $("#interviewScreen").show();
        $("#logoutScreen").show();
        $("#UserName").show();
        $("#employeeConfScreen").hide();
        $("#technicalFbkScreen").hide();
        $("#footer").hide();
    }

    else if (empType == "Employee") {
        $("#regScreen").hide();
        $("#ContainerForm").hide();
        $("#searchScreen").hide();
        $("#panelScreen").hide();
        $("#interviewScreen").hide();
        $("#employeeConfScreen").show();
        $("#logoutScreen").show();
        $("#technicalFbkScreen").show();
        $("#UserName").show();
        $("#footer").hide();

    }
});

talentAcquisitionApp.controller('LogoutController', function ($scope) {
    //debugger;
    // alert("hi");
    $("#regScreen").hide();
    $("#searchScreen").hide();
    $("#panelScreen").hide();
    $("#interviewScreen").hide();
    $("#employeeConfScreen").hide();
    $("#logoutScreen").hide();
    $("#UserName").hide();
    $("#ContainerForm").show();
    $("#footer").show();
});

talentAcquisitionApp.controller('EmployeeConfirmationController', function ($scope, $http) {

    $("#ContainerForm").show();
    $("#footer").show();
    $("#InterviewAvailability").hide();
    $("#InterviewDates").hide();
    var userid = sessionStorage.getItem('userID');
    $http.get("http://localhost:3113/GetEmployeeInterviewDates/",
            { params: { "loginid": userid } }).then(function (response) {
                $scope.Interviewdates = response.data;
                if ($scope.Interviewdates.length > 0) {
                    var objDiv = document.getElementById("InterviewAvailabilitytext");
                    $("#InterviewAvailabilitytext").empty();

                    for (var i = 0 ; i < $scope.Interviewdates.length ; ++i) {
                        var datetoshow = $scope.Interviewdates[0].date.substring(0, 2) + '/' + $scope.Interviewdates[0].date.substring(2, 4) + '/' + $scope.Interviewdates[0].date.substring(4, 8);
                        var lbltext = "Are you Available for Interview Slot on " + datetoshow + " " + $scope.Interviewdates[0].time + " - Please Confirm";

                        var newDiv = document.createElement("div");
                        var objTextNode1 = document.createTextNode("Yes");

                        var newlabel = document.createElement("LABEL");
                        newlabel.innerHTML = lbltext;
                        newDiv.appendChild(newlabel);

                        var newRadio = document.createElement("input");
                        newRadio.type = "radio";
                        newRadio.id = "radio" + i;
                        newRadio.value = "Y_" + $scope.Interviewdates[i].date + "_" + $scope.Interviewdates[i].time;
                        newRadio.name = "radioGrp" + i;
                        newRadio.defaultChecked = true;

                        var radioItem2 = document.createElement("input");
                        radioItem2.type = "radio";
                        radioItem2.name = "radioGrp" + i;
                        radioItem2.id = "radio2" + i;
                        radioItem2.value = "N_" + $scope.Interviewdates[i].date + "_" + $scope.Interviewdates[i].time;

                        var objTextNode2 = document.createTextNode("No");
                        var objLabel2 = document.createElement("label");
                        objLabel2.htmlFor = radioItem2.id;
                        objLabel2.appendChild(radioItem2);
                        objLabel2.appendChild(objTextNode2);

                        var objLabel = document.createElement("label");
                        objLabel.htmlFor = newRadio.id;
                        objLabel.appendChild(newRadio);
                        objLabel.appendChild(objTextNode1);

                        newDiv.appendChild(objLabel);
                        newDiv.appendChild(objLabel2);
                        objDiv.appendChild(newDiv);

                    }
                    //var datetoshow = $scope.Interviewdates[0].date.substring(0, 2) + '/' + $scope.Interviewdates[0].date.substring(2, 4) + '/' + $scope.Interviewdates[0].date.substring(4, 8);
                    //var lbltext = "Are you Available for Interview Slot on " + datetoshow + " " + $scope.Interviewdates[0].time + " - Please Confirm";
                    //jQuery("label[for='InterviewAvailabilitytext']").html(lbltext);
                    $("#InterviewAvailability").show();
                    $("#InterviewDates").hide();
                }
                else {
                    $("#InterviewAvailability").hide();
                    $("#InterviewDates").show();
                }
                $('#dateTimePickerCtrl').val("");
            });

    $scope.Submit = function (thisform) {
        var radioResults = 'Radio buttons: ';
        var radiobuttons = $('#InterviewAvailabilitytext').find('input:checked');
        //var elements = divid.elements;
        for (var i = 0; i < radiobuttons.length; i++) {

            if (radiobuttons[i].type == 'radio') {
                if (radiobuttons[i].checked == true) {
                    radioResults += radiobuttons[i].value + ',';
                }
            }
        }
        var selectedvalues = radioResults;
        var splitselectedvalue = selectedvalues.slice(0, selectedvalues.length - 1).split(',');

        for (var i = 0; i < splitselectedvalue.length; i++) {

            var selectedValue = splitselectedvalue[0].split('_');

            var dataObj = {
                employeeID: userid,
                interviewDate: selectedValue[1], //$scope.Interviewdates[0].date,
                interviewTime: selectedValue[2], //$scope.Interviewdates[0].time,
                status: selectedValue[0].charAt(selectedValue[0].length - 1)//$('input[name=confirm]:checked').val()
            };

            var emailFrom = $scope.Interviewdates[0].emailID;
            var hrEmailID = "wiprocarpool@gmail.com";
            var emailSubject = "Confirmed";
            if ($('input[name=confirm]:checked').val() == "N") {
                emailSubject = "Rejected";
            }
            var emailBody = "Hi,<br/><p> " + $scope.Interviewdates[0].name + "has " + emailSubject + " for the Interview Slot."
            var req = { from: emailFrom, to: hrEmailID, subject: "TA - Employee " + emailSubject + " for Interview Slot - " + $('#dateTimePickerCtrl').val(), text: emailBody };

            $http.post("http://localhost:3113/EmployeeConfirm/", dataObj,
                {
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (response) {
                    $http.post('http://localhost:3113/SendEmailFromScheduler/', req,
                 { headers: { 'Content-Type': 'application/json' } });
                    alert("Thanks for confirmation");
                    $('#dateTimePickerCtrl').val("");
                    $("#InterviewAvailability").hide();
                    $("#InterviewDates").show();
                }).error(function (error) {
                    alert('An error occurred during submit process: ' + error);
                });
        }
    }

});

talentAcquisitionApp.controller('RegistrationController', ['$scope', '$http', function ($scope, $http) {
    $("#successMessage").hide();
    $("#updateMessage").hide();
    $("#EmpTypeId").hide();
    $("#update").hide();
    $("#searchScreen").hide();
    $("#panelScreen").hide();
    $("#interviewScreen").hide();
    $("#logoutScreen").hide();
    $("#employeeConfScreen").hide();
    $("#UserName").hide();


    var email = location.hash.split('=')[1];
    if (email == undefined || email == "") {

    }
    else {
        $http.get("http://localhost:3113/getUserDetails/",
            { params: { "emailid": email } })
          .success(function (response) {
              if (response.length == 1) {
                  email = "";
                  $scope.candidate = response[0];
                  $("#register").hide();
                  $("#update").show();
                  $('#EmpTypeId').show();
                  $('#email').prop('disabled', true);
              }
          }).error(function (req) {
              alert(req);
          });
    }

    $scope.updateCandidate = function () {
        registrationDetails = $scope.candidate;
        $http({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            url: 'http://localhost:3113/updateCandidate/',
            data: registrationDetails,
            params: { 'emailid': registrationDetails.email }
        }).success(function () {
            $scope.candidate = {};
            $("#register").hide();
            $("#updateMessage").show();
            $scope.regForm.$setPristine();
        }).error(function (error) {
            alert('An error occurred during registration process: ' + error);
        });
    };


    $scope.Save = function () {
        var registrationDetails = $scope.candidate;
        $http({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            url: 'http://localhost:3113/registerCandidate/',
            data: registrationDetails
        }).success(function () {
            $scope.candidate = {};
            $("#successMessage").show();
            $scope.regForm.$setPristine();
        }).error(function (error) {
            alert('An error occurred during registration process: ' + error);
        });
    };

    checkEmployee = function () {
        $http.get("http://localhost:3113/getUserDetails/", { params: { "emailid": $scope.candidate.email } })
            .success(function (response) {
                if (response.length == 1) {
                    alert("EmailID  already exists");
                    $("#email").val("");
                }
            });
    };

}]);

talentAcquisitionApp.controller('SearchController', function ($scope, $http) {
    $("#ContainerForm").show();
    $("#footer").show();
    $(document).ready(
         function () {
             $("#startdate,#enddate ,#doj").datepicker({
                 changeMonth: true,
                 changeYear: true
             });
         }
    );

    $scope.fromDate = moment(new Date()).add(-1, 'days').format("MM/DD/YYYY")
    $scope.toDate = moment(new Date()).add(1, 'days').format("MM/DD/YYYY")

    $scope.click = function () {
        if ($scope.fromDate == null) {
            alert("Please enter from date");
            return;
        }
        if ($scope.toDate == null) {
            alert("Please enter to date");
            return;
        }
        var fromDate = $("#startdate").val();
        var toDate = $("#enddate").val();

        if ($scope.expyears == undefined || $scope.expyears == "") {
            $scope.expyears = 0
        }
        if ($scope.expmonths == undefined || $scope.expmonths == "") {
            $scope.expmonths = 0
        }
        // logic to validate the dates selection
        var startDate = $("#startdate").val();
        var endDate = $("#enddate").val();
        if (startDate != "" && endDate != "") {
            var fromValue = moment(startDate, "M/D/YYYY H:mm").valueOf()
            var toValue = moment(endDate, "M/D/YYYY H:mm").valueOf()
            if (fromValue > toValue) {
                alert("End date should be greater than or equals to startdate");
                $scope.result = null;
                return;
            }
        }



        var exp = parseInt($scope.expyears) + (parseInt($scope.expmonths) * 0.1);
        $http.get("http://localhost:3113/search/", { params: { "name": $scope.EmpName, "email": $scope.email, "skillset": encodeURI($scope.skils), "qualification": $scope.Qualification, "fromdate": fromDate, "todate": toDate, "telephone": $scope.Telephone, "ratingininterview": $scope.Rating, "doj": $scope.DOJ, "currentlyworking": $scope.Currentlyworking, "exp": exp } })
       .success(function (response) {
           if (response.length > 0) {
               $scope.result = response;
           } else {
               $scope.result = null;
           }
       }).error(function (error) {
           alert(error);
       });
    };
    $scope.clear = function () {
        $scope.EmpName = '';
        $scope.skils = '';
        $scope.expmonths = '';
        $scope.expyears = '';
        $scope.Qualification = '';
        $scope.Telephone = '';
        $scope.Rating = '';
        $scope.DOJ = '';
        $scope.Currentlyworking = '';
        $scope.email = '';
        $scope.result = null;

    }
});

talentAcquisitionApp.controller('PanelSelectionController', function ($scope, $http, $filter) {
    
    $("#ContainerForm").show();
    $("#footer").show();
    $(function () {
        $('#dateTimePickerCtrl').datetimepicker();
    });

    $scope.selectedEmployees = [];
    $scope.selectedEmployeesId;

    $scope.sendEmail = function (msg) {
        if ($('#dateTimePickerCtrl').val() == null || $('#dateTimePickerCtrl').val() == "") {
            jQuery("label[for='lbldateTimePickerCtrlError']").html("This field is required");
            return false;
        }      

        if ($("#candidateId_value").val() == "") {
            jQuery("label[for='lblSelectCandidateError']").html("Select candidate name");
            return false;
        }

        var emailTo = "";
        var interviewerDetails = [];
        $scope.selectedEmployees.forEach(function (element) {
            emailTo += element.email + ";";
            interviewerDetails.push({
                id: element.id, name: element.fullName, date: $filter('date')(new Date($('#dateTimePickerCtrl').val()), 'ddMMyyyy'),
                time: $filter('date')(new Date($('#dateTimePickerCtrl').val()), 'HH:mm'),confirm:"",emailID:element.email
            });
        }, this);
        if (emailTo == "") {
            jQuery("label[for='lblSelectPanelError']").html("Select employee to add");
            return false;
        }

        var dataObj = {
            candidateID: $scope.selectedCandidate.originalObject.id,
            interviewerDetails: interviewerDetails
        };
        $http.post('http://localhost:3113/panelsubmit', dataObj);

        if (emailTo) {

            var startDate = new Date($('#dateTimePickerCtrl').val());
            var endDate = new Date(startDate);
            endDate.setHours(startDate.getHours() + 1);

            var confirmURL = "http://localhost:11172/index.html#/login"
            var emailBody = "Hi,<br/><p> You have been Selected for the Interview Slot.<br/>Please Confirm by Clicking below URL.<br/><a href=\"" + confirmURL + "\">Confirm</a><p><br/>Thanks & Regards,<br/>Admin."
            var req = { from: "hrteam@wipro.com", to: emailTo, subject: "TA - Employee booked for Interview Slot - " + $('#dateTimePickerCtrl').val(), text: emailBody, startDate: startDate, endDate: endDate };
            $http.post('http://localhost:3113/SendEmail', req,
                 { headers: { 'Content-Type': 'application/json' } })
        }

        $("#ex1_value").val("");
        $("#candidateId_value").val("");
        $('#dateTimePickerCtrl').val("");
        $('#employeeSelected').empty();
        $('#employeeSelected').append('<option value="" disabled>Select Employee(s) to Remove</option>');
        //location.reload();
    };
        
    $scope.selectEmployee = function (msg) {
        if ($scope.selectedEmployee == undefined) {
            jQuery("label[for='lblSelectPanelError']").html("Select employee to add");                
            return false;
        }
        else {
            jQuery("label[for='lblSelectPanelError']").html("");
            jQuery("label[for='lblRemovePanelError']").html("");
        }
        if (!employeeSelected($scope.selectedEmployee.originalObject)) {
            $scope.selectedEmployee.originalObject.timeSlot = $('#dateTimePickerCtrl').val()
            $scope.selectedEmployees.push($scope.selectedEmployee.originalObject);
            displaySelectedEmployee($scope.selectedEmployee.originalObject);
                
        }
        $("#ex1_value").val("");
        $scope.selectedEmployee = undefined;
    };
        
    $scope.deleteEmployee = function (msg) {
             
        if ($('#employeeSelected option:selected').length == 0) {
            jQuery("label[for='lblRemovePanelError']").html("Select employee(s) to remove");
            return false;
        }
        else {
            jQuery("label[for='lblRemovePanelError']").html("");
        }    
        $('#employeeSelected option:selected').each(function () {
                      
            var delEmployee = $(this).text();
            var tempArray = [];
            tempArray = $.grep($scope.selectedEmployees, function (a) {
                return (a.name !== delEmployee)
            });
            $scope.selectedEmployees = tempArray;
            $(this).remove();
        });
    }
        
    $scope.ClearDateTimePickerError = function (msg) {
        jQuery("label[for='lbldateTimePickerCtrlError']").html("");
    }
        
    var employeeSelected = function (obj) {
        var result = false;
        $scope.selectedEmployees.forEach(function (element) {
            if (obj.fullName === element.name) {
                result = true;
            }
        }, this);
        return result;
    }
        
    var displaySelectedEmployee = function (obj) {
        var elem = document.getElementById("employeeSelected");
        var option = document.createElement("option");
        option.text = obj.fullName;
        elem.add(option);
    }
        
    $http.get("http://localhost:3113/ShowEmployees/").then(function (response) {
        $scope.empData = response.data;
        $('#dateTimePickerCtrl').val("");
    });   

    $http.get("http://localhost:3113/getcandidates/").then(function (response) {
        $scope.candidateData = response.data;
        $('#dateTimePickerCtrl1').val("");
    });
});

talentAcquisitionApp.controller('InterviewSchedulerController', function ($scope, $http, $filter) {
    $("#ContainerForm").show();
    $("#footer").show();
    $(function () {
        $('#dateTimePickerCtrl1').datetimepicker();
    });

    $scope.getCandidateUrl = 'http://localhost:3113/getcandidates/';
    $scope.submitUrl = 'http://localhost:3113/schedulersubmit/';
    $scope.sendEmailUrl = 'http://localhost:3113/SendEmailFromScheduler/';
    $scope.hrEmailID = 'hrteam@wipro.com';
    
    $scope.ClearDateTimePickerError = function (msg) {
        jQuery("label[for='lbldateTimePickerCtrlError1']").html("");
    }

    $http.get($scope.getCandidateUrl).then(function (response) {
        $scope.empData = response.data;
        $('#dateTimePickerCtrl1').val("");
    });

    $scope.onSubmit = function (scheduler) {

        if ($('#dateTimePickerCtrl1').val() == null || $('#dateTimePickerCtrl1').val() == "") {
            jQuery("label[for='lbldateTimePickerCtrlError1']").html("This field is required");
            return false;
        }
        //else if ($('#dateTimePickerCtrl1').val() == $('#dateTimePickerCtrl2').val()) {
        //    jQuery("label[for='lbldateTimePickerCtrlError2']").html("This field should not be same");
        //    return false;
        //}
        //else if ($('#dateTimePickerCtrl1').val() == $('#dateTimePickerCtrl3').val()) {
        //    jQuery("label[for='lbldateTimePickerCtrlError3']").html("This field should not be same");
        //    return false;
        //}
        //else if ($('#dateTimePickerCtrl2').val() != "" && ($('#dateTimePickerCtrl2').val() == $('#dateTimePickerCtrl3').val())) {
        //    jQuery("label[for='lbldateTimePickerCtrlError3']").html("This field should not be same");
        //    return false;
        //}

        if ($("#candidateId_value").val() == "") {
            jQuery("label[for='lblSelectCandidateError']").html("Select candidate name");
            return false;
        }

        var dataObj = {
            candidateID: $scope.selectedCandidate.originalObject.id,
            candidateName: $("#candidateId_value").val(),
            emailID: $scope.selectedCandidate.originalObject.email,
            testDate: $('#dateTimePickerCtrl1').val(),
            formatDate: $filter('date')(new Date($('#dateTimePickerCtrl1').val()), 'ddMMyyyy'),
            formatTime: $filter('date')(new Date($('#dateTimePickerCtrl1').val()), 'HH:mm'),
            testOrInterview: scheduler.test
        };

        $http.post($scope.submitUrl, dataObj,
            { headers: { 'Content-Type': 'application/json' }
            }).success(function (response) {
                $scope.SendHttpPostData(dataObj);
                alert("submitted successfully");
                $('#dateTimePickerCtrl1').val("");
                $("#candidateId_value").val("");
            }).error(function (error) {
                alert('An error occurred during submit process: ' + error);
            });
        
    }

    $scope.SendHttpPostData = function (dataObj) {

        var mailBody = 'Hello ' + dataObj.candidateName + ',<br/>';
        var mailSubject = "";
        if (dataObj.testOrInterview == "Test") {

            mailSubject = 'Aptitude Test Date for candidate: ' + dataObj.candidateName
            if (dataObj.testDate != "") {

                testUrl='http://localhost:11172/#/aptitudetest?cid=' + dataObj.candidateID + '&testdt=' + dataObj.formatDate + '&testtm=' + dataObj.formatTime
                mailBody += "<p> You have a Aptitude test on: " + dataObj.testDate + ".<br/> Please click on the <a href=\"" + testUrl + "\">AptitudeTest</a>" 
            }
            //if (dataObj.date2 != "") {
            //    mailBody += '<p> You have a Aptitude test on: ' + dataObj.date2 + '.<br/> Please click on the link .<br/> http://localhost:41609/#/home?cid=' + dataObj.candidateID + '&testdt=' + dataObj.date2
            //}
            //if (dataObj.date3 != "") {
            //    mailBody += '<p> You have a Aptitude test on: ' + dataObj.date3 + '.<br/> Please click on the link .<br/> http://localhost:41609/#/home?cid=' + dataObj.candidateID + '&testdt=' + dataObj.date3
            //}

        }
        else {
            mailSubject = 'Technical Interview Date for candidate: ' + dataObj.candidateName

            if (dataObj.testDate != "") {
                mailBody += '<p> You have a Technical Interview on: ' + dataObj.testDate + '.'
            }
            //if (dataObj.date2 != "") {
            //    mailBody += '<p> You have a Technical Interview on: ' + dataObj.date2 + '.'
            //}
            //if (dataObj.date3 != "") {
            //    mailBody += '<p> You have a Technical Interview on: ' + dataObj.date3 + '.'
            //}
        }
        mailBody += "<br/><br/>Thanks & Regards,<br/>HR Team."
        var req = {
            from: $scope.hrEmailID,
            to: dataObj.emailID,
            subject: mailSubject,
            text: mailBody
        };

        $http.post($scope.sendEmailUrl, req,
            { headers: { 'Content-Type': 'application/json' }
            }).success(function (response) {
            }).error(function (response) {
                alert("failure mail message: " + response);
            });
    }
});

talentAcquisitionApp.service('helperservice', function () {

    this.toBool = function (val) {
        if (val == 'undefined' || val == null || val == '' || val == 'false' || val == 'False')
            return false;
        else if (val == true || val == 'true' || val == 'True')
            return true;
        else
            return 'unidentified';
    };
});

talentAcquisitionApp.controller('AptitudeTestController', ['$scope', '$location', '$http', 'helperservice', function ($scope, $location, $http, helper) {  
    $("#ContainerForm").show();
    $("#footer").show();
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
}]);

talentAcquisitionApp.controller('TechnicalFeedbackController', function ($scope, $http, $filter) {

    $("#ContainerForm").show();
    $("#footer").show();
    $scope.getCandidatesUrl = 'http://localhost:3113/getcandidates/';
    $scope.submittechnicalfeedbackUrl = 'http://localhost:3113/submittechnicalfeedback/';

    $(function () {
        $('#remarks').val("");
    });

    $scope.submitFeedback = function () {

        if ($("#candidateId_value").val() == "") {
            jQuery("label[for='lblSelectCandidateError']").html("Select candidate name");
            return false;
        }

        if ($scope.ratings == undefined)
            return false;

        var req = {
            candidateID: $scope.selectedCandidate.originalObject.id,
            technicalRating: encodeURI($scope.ratings),
            remarks: $scope.remarks,
        };

        $http.post($scope.submittechnicalfeedbackUrl, req)
        .success(function (response) {
            alert("Technical interview feedback submitted successfully.");
            $("#candidateId_value").val("");
            $scope.ratings = '';
            $scope.remarks = '';
        }).error(function (error) {
            alert('An error occurred during submit process: ' + error);
        });
    };

    $http.get($scope.getCandidatesUrl).then(function (response) {
        $scope.candidateData = response.data;
    });
});
