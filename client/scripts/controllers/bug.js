var bugCtrl = angular.module('bugCtrl',['BugServices']);
bugCtrl.controller('BugCtrl',['$scope', '$sce', 'Shared', 'Bug', 'Modal','Utility',
function ($scope, $sce, Shared, Bug, Modal, Utility)
{
    function setInitializeScope()
    {
        $scope.bug = [];
    }
    
    function getInitializeData()
    {
        Bug.resource.getByConditon().$promise.then(function(response)
        {
            $scope.isBugShow = response.data.length > 0;
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
          categoryList: Bug.categoryList,
      };
      $scope.modalInstance = Modal.open($scope, "partials/modal/send.html");
    };
    
    $scope.apology = function()
    {
        Utility.info('障害ですか。。。<br>すみません！');
    };
    
    $scope.getByConditon = function()
    {
        console.log($scope.bug);
    };

    $scope.resolve = function(index)
    {
        console.log(index);
    };

    $scope.save = function()
    {
        console.log($scope.modalParam);
        
        Bug.resource.save($scope.modalParam).$promise.then(function(response)
        {
            $scope.bugList = response.data;
        });
    };
    
}]);
