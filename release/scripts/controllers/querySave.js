'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var QuerySaveController = (function () {
    function QuerySaveController($scope, Shared, Utility, Location, Query) {
        _classCallCheck(this, QuerySaveController);

        this._scope = $scope;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._locationService = Location;
        this._queryService = Query;

        this._sharedService.setRoot('query save');
        this._setEventListeners();
        this.query = { query_name: this._sharedService.get('updateQueryName') };
        this.conditions = [];

        var selectColumns = this._sharedService.get('queryColumns');
        if (void 0 === selectColumns) Location.query();

        this.docIdUrl = '';
        var docId = this._sharedService.get('updateQueryDocumentId');
        if (void 0 !== docId) {
            this.docIdUrl = '/control/' + docId;
            this.isShowEditMessage = true;
            this.queryName = this._sharedService.get('updateQueryName');
        }

        this.selectColumns = [];
        this._queryService.createCondtionString(selectColumns);
        this.showConditions = [];
        angular.forEach(selectColumns, function (v, k) {
            var array = [];
            array.push(v);
            array.isJoin = false;
            this.showConditions.push(array);
        });
    }

    _createClass(QuerySaveController, [{
        key: '_setEventListeners',
        value: function _setEventListeners() {
            this._scope.$on('dropItemComplete', function (event, data) {
                event.stopPropagation();
                angular.forEach(this.showConditions, function (v, k) {
                    console.log(v.length);
                    if (1 === v.length) v.isJoin = false;
                });
            });
        }
    }, {
        key: 'isJoin',
        value: function isJoin(items) {
            return items.isJoin;
        }
    }, {
        key: 'release',
        value: function release(pIndex, cIndex) {
            var target = [];
            target.push(this.showConditions[pIndex][cIndex]);

            console.log('削除前：' + this.showConditions.length);

            this.showConditions[pIndex].splice(cIndex, 1);

            console.log('削除後：' + this.showConditions.length);
            console.log(this.showConditions);

            if (1 === this.showConditions[pIndex].length) this.showConditions[pIndex].isJoin = false;
            this.showConditions.push(pIndex, 0, target);
            console.log('ぷっしゅ後：' + this.showConditions.length);

            console.log(this.showConditions);
        }
    }, {
        key: 'save',
        value: function save() {
            var _this = this;

            var queryColumns = this._sharedService.get('queryColumns');
            var tables = this._queryService.getTables(queryColumns);

            var parameters = {
                query_document_id: this._sharedService.get('updateQueryDocumentId'),
                query_name: this.query.query_name,
                conditionList: this.showConditions,
                tables: tables
            };
            this._queryService.resource.create(parameters).$promise.then(function (response) {
                _this._sharedService.destloyByName('queryColumns');
                _this._sharedService.destloyByName('updateQueryName');
                _this._sharedService.destloyByName('updateQueryDocumentId');
                _this._utilityService.info('クエリを保存しました');
                _this._locationService.query();
            });
        }
    }, {
        key: 'execute',
        value: function execute() {
            var _this2 = this;

            var data = this._sharedService.get('queryColumns');
            var tables = this._queryService.getTables(data);
            var parameters = { tables: tables, conditionList: this.showConditions };
            this._queryService.resource.executeQuery(parameters).$promise.then(function (response) {
                _this2._utilityService.info('該当データは' + response.result + '件あります');
            });
        }
    }]);

    return QuerySaveController;
})();

QuerySaveController.$inject = ['$scope', 'Shared', 'Utility', 'Location', 'Query'];
angular.module('querySaveCtrl', ['QueryServices']).controller('QuerySaveCtrl', QuerySaveController);
