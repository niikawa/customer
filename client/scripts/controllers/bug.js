var bugCtrl = angular.module('bugCtrl',['bugServices', 'modalService']);
bugCtrl.controller('BugCtrl',['$scope', '$sce', 'Shared', 'Bug', 'Modal','Utility',
function ($scope, $sce, Shared, Bug, Modal, Utility)
{
    function setInitializeScope()
    {
        $scope.bug = [];
    }
    
    function getInitializeData()
    {
        Bug.resource.get().$promise.then(function(response)
        {
            $scope.bugList = response.data;
        });
    }
    
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();
        getInitializeData();
    };
    
    $scope.show = function()
    {
      $scope.modalParam = 
      {
          header: 'タスクを追加します', 
      };
      $scope.modalInstance = Modal.open($scope, "partials/modal/send.html");
    };
    
    $scope.save = function()
    {
        Bug.resource.save($scope.bug).$promise.then(function(response)
        {
            $scope.bugList = response.data;
        });
    };
    
}]);
