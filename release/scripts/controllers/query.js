'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var QueryController = (function () {
    function QueryController($scope, $routeParams, Shared, Utility, Location, Query) {
        var _this = this;

        _classCallCheck(this, QueryController);

        this._scope = $scope;
        this._routeParams = $routeParams;
        this._sharedService = Shared;
        this._utilityService = Utility;
        this._locationService = Location;
        this._queryService = Query;
        this._selectTable = '';
        this.tableSearch = '';

        this._scope._construct();

        var isEdit = this._routeParams.hasOwnProperty('id');
        this._setInitializeScope(isEdit);

        if (isEdit) {
            (function () {
                var paramId = _this._routeParams.id;
                _this._queryService.resource.getControlInit({ id: paramId }).$promise.then(function (response) {
                    _this.queryName = response.data.query_name;
                    _this.tableList = response.table;
                    _this.tableListRef = response.getRefTabels(response.table);
                    if (0 === _this.selectColumns.length) {
                        _this._setEdtInitializeScope(response.data);
                    }
                    _this.isShowEditMessage = true;
                    _this._sharedService.set('updateQueryDocumentId', paramId);
                    _this._sharedService.set('updateQueryName', response.data.query_name);
                });
            })();
        } else {
            this._queryService.resource.get().$promise.then(function (response) {
                _this.tableList = response.table;
                _this.tableListRef = _this._queryService.getRefTabels(response.table);
            });
        }
    }

    _createClass(QueryController, [{
        key: '_setInitializeScope',
        value: function _setInitializeScope(isEdit) {
            this._sharedService.destloyByName('queryName');
            this._sharedService.destloyByName('updateQueryDocumentId');
            this.tableList = [];
            this.tableListRef = [];
            this.columnNum = 0;
            this.selectColumns = [];
            if (!isEdit) {
                this.selectColumns = this._sharedService.get('queryColumns') || [];
            }
            this.showSelectedColumnsBox = this.selectColumns.length > 0;
            this.conditions = [];
            this.isShowEditMessage = false;
            this.returnUrl = this._queryService.getReturnURL();
            this._sharedService.setRoot('query');
        }
    }, {
        key: '_setEdtInitializeScope',
        value: function _setEdtInitializeScope(data) {
            angular.forEach(data.tables, function (columnList, tableName) {
                angular.forEach(columnList, function (columnInfo) {
                    angular.forEach(this.tableList[tableName].column, function (columnData) {
                        if (columnInfo.column === columnData.physicalname) {
                            this.selectColumns.push({
                                table: { logicalname: this.tableList[tableName].logicalname, physicalname: this.tableList[tableName].physicalname },
                                column: columnData,
                                selectedCondition: { name: '', value: columnInfo.conditionType, symbol: '' },
                                condition: columnInfo.values
                            });

                            return false;
                        }
                    });
                });
            });
            this.showSelectedColumnsBox = this.selectColumns.length > 0;
            this._sharedService.set('queryColumns', this.selectColumns);
        }
    }, {
        key: 'showColumns',
        value: function showColumns(table) {
            this._selectTable = table;
            this.columnList = this.tableList[table].column;
            this.columnNum = this.columnList.length;
        }
    }, {
        key: 'setColumn',
        value: function setColumn(index) {
            var target = this.tableList[this._selectTable];
            var isSame = false;
            angular.forEach(this.selectColumns, function (v, k) {
                console.log(this._selectTable);
                console.log(v.table.physicalname);
                console.log(target.column[index].physicalname);
                if (v.table.physicalname === this._selectTable && v.column.physicalname === target.column[index].physicalname) {
                    isSame = true;
                }
            });
            if (!isSame) {
                this.selectColumns.push({
                    table: { logicalname: target.logicalname, physicalname: target.physicalname },
                    column: target.column[index]
                });
            }
            this.showSelectedColumnsBox = true;
            this._sharedService.set('queryColumns', this.selectColumns);
        }
    }, {
        key: 'removeColumn',
        value: function removeColumn(index) {
            this.selectColumns.splice(index, 1);
            this.showSelectedColumnsBox = this.selectColumns.length > 0;
            this._sharedService.set('queryColumns', this.selectColumns);
        }
    }]);

    return QueryController;
})();

QueryController.$inject = ['$scope', '$routeParams', 'Shared', 'Utility', 'Location', 'Query'];
angular.module('queryCtrl', ['QueryServices']).controller('QueryCtrl', QueryController);
