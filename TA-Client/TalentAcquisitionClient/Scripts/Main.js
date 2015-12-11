 $(document).ready(
          function () {
              $("#startdate,#enddate ,#doj").datepicker({
                  changeMonth: true,
                  changeYear: true
              });
          }
        );


var app = angular.module('myApp', []);
app.controller('TestCtrl', function ($scope, $http) {            
    $scope.fromDate = '01/01/2016';
    $scope.toDate = '01/01/2016';
    $scope.click = function () {
        debugger;
        if ($scope.fromDate == null) {
            alert("Please enter from date");
            return;
        }
        if ($scope.toDate == null) {
            alert("Please enter to date");
            return;
        }
        if ($scope.expyears == undefined) {
            $scope.expyears = 0
        }
        if ($scope.expmonths == undefined) {
            $scope.expmonths = 0
        }

        var exp = parseInt($scope.expyears) + (parseInt($scope.expmonths) * 0.1);
        //if ($scope.fromDate == null) {
        //    alert("Please enter from date");
        //    return;
        //}
        //if ($scope.toDate == null) {
        //    alert("Please enter to date");
        //    return;
        //}

        $http.get("http://localhost:3001/search", { params: { "name": $scope.EmpName, "skillset": encodeURI($scope.skils), "qualification": $scope.Qualification, "telephone": $scope.Telephone, "ratingininterview": $scope.Rating, "doj": $scope.DOJ, "currentlyworking": $scope.Currentlyworking, "exp": exp } })
       .success(function (response) {
           debugger;
           $scope.result = response;
       });                    
       
    };
       
    $scope.clear = function () {
        $scope.EmpName = '';       
        $scope.skils = '';
        $scope.Qualification = '';
        $scope.Telephone = '';
        $scope.Rating = '';
        $scope.DOJ = '';
        $scope.Currentlyworking = '';
        $scope.expyears = '';
        $scope.expmonths = '';


    };
}        
);       
