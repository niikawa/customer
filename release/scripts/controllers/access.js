var accessCtrl = angular.module('accessCtrl',['AccessServices']);
accessCtrl.controller('AccessCtrl',['$scope', '$sce', '$routeParams', 'Shared', 'Access', 'Utility',
function ($scope, $sce, $routeParams, Shared, Access, Utility)
{
    function setInitializeScope()
    {
        this.showDate = '';
        this.serchDay = '';
        Shared.destloy('serchDay');
        Shared.setRoot('accsess');
    }
    
    function getInitializeData()
    {
        var today = Utility.today('YYYY-MM-DD');
        Access.resource.day({day: today}).$promise.then(function(response)
        {
            $scope.logList = response.data;
        });
    }
    
    this.initialize = function()
    {
        $scope.$emit('requestStart');
        
        $scope._construct();
        setInitializeScope();
        getInitializeData();
        
        $scope.$emit('requestEnd');
    };
    
    this.serchByDay = function()
    {
        if (Utility.isDateValid(this.serchDay))
        {
            Access.resource.day({day: this.serchDay}).$promise.then(function(response)
            {
                this.logList = response.data;
                Shared.set('serchDay', this.serchDay);
            });
        }
    };
    
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
            this.targetName = response.data[0].name;
            this.showDate = day;
            this.timelineList = response.data;
        });
    }

    this.timeLineInitialize = function()
    {
        getTimeInitializeData();
    };
    
    this.setPosition = function(index)
    {
        return index % 2 == 0;
    };
    
}]);
