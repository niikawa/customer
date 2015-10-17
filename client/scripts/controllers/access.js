var accessCtrl = angular.module('accessCtrl',['AccessServices']);
accessCtrl.controller('AccessCtrl',['$scope', '$sce', '$routeParams', 'Shared', 'Access', 'Utility',
function ($scope, $sce, $routeParams, Shared, Access, Utility)
{
    this.showDate = '';
    this.serchDay = '';
    this.logList = [];
    this.showLogList;

    this.initialize = function()
    {
        var _this = this;
        $scope._construct();

        Shared.destloy('serchDay');
        Shared.setRoot('accsess');
        var today = Utility.today('YYYY-MM-DD');
        $scope.$emit('requestStart');
        Access.resource.day({day: today}).$promise.then(function(response)
        {
            _this.logList = response.data;
            _this.showLogList = response.data.length > 0;
        });
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
    
    this.timeLineInitialize = function()
    {
        var day = Shared.get('serchDay');
        if (void 0 === day)
        {
            day = Utility.today('YYYY-MM-DD');
        }
        Access.resource.day({day: day, id: $routeParams.id}).$promise.then(function(response)
        {
            this.targetName = response.data[0].name;
            this.showDate = day;
            this.timelineList = response.data;
        });
    };
    
    this.setPosition = function(index)
    {
        return index % 2 == 0;
    };
    
}]);
