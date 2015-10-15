class UserControll
{
    constructor($scope, $routeParams, Shared, Utility, User)
    {
        this._scope = $scope;
        this._routeParams = $routeParams;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._userService = User;
        
        this._scope._construct();
        
        this.userList = [];
        this._sharedService.setRoot('user');

        this._userService.resource.get().$promise.then(response =>
        {
            this.userList = response.data;
        });
    }
    remove(id, index)
    {
        this._userService.resource.delete({id: id}).$promise.then(response =>
        {
            this.userList.splice(index, 1);
            this._utilityService.successSticky('ユーザーを削除しました');
        });
        
    };
}
UserControll.$inject = ['$scope', '$routeParams','Shared', 'Utility', 'User'];
angular.module('userCtrl',['UesrServices']).controller('UserCtrl', UserControll);

//
// ↓↓↓↓↓↓↓ anguler + ES5 ↓↓↓↓↓
//
// var userCtrl = angular.module('userCtrl',['UesrServices']);
// userCtrl.controller('UserCtrl',['$scope', '$routeParams','Shared', 'User', 'Utility',
// function ($scope, $routeParams, Shared, User, Utility)
// {
//     function setInitializeScope()
//     {
//         $scope.userList = [];
//     }
    
//     $scope.initialize = function()
//     {
//         Shared.setRoot('user');
//         $scope._construct();
//         setInitializeScope();

//         User.resource.get().$promise.then(function(response)
//         {
//             $scope.userList = response.data;
//         });
//     };
    
//     $scope.remove = function(id)
//     {
//         User.resource.delete({id: id}).$promise.then(function(response)
//         {
//             angular.forEach($scope.userList, function(v, k)
//             {
//                 if (v.user_id === id)
//                 {
//                     $scope.userList.splice(k,1);
//                 }
//             });
//             Utility.successSticky('ユーザーを削除しました');
//         });
        
//     };
    
// }]);
