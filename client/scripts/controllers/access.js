var accessCtrl = angular.module('accessCtrl',['AccessServices']);
accessCtrl.controller('AccessCtrl',['$scope', '$sce', '$routeParams', 'Shared', 'Access', 'Utility',
function ($scope, $sce, $routeParams, Shared, Access, Utility)
{
    function setInitializeScope()
    {
        $scope.showDate = '';
        $scope.serchDay = '';
    }
    
    function getInitializeData()
    {
        var today = Utility.today('YYYY/MM/DD');
        Access.resource.day({day: today}).$promise.then(function(response)
        {
            $scope.logList = response.data;
        });
    }
    
    $scope.initialize = function()
    {
        $scope.$emit('requestStart');
        
        $scope._construct();
        setInitializeScope();
        getInitializeData();
        
        $scope.$emit('requestEnd');
    };
    
    $scope.serchByDay = function()
    {
        console.log($scope.serchDay);
        var days = $scope.serchDay.split('-');
        if (3 !== days.length) return false;
        
        var m = Utility.moment($scope.serchDay);
        if (m.isValid())
        {
            Access.resource.day({day: $scope.serchDay}).$promise.then(function(response)
            {
                $scope.logList = response.data;
            });
        }
    };
    
    //time line functions 
    function getTimeInitializeData()
    {
        var today = Utility.today('YYYY/MM/DD');
        getTimeLine($scope.serchDay);
    }
    
    function getTimeLine(day)
    {
        Access.resource.day({day: day, id: $routeParams.id}).$promise.then(function(response)
        {
            $scope.targetName = response.data[0].name;
            $scope.showDate = day;
            $scope.timelineList = response.data;
        });
    }

    $scope.timeLineInitialize = function()
    {
        getTimeInitializeData();
    };
    
    $scope.setPosition = function(index)
    {
        return index % 2 == 0;
    };
    
}]);
