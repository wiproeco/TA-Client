$(document).ready(
         function () {
             $("#startdate,#enddate ,#doj").datepicker({
                 changeMonth: true,
                 changeYear: true
             });
         }
       );


var app = angular.module('SearchApp', []);
app.controller('SearchCtrl', function ($scope, $http) {
    $scope.fromDate = '01/01/2016';
    $scope.toDate = '01/01/2016';
    $scope.click = function () {
        var x = moment();
        //alert(moment($scope.fromDate).format('MM/DD/YYYY'));
        if ($scope.fromDate == null) {
            alert("Please enter from date");
            return;
        }
        if ($scope.toDate == null) {
            alert("Please enter to date");
            return;
        }
        if ($scope.expyears == undefined || $scope.expyears == "") {
            $scope.expyears = 0
        }
        if ($scope.expmonths == undefined || $scope.expmonths == "") {
            $scope.expmonths = 0
        }

        var exp = parseInt($scope.expyears) + (parseInt($scope.expmonths) * 0.1);
      //  debugger;
        $http.get("http://localhost:3113/search", { params: { "name": $scope.EmpName, "skillset": encodeURI($scope.skils), "qualification": $scope.Qualification, "telephone": $scope.Telephone, "ratingininterview": $scope.Rating, "doj": $scope.DOJ, "currentlyworking": $scope.Currentlyworking, "exp": exp } })
       .success(function (response) {
        //   debugger;
           $scope.result = response;           
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
    }

}
);
