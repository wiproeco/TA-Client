
var myApp = angular.module("registerApp", []);

myApp.controller("RegistrationController", function ($scope, $http) {
    $("#successMessage").hide();
    $scope.Save = function () {
        var registrationDetails = $scope.candidate;
        $http({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            url: 'http://localhost:3113/registerCandidate/',
            data: registrationDetails
        }).success(function () {
            $scope.candidate = {};
            $scope.regForm.$setPristine();
            $("#successMessage").show();
        }).error(function (error) {
            alert('An error occurred during registration process: ' + error);
        });
    };
});
