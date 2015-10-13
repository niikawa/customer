class AccessController {
    constructor($scope, $sce, $routeParams, Shared, Access, Utility)
    {
        this.$scope = $scope; 
        this.$sce = $sce;
        this.$routeParams = $routeParams;
        this.Shared = Shared;
        this.Access = Access;
        this.Utility = Utility;

        this.Shared.destloy('serchDay');
        this.Shared.setRoot('accsess');
        
        this.showDate = '';
        this.serchDay = '';
        this.logList = [];
        
        this.targetName = '';
        this.showDate = '';
        this.timelineList = [];
    }
    
    initialize()
    {
        this.$scope._construct();
        let today = this.Utility.today('YYYY-MM-DD');
        this.$scope.$emit('requestStart');
        this.Access.resource.day({day: today}).$promise.then(response =>
        {
            this.logList = response.data;
            this.$scope.$emit('requestEnd');
        });
    }
    
    serchByDay()
    {
        if (this.Utility.isDateValid(this.serchDay))
        {
            this.Access.resource.day({day: this.serchDay}).$promise.then(response =>
            {
                this.logList = response.data;
                this.Shared.set('serchDay', this.serchDay);
            });
        }
    }

    getTimeInitializeData()
    {
        let day = this.Shared.get('serchDay');
        if (void 0 === day)
        {
            day = this.Utility.today('YYYY-MM-DD');
        }
        this.Access.resource.day({day: day, id: this.$routeParams.id}).$promise.then(response =>
        {
            this.targetName = response.data[0].name;
            this.showDate = day;
            this.timelineList = response.data;
        });
    }
    
    setPosition(index)
    {
        return index % 2 == 0;
    }
}
AccessController.$inject = ['$scope', '$sce', '$routeParams', 'Shared', 'Access', 'Utility'];
angular.module('accessCtrl',['AccessServices']).controller('AccessCtrl', AccessController);