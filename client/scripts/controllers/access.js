var accessCtrl = angular.module('accessCtrl',['AccessServices']);
accessCtrl.controller('AccessCtrl',['$scope', '$sce', '$routeParams', 'Shared', 'Access', 'Utility',
function ($scope, $sce, $routeParams, Shared, Access, Utility)
{
    function setInitializeScope()
    {
        $scope.showDate = '';
        $scope.serchDay = '';
        Shared.destloy('serchDay');
    }
    
    function getInitializeData()
    {
        var today = Utility.today('YYYY-MM-DD');
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
        if (Utility.isDateValid($scope.serchDay))
        {
            Access.resource.day({day: $scope.serchDay}).$promise.then(function(response)
            {
                $scope.logList = $sce.trustAsHtml(response.data);
                Shared.set('serchDay', $scope.serchDay);
            });
        }
    };
    
    //time line functions 
    function getTimeInitializeData()
    {
        var day = Shared.get('serchDay');
        if (void 0 === day)
        {
            day = Utility.today('YYYY-MM-DD');
        }
        getTimeLine(day);
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
