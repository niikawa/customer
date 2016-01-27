var accessCtrl = angular.module('accessCtrl',['AccessServices']);
accessCtrl.controller('AccessCtrl',['$scope', '$sce', '$routeParams', 'Shared', 'Access', 'Utility',
function ($scope, $sce, $routeParams, Shared, Access, Utility)
{
    this.showDate = '';
    this.serchDay = '';
    this.logList = [];
    this.showLogList;
    var _this = this;

    this.initialize = function()
    {
        
        $scope._construct();

        Shared.destloyByName('serchDay');
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
                _this.logList = response.data;
                _this.showLogList = response.data.length > 0;
                Shared.set('serchDay', _this.serchDay);
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
            _this.targetName = response.data[0].name;
            _this.showDate = day;
            _this.timelineList = response.data;
        });
    };
    
    this.setPosition = function(index)
    {
        return index % 2 == 0;
    };
    
}]);
