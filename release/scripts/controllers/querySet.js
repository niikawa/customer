'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var QuerySetController = (function () {
    function QuerySetController($scope, Shared, Location, Query) {
        _classCallCheck(this, QuerySetController);

        this._scope = $scope;
        this._sharedService = Shared;
        this._locationService = Location;
        this._queryService = Query;

        this._sharedService.setRoot('query set');
        this.selectColumns = this._sharedService.get('queryColumns');
        if (void 0 === this.selectColumns) this._locationService.query();

        this.docIdUrl = '';
        var docId = this._sharedService.get('updateQueryDocumentId');
        if (void 0 !== docId) {
            this.docIdUrl = '/control/' + docId;
            this.isShowEditMessage = true;
            this.queryName = this._sharedService.get('updateQueryName');
        }
    }

    _createClass(QuerySetController, [{
        key: 'removeItem',
        value: function removeItem(index) {
            this.selectColumns.splice(index, 1);
            if (0 === this.selectColumns.length) this._locationService.query();
        }
    }, {
        key: 'next',
        value: function next() {
            var isNext = false;
            angular.forEach(this.selectColumns, function (item) {
                if (item.error) {
                    return false;
                } else {
                    isNext = true;
                }
            });
            if (isNext) this._locationService.querySave();
        }
    }]);

    return QuerySetController;
})();

QuerySetController.$inject = ['$scope', 'Shared', 'Location', 'Query'];
angular.module('querySetCtrl', ['QueryServices']).controller('QuerySetCtrl', QuerySetController);
