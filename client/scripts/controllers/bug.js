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
    
    $scope.getByCondition = function()
    {
        console.log($scope.bug);
    };

    $scope.resolve = function(index)
    {
        var name = $scope.bugList[index].title;
        Bug.resource.resolve({id: $scope.bugList[index].id}).$promise.then(function(response)
        {
            Utility.info(name + '<br>を解決しました。');
        });
    };

    $scope.save = function()
    {
        console.log($scope.modalParam);
        
        var params = 
        {
            type: $scope.modalParam.type,
            title: $scope.modalParam.title,
            contents: $scope.modalParam.contents,
            category: $scope.modalParam.category.type,
        };
        Bug.resource.save(params).$promise.then(function(response)
        {
            Utility.info('ありがとございました。');
        });
    };
    
}]);
