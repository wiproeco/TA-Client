app.controller('MainController', ['$scope', '$http',
    function MainController($scope, $http) {

        $scope.people = [
            {firstName: "Daryl", surname: "Rowland", twitter: "@darylrowland", pic: "img/daryl.jpeg"},
            {firstName: "Alan", surname: "Partridge", twitter: "@alangpartridge", pic: "img/alanp.jpg"},
            {firstName: "Annie", surname: "Rowland", twitter: "@anklesannie", pic: "img/annie.jpg"}
        ];

        $scope.selectedEmployees = [];
        $scope.selectedEmployeesId;

        $scope.sendEmail = function(msg) {
             if($('#dateTimePickerCtrl').val()==null || $('#dateTimePickerCtrl').val()=="")
              {                  
                  jQuery("label[for='lbldateTimePickerCtrlError']").html("This field is required");
                  return false;
              }      
            var emailTo = "";
            $scope.selectedEmployees.forEach(function(element) {
                emailTo += element.EmailID + ";";
            }, this);
            if(emailTo=="")
            {
                jQuery("label[for='lblSelectPanelError']").html("Select employee to add");
                return false;
            }
            if (emailTo) {

                var confirmURL = "http://localhost:41609/EmployeeConfirmation.html?date=" + $('#dateTimePickerCtrl').val();
               var emailBody = "Hi,<br/><p> You have been Selected for the Interview Slot.<br/>Please Confirm by Clicking below URL.<br/><a href=\"" + confirmURL +"\">Confirm</a><p><br/>Thanks & Regards,<br/>Admin."
               var req = {from : "Addmin@wipro.com",to : emailTo,subject : "TA - Employee booked for Interview Slot - " + $('#dateTimePickerCtrl').val(),text:emailBody};
               $http.post('http://localhost:3113/sendemail', req,
                    {headers: { 'Content-Type': 'application/json'}})                 
            }
            location.reload();  
        };
        
        $scope.selectEmployee = function(msg) {
           
            if($scope.selectedEmployee==undefined )
            {                  
                jQuery("label[for='lblSelectPanelError']").html("Select employee to add");                
                return false;
            }
            else
            {
                jQuery("label[for='lblSelectPanelError']").html("");
                jQuery("label[for='lblRemovePanelError']").html("");
            }
            if(!employeeSelected($scope.selectedEmployee.originalObject)){
                $scope.selectedEmployee.originalObject.timeSlot = $('#dateTimePickerCtrl').val()
                $scope.selectedEmployees.push($scope.selectedEmployee.originalObject);
                displaySelectedEmployee($scope.selectedEmployee.originalObject);
                
            }
            $("#ex1_value").val("");
            $scope.selectedEmployee=undefined;
        };
        
         
         $scope.deleteEmployee = function(msg){
             
            if($('#employeeSelected option:selected').length == 0){
                jQuery("label[for='lblRemovePanelError']").html("Select employee(s) to remove");
                return false;
            }
            else
            {
                jQuery("label[for='lblRemovePanelError']").html("");
            }    
             $('#employeeSelected option:selected').each( function() {
                      
                var delEmployee = $(this).text();
                var tempArray = [];
                tempArray = $.grep($scope.selectedEmployees, function(a){
                    return (a.name !== delEmployee)
                });
                $scope.selectedEmployees = tempArray;
                $(this).remove();
             });
         }
        
        $scope.ClearDateTimePickerError=function(msg){
            jQuery("label[for='lbldateTimePickerCtrlError']").html("");
        }
        
        var employeeSelected = function(obj){
            var result = false;
            $scope.selectedEmployees.forEach(function(element) {
                if(obj.name === element.name){
                    result = true;
                }
            }, this);
            return result;
        }
        
        var displaySelectedEmployee = function(obj){
            var elem = document.getElementById("employeeSelected");
            var option = document.createElement("option");
            option.text = obj.name;
            elem.add(option);
        }
        
        $http.get("http://localhost:3113/ShowEmployees").then(function (response) {
               $scope.empData = response.data;
               $('#dateTimePickerCtrl').val("");
        });   
    }
]);