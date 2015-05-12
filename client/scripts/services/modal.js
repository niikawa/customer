var modalService = angular.module("ModalService", []);
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
        return {open: open};
    }]
);