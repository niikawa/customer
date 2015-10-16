export default class CoreContrller
{
    constructor($scope, Shared)
    {
        this._scope = $scope;
        this._shared = Shared;
        
        this.isHeader = (void 0 !== this._shared.get('id'));
        this._shared.set('isSpinner', false);
    }
    
    loginInit()
    {
        this._scope.isHeader = false;
    }
    
    loginComplete()
    {
        this._scope.isHeader = true;
        this._scope.userName = this._shared.get('userName');
    }
    
    loginFailed()
    {
        this._scope.isHeader = false;
    }
    
    logoutConplete()
    {
        this._scope.isHeader = false;
    }
    
    requestStart()
    {
        this._scope.isSpinner = true;
    }
    
    requestEnd()
    {
        this._scope.isSpinner = false;
    }
}
CoreContrller.$inject = ['$scope', 'Shared'];

// var coreCtrl = angular.module('coreCtrl',[]);
// coreCtrl.controller('CoreCtrl', ['$scope', 'Shared', function($scope, Shared) 
// {

//     $scope._construct = function()
//     {
//         $scope.isHeader = true;
//     };
    
//     $scope.$on('loginComplete', function(event)
//     {
//         $scope.isHeader = true;
//         $scope.userName = Shared.get('userName');
//     });

//     $scope.$on('loginInit', function(event)
//     {
//         $scope.isHeader = false;
//     });

//     $scope.$on('loginFailed', function(event)
//     {
//         $scope.isHeader = false;
//     });

//     $scope.$on('logoutConplete', function(event)
//     {
//         $scope.isHeader = false;
//     });
    
//     $scope.$on('requestStart', function(event)
//     {
//         $scope.isSpinner = true;
//     });

//     $scope.$on('requestEnd', function(event)
//     {
//         $scope.isSpinner = false;
//     });

// }]);
