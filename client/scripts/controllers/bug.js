var bugCtrl = angular.module('bugCtrl',['BugServices', 'modalService']);
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
          type: '',
          title: '',
          contents: '',
          category: '',
      };
      $scope.modalInstance = Modal.open($scope, "partials/modal/send.html");
    };
    
    $scope.apology = function()
    {
        Utility.info('障害ですか。。すみません！');
    };
    
    $scope.save = function()
    {
        Bug.resource.save($scope.bug).$promise.then(function(response)
        {
            $scope.bugList = response.data;
        });
    };
    
}]);
