var modalService = angular.module("myApp");
modalService.service("Modal", ["$modal" ,　function($modal) 
{
    var open = function($scope, path) {
        return $modal.open(
                {
                    templateUrl : path,
                    backdrop : 'static',
                    scope: $scope
                }
            );
        };
        return {open: open, close: $modal.$dismiss()};
    }]
);