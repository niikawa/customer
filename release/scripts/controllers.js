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

var approachCtrl = angular.module('approachCtrl',['ApproachServices','ScenarioServices']);
approachCtrl.controller('ApproachCtrl',['$scope', '$routeParams','Shared', 'Utility', 'Approach', 'Scenario', 'Modal',
function ($scope, $routeParams, Shared, Utility, Approach, Scenario, Modal)
{
    function getInitializeData()
    {
        Approach.resource.get().$promise.then(function(approachResponse)
        {
            $scope.approach = approachResponse.data;
            
            Scenario.resource.valid().$promise.then(function(scenarioResponse)
            {
                $scope.scenarioList = scenarioResponse.data;
                $scope.showScenarioList = (0 < $scope.scenarioList.length);
            });
        });
    }
    
    function setEventListeners()
    {
        $scope.$on('dropItemComplete', function(event, data)
        {
            $scope.scenarioList = data.to;
            $scope.$apply();
        });
    }
    
    $scope.initialize = function()
    {
        $scope._construct();
        $scope.approach = [];
        $scope.scenarioList = [];
        getInitializeData();
        setEventListeners();
        Shared.setRoot('approach');
    };
    
    $scope.save = function()
    {
        Approach.resource.save($scope.approach).$promise.then(function(response)
        {
            Utility.info('設定を更新しました');
        });
    };
    
    $scope.savePriority = function()
    {
        Scenario.resource.priority({data: $scope.scenarioList}).$promise.then(function(response)
        {
            Utility.info('優先順位を更新しました');
        });
    };
    
    $scope.showDiscription = function(id)
    {
        var info = Approach.getInfomation(id);
        
        $scope.modalParam = 
        {
            title: info.title,
            message: info.message,
            isExecute: false,
        };
        $scope.modalInstance = Modal.open($scope, "partials/modal/message.html");
    };

    $scope.bulkInvalid = function()
    {
        var params = 
        {
            title: 'シナリオの一括無効について',
            text: '有効なシナリオをすべて無効にしますがよろしいですか？<br>実行した場合、実行予定シナリオはなくなります。',
            confirmButtonText: '一括で無効にする',
            execute: function()
            {
                Scenario.resource.bulkInvalid().$promise.then(function(response)
                {
                    Utility.info('アプローチ対象シナリオをすべて無効しました。');
                    $scope.initialize();
                });
            }
        };
        Utility.infoAlert(params);
    };
    
    $scope.bulkEnable = function()
    {
        var params = 
        {
            title: 'シナリオの一括有効について',
            text: '無効なシナリオをすべて有効にしますがよろしいですか？<br>実行した場合、実行予定シナリオとしてダッシュボード画面に表示されます。',
            isExecute: true,
            confirmButtonText: '一括で有効にする',
            execute: function()
            {
                Scenario.resource.bulkEnable().$promise.then(function(response)
                {
                    Utility.info('アプローチ対象シナリオをすべて有効しました。');
                    $scope.initialize();
                });
            }
        };
        Utility.infoAlert(params);
    };
}]);

var bugCtrl = angular.module('bugCtrl',['BugServices']);
bugCtrl.controller('BugCtrl',['$rootScope','$scope', '$sce', 'Upload', 'Shared', 'Bug', 'Modal','Utility',
function ($rootScope, $scope, $sce, Upload, Shared, Bug, Modal, Utility)
{
    $scope.selectedFile = [];
    
    function setInitializeScope()
    {
        $scope.bug = {resolve: 0, type: 1};
    }
    
    function getInitializeData()
    {
        getInfo();
    }
    
    function getInfo()
    {
        Bug.resource.getByConditon($scope.bug).$promise.then(function(response)
        {
            $scope.isBugShow = response.data.length > 0;
            if ($scope.isBugShow)
            {
                Bug.addViewInfo(response.data);
                $scope.bugList = response.data;
                $scope.roleId = response.role;
            }
        });
    }
    
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();
        getInitializeData();
    };
    
    $scope.show = function()
    {
      $scope.modalParam = 
      {
          type: '',
          title: '',
          contents: '',
          category: '',
          categoryList: Bug.categoryList,
          files: null,
      };
      $scope.modalInstance = Modal.open($scope, "partials/modal/send.html");
    };
    
    $scope.apology = function()
    {
        Utility.info('障害ですか。。。<br>すみません！');
    };
    
    $scope.getByCondition = function()
    {
        getInfo();
    };

    $scope.resolve = function(index)
    {
        var name = $scope.bugList[index].title;
        Bug.resource.resolve({id: $scope.bugList[index].id}).$promise.then(function(response)
        {
            Utility.info(name + '<br>を解決しました。');
            $scope.bugList[index].resolve_name = '解決';
            getInfo();
        });
    };

    $scope.save = function()
    {
        var params = 
        {
            type: $scope.modalParam.type,
            title: $scope.modalParam.title,
            contents: $scope.modalParam.contents,
            category: $scope.modalParam.category.type,
        };
        
        if (null !== $scope.modalParam.files)
        {
            $rootScope.$broadcast('requestStart');
            Bug.saveAndUpload($scope.modalParam.files, params, function(err)
            {
                $scope.modalInstance.close();
                if (null !== err)
                {
                    Utility.error(err);
                }
                getInfo();
                $rootScope.$broadcast('requestEnd');
            });
        }
        else
        {
            Bug.resource.save(params).$promise.then(function(response)
            {
                Utility.info('ありがとございました。');
                $scope.modalInstance.close();
                getInfo();
            });
        }
    };
    
    $scope.showComment = function(index)
    {
        $scope.modalParam = 
        {
            execute: saveComment,
            onFileSelect: onFileSelect,
            files: null,
            newComment: '',
            id: $scope.bugList[index].id,
        };
        $scope.modalInstance = Modal.open($scope, "partials/modal/comment.html");
    };
    
    function onFileSelect($files)
    {
		$scope.selectedFile.push($files[0]);
    }
    
    $scope.showCommentView = function(index)
    {
        Bug.resource.getComment({id: $scope.bugList[index].id}).$promise.then(function(response)
        {
            $scope.bugList[index].comments = response.data;
        });
    };
    
    $scope.vote = function(index)
    {
        Bug.resource.vote({id: $scope.bugList[index].id}).$promise.then(function(response)
        {
            getInfo();
//            $scope.bugList[index].comments = response.data;
        });
    };

    function saveComment()
    {
        if (0 === $scope.modalParam.newComment.length) return;
        var params = 
        {
            demand_bug_id: $scope.modalParam.id,
            comment: $scope.modalParam.newComment,
        };
        if (null !== $scope.modalParam.files)
        {
            $rootScope.$broadcast('requestStart');
            Bug.commentSaveAndUpload($scope.modalParam.files, params, function(err)
            {
                $scope.modalInstance.close();
                if (null !== err)
                {
                    Utility.error(err);
                }
                getInfo();
                $rootScope.$broadcast('requestEnd');
            });
        }
        else
        {
            Bug.resource.saveComment(params).$promise.then(function(response)
            {
                $scope.modalInstance.close();
                getInfo();
            });
        }
    }
    
    $scope.download = function(id)
    {
        if (null === id || void 0 === id) return false;
        Bug.resource.download({id: id}).$promise.then(function(response)
        {
            $scope.modalInstance.close();
            getInfo();
        });
    };
}]);

var coreCtrl = angular.module('coreCtrl',[]);
coreCtrl.controller('CoreCtrl', ['$scope', 'Shared', function($scope, Shared) 
{
    $scope.isHeader = (void 0 !== Shared.get('id'));
    Shared.set('isSpinner', false);

    $scope._construct = function()
    {
        $scope.isHeader = true;
    };
    
    $scope.$on('loginComplete', function(event)
    {
        $scope.isHeader = true;
        $scope.userName = Shared.get('userName');
    });

    $scope.$on('loginInit', function(event)
    {
        $scope.isHeader = false;
    });

    $scope.$on('loginFailed', function(event)
    {
        $scope.isHeader = false;
    });

    $scope.$on('logoutConplete', function(event)
    {
        $scope.isHeader = false;
    });
    
    $scope.$on('requestStart', function(event)
    {
        $scope.isSpinner = true;
    });

    $scope.$on('requestEnd', function(event)
    {
        $scope.isSpinner = false;
    });

}]);

var mainCtrl = angular.module('dashbordCtrl',['ScenarioServices']);
mainCtrl.controller('DashbordCtrl',['$scope', 'Shared', 'Scenario', 'Utility', 'Modal',
function ($scope, Shared, Scenario, Utility, Modal)
{
    function setInitializeScope()
    {
        $scope.scenario = [];
        $scope.executePlanScenario = [];
    }
    
    function getInitializeData()
    {
        Scenario.resource.typeCount().$promise.then(function(response)
        {
            $scope.scenarioInfo = response.data;
            Scenario.resource.executeplan().$promise.then(function(response)
            {
                $scope.isShowExecutePlanScenario = (response.data.length > 0);
                $scope.executePlanNum = response.data.length;
                $scope.exemptPlanNum = $scope.scenarioInfo.regist_num - $scope.executePlanNum;
                $scope.executePlanScenario = response.data;
            });
        });
    }
    
    $scope.initialize = function()
    {
        $scope.$emit('requestStart');
        
        $scope._construct();
        setInitializeScope();
        getInitializeData();
        Shared.setRoot('dashbord');
        
        $scope.$emit('requestEnd');
    };
    
    $scope.bulkInvalid = function()
    {
        $scope.modalParam = 
        {
            title: 'シナリオの一括無効について',
            message: '実行予定のシナリオをすべて無効にしますがよろしいですか？<br>再度有効にする場合はアプローチ管理画面から有効にできます。',
            isExecute: true,
            executeLabel: '一括で無効にする',
            execute: function()
            {
                Scenario.resource.bulkInvalid().$promise.then(function(response)
                {
                    setInitializeScope();
                    getInitializeData();
                    $scope.modalInstance.close();
                    Utility.info('実行予定のシナリオを一括無効しました。');
                });
            }
        };
        $scope.modalInstance = Modal.open($scope, "partials/modal/message.html");
    };
}]);

var loginCtrl = angular.module('loginCtrl',['AuthServices',]);
loginCtrl.controller('LoginCtrl', ['$scope', '$location', 'Auth', 'Location',
    function($scope, $location, Auth, Location) {
    
    $scope.initialize = function()
    {
        $scope.$emit('loginInit');
        $scope.data = {mailAddress:'', password:'', remember:false};
    };
    
    $scope.submit = function()
    {
        $scope.$emit('requestStart');
        Auth.login($scope.data).then(function(response)
        {
            $scope.$emit('requestEnd');
            $scope.$emit('loginComplete');
            Location.home();
            //Auth.setLoginStatus(response.data.user_id);
        }, function()
        {
            $scope.$emit('requestEnd');
        });
    };
}]);

var mainCtrl = angular.module('mainCtrl',['CustomerServices', 'AzureServices']);
mainCtrl.controller('MainCtrl',['$scope', 'Shared', 'Customer', 'Azure', 'Utility',
function ($scope, Shared, Customer, Azure, Utility)
{
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        $scope.customerList = [];
        $scope.approch = [];
        $scope.customer = [];
        $scope.rank = '';
        //autocomplete用
        $scope.selectedCustomer = {};
        $scope.lineLabel = '';
        $scope.addStyle = "";
        $scope.legendLabel = [];
        $scope.isGetData = false;
    }
    
    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();

        Customer.resource.get().$promise.then(function(response)
        {
            $scope.customerList = response.data;
        });
    };
    
    $scope.custmoerChangeExecute = function()
    {
        $scope.$emit('requestStart');
        Customer.resource.detail({id: $scope.selectedCustomer.Id}).$promise.then(function(response)
        {
            $scope.customer = response.customer;
            $scope.approch = response.approch;
            $scope.rank = $scope.approch[0].name;
            $scope.addStyle = 'two-row';
            var coefficient = Utility.diffMonth(
                                response.customer.last_purchasing_date, response.customer.start_purchasing_date);
            
            $scope.customer.frequency_avg = 
                Math.round(response.customer.frequency * 10 / coefficient) / 10;
            $scope.customer.monetary_avg = 
                Math.round(response.customer.monetary / coefficient);
            
            $scope.customer.last_purchasing_date = 
                Utility.formatString($scope.customer.last_purchasing_date, 'YYYY年MM月DD日');
            
            
            //グラフ描画
            $scope.lineLabel = '直近1年の売上推移（月別サマリ）';
            $scope.legendLabel = [$scope.selectedCustomer.customer_id, 'ランク平均'];

            $scope.orders = [response.orders, response.orders_avg];
            $scope.$emit('requestEnd');
            $scope.isGetData = true;
        });
    };
    
    $scope.recomender = function()
    {
        $scope.$emit('requestStart');
        Azure.resource.recomender({id: $scope.selectedCustomer.Id}).$promise.then(function(response)
        {
            $scope.$emit('requestEnd');
            if ( '' === response.data)
            {
                Utility.successSticky('おすすめ商品はありません');
            }
            else
            {
                //0番目はユーザーIDのため削除
                var reco = response.data[0];
                delete reco[0];
                Utility.successSticky(reco.join());
            }
        });
    };
}]);

/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var mapCtrl = angular.module('mapCtrl',[]);
mapCtrl.controller('MapCtrl',['$scope', 'Shared', 'Utility',
function ($scope, GEO, Shared, Utility)
{
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        
    }
    
    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();
    };
    
}]);

var queryListCtrl = angular.module('queryListCtrl',['QueryServices']);
queryListCtrl.controller('QueryListCtrl',['$scope', 'Shared', 'Query', 'Segment','Modal','Location', 'Utility',
function ($scope, Shared, Query, Segment, Modal, Location, Utility)
{
    function setInitializeScope()
    {
        $scope.queryList = [];
        Shared.setRoot('query list');
    }
    
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();

        Query.resource.getList().$promise.then(function(response)
        {
            $scope.queryList = response.data;
            $scope.isQueryShow = $scope.queryList.length > 0;
        });
    };
    
    $scope.showSegment = function(index)
    {
        if (void 0 === $scope.queryList[index].id) return;
        var target = $scope.queryList[index];
        var params = {qId: target.id, count: target.useNum};
        Segment.resource.useSegment(params).$promise.then(function(response)
        {
            $scope.modalParam = 
            {
                title: $scope.queryList[index].query_name+"を利用しているセグメント",
                list: response.data,
                hrefBase: '#/segment/control',
                dynamicParamKey: 'id',
                close: function(id)
                {
                    $scope.modalInstance.close();
                    Location.segmentControl(id);
                }
            };
            $scope.modalInstance = Modal.open($scope, "partials/modal/list.html");
            
        });
    };
    
    $scope.deleteItem = function(index)
    {
        if (void 0 === $scope.queryList[index]) return;
        var name = $scope.queryList[index].query_name;
        Query.resource.remove({id: $scope.queryList[index].id}).$promise.then(function(response)
        {
            Utility.info(name + '<br>を削除しました。');
            $scope.queryList.splice(index,1);
        });
    };
}]);

var queryCtrl = angular.module('queryCtrl',['QueryServices']);
queryCtrl.controller('QueryCtrl',['$scope', '$routeParams', 'Shared', 'Query', 'Location', 'Utility',
function ($scope, $routeParams, Shared, Query, Location, Utility)
{
    var selectTable = '';
    
    function setInitializeScope(isEdit)
    {
        Shared.destloyByName('queryName');
        Shared.destloyByName('updateQueryDocumentId');
        $scope.tableList = [];
        $scope.tableListRef = [];
        $scope.columnNum = 0;
        $scope.selectColumns = [];
        if (!isEdit)
        {
            var root = Shared.getRoot();
            if ( (void 0 !== root || 0 < root.length) && 'query set' === root[root.length-1])
            {
                $scope.selectColumns = Shared.get('queryColumns') || [];
            }
            else
            {
                Shared.destloyByName('queryColumns');
            }
        }
        $scope.showSelectedColumnsBox = $scope.selectColumns.length > 0;
        $scope.conditions = [];
        $scope.isShowEditMessage = false;
        $scope.returnUrl = Query.getReturnURL();
        Shared.setRoot('query');
    }
    
    function setEdtInitializeScope(data)
    {
        angular.forEach(data.tables, function(columnList, tableName)
        {
            angular.forEach(columnList, function(columnInfo)
            {
                angular.forEach($scope.tableList[tableName].column, function(columnData)
                {
                    if (columnInfo.column === columnData.physicalname)
                    {
                        $scope.selectColumns.push(
                        {
                            table: {logicalname: $scope.tableList[tableName].logicalname, physicalname:  $scope.tableList[tableName].physicalname}, 
                            column: columnData,
                            selectedCondition: {name: '', value: columnInfo.conditionType, symbol: ''},
                            condition: columnInfo.values
                        });
                        
                        return false;
                    }
                });
            });
        });
        $scope.showSelectedColumnsBox = $scope.selectColumns.length > 0;

        Shared.set('queryColumns', $scope.selectColumns);
    }
    
    $scope.initialize = function()
    {
        var isEdit = $routeParams.hasOwnProperty('id');
        $scope._construct();
        setInitializeScope(isEdit);
        
        if (isEdit)
        {
            Query.resource.getControlInit({id: $routeParams.id}).$promise.then(function(response)
            {
                $scope.queryName = response.data.query_name;
                $scope.tableList = response.table;
                $scope.tableListRef = Query.getRefTabels(response.table);
                if (0 === $scope.selectColumns.length)
                {
                    setEdtInitializeScope(response.data);
                }
                $scope.isShowEditMessage = true;
                Shared.set('updateQueryDocumentId', $routeParams.id);
                Shared.set('updateQueryName', response.data.query_name);
            });
        }
        else
        {
            Query.resource.get().$promise.then(function(response)
            {
                $scope.tableList = response.table;
                $scope.tableListRef = Query.getRefTabels(response.table);
            });
        }
    };
    
    $scope.showColumns = function(table)
    {
        selectTable = table;
        //非表示にするため初期化
        $scope.columnList = [];
        $scope.columnNum = 0;
        var selectTableName = $scope.tableList[table].logicalname;
        //選択するテーブルの関連をチェックする
        var num = $scope.selectColumns.length;
        var tableObje = {};
        //選択しているテーブルを保持させる
        tableObje[table] = selectTableName;
        for (var index = 0; index < num; index++)
        {
            var name = $scope.selectColumns[index].table.physicalname;
            if (!tableObje.hasOwnProperty(name))
            {
                tableObje[name] = $scope.selectColumns[index].table.logicalname;
            }
        }
        var hasRelation = (void 0 !== $scope.tableList[table].relation);
        var checkTableList = Object.keys(tableObje);
        var tableNum = checkTableList.length;
        if (hasRelation)
        {
            var relationList = $scope.tableList[table].relation.split(" ");
            var relationListNum = relationList.length;
            var isRelation = false;
            //選択しているテーブルが押下したテーブルのリレーションに含まれているかをチェック
            for (var tableIndex = 0; tableIndex < tableNum; tableIndex++)
            {
                isRelation = false;
                var checkTableName = checkTableList[tableIndex];
                for (var relationIndex = 0; relationIndex < relationListNum; relationIndex++)
                {
                    //リレーション関係にあるテーブル以外が選択されていないかチェック
                    if (relationList[relationIndex] === checkTableName || selectTable === checkTableName)
                    {
                        isRelation = true;
                        break;
                    }
                }
                if (!isRelation)
                {
                    Utility.warning(selectTableName+"は選択済みテーブルと関連がありません");
                    break;
                }
            }
            if (isRelation)
            {
                $scope.columnList = $scope.tableList[table].column;
                $scope.columnNum = $scope.columnList.length;
            }
        }
        else if (1 !== tableNum && !hasRelation)
        {
            //リレーションを持たないテーブルの場合、結合不可のため選択しているテーブルが
            //自分で無い場合は選択不可とする。
            Utility.warning(selectTableName+"は選択済みテーブルと関連がありません");
        }
        else
        {
            $scope.columnList = $scope.tableList[table].column;
            $scope.columnNum = $scope.columnList.length;
        }
    };
    
    $scope.setColumn = function(index)
    {
        var target = $scope.tableList[selectTable];
        var isSame = false;
        angular.forEach($scope.selectColumns, function(v, k)
        {
            if (v.table.physicalname === selectTable && v.column.physicalname === target.column[index].physicalname)
            {
                isSame = true;
            }
        });
        if (!isSame)
        {
            $scope.selectColumns.push(
            {
                table: {logicalname: target.logicalname, physicalname:  target.physicalname}, 
                column: target.column[index]
            });
        }
        $scope.showSelectedColumnsBox = true;
        Shared.set('queryColumns', $scope.selectColumns);
    };
    
    $scope.removeColumn = function(index)
    {
        $scope.selectColumns.splice(index, 1);
        $scope.showSelectedColumnsBox = ($scope.selectColumns.length > 0);
        Shared.set('queryColumns', $scope.selectColumns);
    };
    
    /****************************************/
    /*                  set                 */
    /****************************************/
    function editSetInitializeScope()
    {
        $scope.docIdUrl = '';
        var docId = Shared.get('updateQueryDocumentId');
        if (void 0 !== docId)
        {
            $scope.docIdUrl = '/control/'+docId;
            $scope.isShowEditMessage = true;
            $scope.queryName = Shared.get('updateQueryName');
        }
    }
    
    $scope.nextValidation = function()
    {
        Shared.setRoot('query set');
        $scope.selectColumns = Shared.get('queryColumns');
        if (void 0 === $scope.selectColumns) Location.query();
        $scope.columnsRows = [];
        var num = $scope.selectColumns.length;
        var workRow = [];
        for (var index = 0; index < num; index++)
        {
            if (0 !==index && 0 === index % 3)
            {
                $scope.columnsRows.push(workRow);
                workRow = [];
            }
            workRow.push($scope.selectColumns[index]);
        }
        if (0 < workRow.length) $scope.columnsRows.push(workRow);

        editSetInitializeScope();
    };
    
    $scope.removeItem = function(i, j)
    {
        var selectColumns = Shared.get('queryColumns');
        //削除用インデックスを算出
        var removeIndex = i*3 + j;
        selectColumns.splice(removeIndex, 1);
        if (0 === selectColumns.length) Location.query();
        
        var num = selectColumns.length;
        var workRow = [];
        $scope.columnsRows = [];
        for (var index = 0; index < num; index++)
        {
            if (0 !==index && 0 === index % 3)
            {
                $scope.columnsRows.push(workRow);
                workRow = [];
            }
            workRow.push(selectColumns[index]);
        }
        if (0 < workRow.length) $scope.columnsRows.push(workRow);
        Shared.set('queryColumns', selectColumns);
    };
    
    $scope.next = function()
    {
        var isNext = false;
        angular.forEach($scope.selectColumns, function(item)
        {
            if (item.error)
            {
                return false;
            }
            else
            {
                isNext = true;
            }
        });
        if (isNext) Location.querySave();
    };
    
    /*****************************************/
    /*                  save                 */
    /*****************************************/
    function setEventListeners()
    {
        $scope.$on('dropItemComplete', function(event, data)
        {
            event.stopPropagation();
            angular.forEach($scope.showConditions, function(v, k)
            {
                console.log(v.length);
                if (1 === v.length) v.isJoin = false;
            });
        });
    }

    $scope.saveInitialize = function()
    {
        Shared.setRoot('query save');
        setEventListeners();
        editSetInitializeScope();
        $scope.query = {query_name: Shared.get('updateQueryName')};
        $scope.conditions = [];
        var selectColumns = Shared.get('queryColumns');

        if (void 0 === selectColumns)
        {
            Location.query();
        }
        $scope.selectColumns = [];
        Query.createCondtionString(selectColumns);
        $scope.showConditions = [];
        angular.forEach(selectColumns, function(v, k)
        {
            var array = [];
            array.push(v);
            array.isJoin = false;
            $scope.showConditions.push(array);
        });
    };
    
    $scope.isJoin = function(items)
    {
        return items.isJoin;
    };

    $scope.release = function(pIndex, cIndex)
    {
        var target = [];
        target.push($scope.showConditions[pIndex][cIndex]);
        $scope.showConditions[pIndex].splice(cIndex, 1);
        if (1 === $scope.showConditions[pIndex].length) $scope.showConditions[pIndex].isJoin = false;
        
        console.log('ぷっしゅ前：' +$scope.showConditions.length);
        console.log($scope.showConditions);
        $scope.showConditions.splice(pIndex+1, 0, target);
        console.log('ぷっしゅ後：' +$scope.showConditions.length);
        console.log($scope.showConditions);
    };

    $scope.save = function()
    {
        var queryColumns = Shared.get('queryColumns');
        var tables = Query.getTables(queryColumns);

        var parameters = 
        {
            query_document_id: Shared.get('updateQueryDocumentId'),
            query_name: $scope.query.query_name, 
            conditionList: $scope.showConditions, 
            tables: tables
        };
        Query.resource.create(parameters).$promise.then(function(response, err)
        {
            Shared.destloyByName('queryColumns');
            Shared.destloyByName('updateQueryName');
            Shared.destloyByName('updateQueryDocumentId');
            Utility.info('クエリを保存しました');
            Location.query();
        });
    };
    
    $scope.execute = function()
    {
        var data = Shared.get('queryColumns');
        var tables = Query.getTables(data);
        var parameters = {tables: tables, conditionList: $scope.showConditions};
        Query.resource.executeQuery(parameters).$promise.then(function(response, err)
        {
            Utility.info('該当データは' + response.result + '件あります');
        });
    };
}]);
/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var scenarioCtrl = angular.module('scenarioCtrl',['ScenarioServices']);
scenarioCtrl.controller('ScenarioCtrl',['$scope', '$routeParams','Shared', 'Utility', 'Scenario', 
function ($scope, $routeParams, Shared, Utility, Scenario)
{
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        $scope.addPageTitle = "シナリオ";
        // $scope.addPageTitle = Scenario.getPageProp($routeParams.scenario).title;
        $scope.type = $routeParams.scenario;
        
        $scope.scenarioList = [];
    }
    
    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        Shared.setRoot('scenario');
        $scope._construct();
        setInitializeScope();

        Scenario.resource.get({type: $routeParams.scenario}).$promise.then(function(response)
        {
            $scope.isScenarioShow = response.data.length > 0 ? true: false;
            if ($scope.isScenarioShow)
            {
                $scope.scenarioList = response.data;
            }
        });
    };
    
    $scope.remove = function(index)
    {
        if (void 0 === index || isNaN(parseInt(index, 10))) return false;
        var id = $scope.scenarioList[index].scenario_id;
        var name = $scope.scenarioList[index].scenario_name;
        var params = 
        {
            type: $routeParams.scenario,
            id: id,
        };

        Scenario.resource.remove(params).$promise.then(function(response)
        {
            Utility.info(name+'<br>'+'を削除しました。');
            $scope.scenarioList.splice(index, 1);
            $scope.isScenarioShow = $scope.scenarioList.length > 0 ? true: false;
        });
    };
    
}]);

var scenarioControlCtrl = angular.module('scenarioControlCtrl',['ScenarioServices','SegmentServices']);
scenarioControlCtrl.controller('ScenarioControlCtrl',['$scope', '$routeParams', 'Modal','Shared', 'Utility', 'Location', 'Scenario',
function ($scope, $routeParams, Modal, Shared, Utility, Location, Scenario)
{
    var pageProp = Scenario.getPageProp($routeParams.scenario, $routeParams.id);
    var id = $routeParams.id;
    var actionId = 0;
    var selectConditionList = [];
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        $scope.isBaseCollapse = false; //基本設定Collapse制御
        $scope.isOriginCollapse = false; //個別設定Collapse制御
        $scope.isShowExtraction = false; //抽出条件表示制御

        $scope.pageTitle = "シナリオ"+pageProp.addTitle;

        // $scope.pageTitle = pageProp.title+pageProp.addTitle;
        
        $scope.scenario = {};
        $scope.scenario.approach;
        $scope.scenario.status;
        
        $scope.type = $routeParams.scenario;
        $scope.template = pageProp.template;
        
        $scope.inputTag = '';
        $scope.tagList = [];
        $scope.selectTagList = [];
        $scope.isTagCollapse = false;

        Shared.setRoot($scope.type +' scenario');
        if (1 === pageProp.type)
        {
            $scope.specificInfo = 
            {
                repeat_flag: null,
                expiration_start_date: Utility.today('YYYY-MM-DD'),
                expiration_end_date: '',
                interval: 0, 
                intervalCondition: '', 
                daysCondition: Scenario.daysCondition(),
                weekCondition: {mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false}
            };
        }
        else if (2 === pageProp.type)
        {
            $scope.conditions = [];
            $scope.specificInfo = {};
            $scope.decisionList = [];
        }
    }
    
    function setValidation()
    {
        $scope.validators = 
        {
            segment:
            {
                isSelect: function (modelValue, viewValue)
                {
                    var segmentList = $scope.segmentList || {};
                    var isSelect = false;
                    angular.forEach(segmentList, function(item, key)
                    {
                        if (item.isPush) isSelect = true;
                    });
                    return isSelect;
                }
            },
            ifLayout:
            {
                isSelect: function (modelValue, viewValue)
                {
                    var ifList = $scope.ifList || {};
                    var isSelect = false;
                    angular.forEach(ifList, function(item, key)
                    {
                        if (item.isPush) isSelect = true;
                    });
                    return isSelect;
                }
            },
            expiration_start_date:
            {
                isDateValid: function(modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    return Utility.isDateValid(val);
                }
            },
            expiration_end_date:
            {
                isDateValid: function(modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    return Utility.isDateValid(val);
                },
                isAfter: function(modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    return Utility.isAfter(val, $scope.specificInfo.expiration_start_date);
                }
            },
            interval:
            {
                isSelect: function (modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    return 0 !== val;
                }
            },
            weekCondition:
            {
                isSelect: function (modelValue, viewValue)
                {
                    var weekCondition = $scope.specificInfo.weekCondition || {};
                    var isSelect = false;
                    angular.forEach(weekCondition, function(item, key)
                    {
                        if (item) isSelect = true;
                    });
                    return isSelect;
                }
            },
            daysCondition:
            {
                isSelect: function (modelValue, viewValue)
                {
                    var daysCondition = $scope.specificInfo.daysCondition || {};
                    var isSelect = false;
                    angular.forEach(daysCondition, function(item, key)
                    {
                        if (item.check) isSelect = true;
                    });
                    return isSelect;
                }
            },
        };
        $scope.asyncValidators = 
        {
            scenario_name:
            {
                same: function (modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    if (void 0 === val || val.length === 0) return true;
                    
                    return Scenario.validators.isSameName({id: id, scenario_name: val});
                }
            },
            output_name:
            {
                same: function (modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    if (void 0 === val || val.length === 0) return true;

                    return Scenario.validators.isSameName({id: id, output_name: val});
                }
            }
        };
    }
    
    function getInitializeData()
    {
        var params = {type: $routeParams.scenario};
        var isEdit = void 0 !== id;
        if (isEdit) params.id = id;

        Scenario.resource.initializeData(params).$promise.then(function(response)
        {
            $scope.segmentList = response.segment;
            $scope.ifList = response.ifLayout;
            $scope.scenario = response.target;
            $scope.tagList = response.tagList;
            $scope.selectTagList = response.settinTags;
            if (1 === pageProp.type)
            {
                if (isEdit) editScheduleInitialize(response);
            }
            else if (2 === pageProp.type)
            {
                $scope.actionList =  response.specific;
                if (isEdit)
                {
                    $scope.activeId = response.specificInfo.doc.actionId;
                    editTriggerInitialize(response);
                }
            }
        });
    }
    function editScheduleInitialize(initData)
    {
        $scope.specificInfo.repeat_flag = initData.specificInfo.specific.repeat_flag;
        $scope.specificInfo.expiration_start_date = Utility.formatString(initData.specificInfo.specific.expiration_start_date);
        if (null !== initData.specificInfo.specific.expiration_end_date)
        {
            $scope.specificInfo.expiration_end_date = Utility.formatString(initData.specificInfo.specific.expiration_end_date);
        }

        if (null !== initData.specificInfo.doc)
        {
            $scope.specificInfo.interval = initData.specificInfo.doc.interval;
        
            if (2 === $scope.specificInfo.interval)
            {
               $scope.specificInfo.weekCondition = initData.specificInfo.doc.weekCondition;
            }
            else if (3 === $scope.specificInfo.interval)
            {
               $scope.specificInfo.daysCondition = initData.specificInfo.doc.daysCondition;
            }
        }
    }
    
    function editTriggerInitialize(initData)
    {
        $scope.specificInfo = initData.specificInfo.specific;
        actionId = initData.specificInfo.doc.actionId;

        $scope.isShowExtraction = true;
        var actionLen = initData.specific.length;
        for (var index = 0; index < actionLen; index++)
        {
            if (actionId === initData.specific[index].id)
            {
                $scope.columnList = initData.specific[index].column;
                break;
            }
        }
        angular.forEach(initData.specificInfo.doc.conditionList, function(conditionItems)
        {
            var restoration = [];
            angular.forEach(conditionItems, function(items)
            {
                angular.forEach($scope.columnList, function(info)
                {
                    if (items.physicalname == info.physicalname)
                    {
                        info.condition = items.condition;
                        info.selectedCondition = items.selectedCondition;
                        restoration.push(info);
                        //return false;
                    }
                });
            });
            selectConditionList.push(restoration);
            var condtionString = Scenario.createCondtionString(restoration);
            $scope.decisionList.push(condtionString);
        });
    }
    function setWatchItems()
    {
        $scope.$watch('scenario.scenario_name', function()
        {
            $scope.scenarioForm.scenario_name.$validate();
        });

        $scope.$watch('scenario.output_name', function()
        {
            $scope.scenarioForm.output_name.$validate();
        });

        $scope.$watch('segmentList', function()
        {
            $scope.scenarioForm.segment.$validate();
        },true);
        
        $scope.$watch('ifList', function()
        {
            $scope.scenarioForm.ifLayout.$validate();
        },true);
        
        if (1 === pageProp.type)
        {
            if (null !== $scope.specificInfo.repeat_flag)
            {
                $scope.$watch('specificInfo.expiration_start_date', function()
                {
                    $scope.scenarioForm.expiration_start_date.$validate();
                });
            }
            if (1 === $scope.specificInfo.repeat_flag)
            {
                $scope.$watch('specificInfo.expiration_end_date', function()
                {
                    $scope.scenarioForm.expiration_end_date.$validate();
                });
                $scope.$watch('specificInfo.interval', function()
                {
                    $scope.scenarioForm.interval.$validate();
                });
            }
        }
        
    }
    function setEventListeners()
    {
    }
    
    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();
        getInitializeData();
        setValidation();
        setWatchItems();
        setEventListeners();
    };
    
    $scope.showAction = function(id, col)
    {
        $scope.conditions = [];
        $scope.decisionList = [];
        if (actionId == id)
        {
            $scope.isShowExtraction = !$scope.isShowExtraction;
        }
        else
        {
            $scope.isShowExtraction = true;
            $scope.columnList = col;
            actionId = id;
        }
    };
    
    $scope.addTag = function()
    {
        if (0 >= $scope.inputTag.length) return;
        
        var isAddTag = true;
        angular.forEach($scope.selectTagList, function(tag)
        {
            if ($scope.inputTag === tag.tag_name)
            {
                isAddTag = false;
                return false;
            }
        });
        if (isAddTag)
        {
            $scope.selectTagList.push({tag_name: $scope.inputTag});
            $scope.inputTag = '';
        }
    };
    
    $scope.removeTag = function(index)
    {
        $scope.selectTagList.splice(index, 1);
    };
    
    //---------------------------------
    //trigger
    //---------------------------------
    $scope.moveCondition = function(item)
    {
        var push = {};
        angular.copy(item, push);
        $scope.conditions.push(push);
    };

    $scope.removeItem = function(index)
    {
        $scope.conditions.splice(index, 1);
    };
    
    $scope.decision = function()
    {
        var isDecision = true;
        angular.forEach($scope.conditions, function(condition)
        {
            if (condition.error || '' === condition.condition.value1 || void 0 === condition.condition.value1)
            {
                isDecision = false;
                return false;
            }
        });
        
        if (isDecision)
        {
            selectConditionList.push($scope.conditions);
            var condtionString = Scenario.createCondtionString($scope.conditions);
            $scope.decisionList.push(condtionString);
            $scope.conditions = [];
        }
    };
    
    $scope.removeDecisionList = function(index)
    {
        selectConditionList.splice(index, 1);
        $scope.decisionList.splice(index, 1);
    };

    $scope.clear = function()
    {
        setInitializeScope();
        getInitializeData();
    };
    
    $scope.save = function()
    {
        var doc;
        var tags;
        var specificInfo;
        if (1 === pageProp.type)
        {
            specificInfo = 
            {
                repeat_flag: $scope.specificInfo.repeat_flag,
                expiration_start_date: $scope.specificInfo.expiration_start_date,
                expiration_end_date: $scope.specificInfo.expiration_end_date,
            };
            
            if (1 == $scope.specificInfo.repeat_flag)
            {
                doc = {interval: $scope.specificInfo.interval};
                if (2 === $scope.specificInfo.interval)
                {
                    doc.weekCondition = $scope.specificInfo.weekCondition;
                }
                else if (3 === $scope.specificInfo.interval)
                {
                    doc.daysCondition = $scope.specificInfo.daysCondition;
                }
            }
        }
        else if (2 === pageProp.type)
        {
            //ベータ版のための制御
            if (0 === selectConditionList.length) return false;
            doc = 
            {
                actionId: actionId,
                conditionList: Scenario.getConditionDoc(selectConditionList)
            };
            specificInfo = $scope.specificInfo;
        }
        else
        {
            return false;
        }

        $scope.scenario.scenario_type = pageProp.type;
        Scenario.setActivePushItem($scope.segmentList, 'segment_id', $scope.scenario, 'segment_id');
        Scenario.setActivePushItem($scope.ifList, 'id', $scope.scenario, 'if_layout_id');

        var params = {scenario: $scope.scenario, specificInfo: specificInfo, doc: doc, tags: $scope.selectTagList};

        Scenario.resource.save(params).$promise.then(function(response)
        {
            Utility.info('シナリオを保存しました。');
            if (1 === pageProp.type)
            {
                Location.schedule();
            }
            else if (2 === pageProp.type)
            {
                Location.trigger();
            }
        });
    };
    
    //---------------------------------
    //schedule
    //---------------------------------
    $scope.weekConditionValidation = function()
    {
        $scope.scenarioForm.weekCondition.$validate();
    };
    
    $scope.daysConditionValidation = function()
    {
        $scope.scenarioForm.daysCondition.$validate();
    };

}]);

/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var segmentCtrl = angular.module('segmentCtrl',['SegmentServices']);
segmentCtrl.controller('SegmentCtrl',['$scope', 'Shared', 'Segment', 'Utility',
function ($scope, Shared, Segment, Utility)
{
    /**
     * scope初期化用
     */
    function setInitializeScope()
    {
        Shared.setRoot('segment');
        $scope.segmentList = [];
    }
    
    /**
     * 初期処理
     * @author niikawa
     */
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();

        Segment.resource.get().$promise.then(function(response)
        {
            $scope.segmentList = response.data;
            $scope.showInfo = $scope.segmentList.length > 0 ? true : false; 
        });
    };
    
    $scope.download = function(id)
    {
        Segment.download(id);
    };

    $scope.remove = function(index)
    {
        var target = $scope.segmentList[index];
        Segment.resource.remove(
            {id: target.segment_id, segment_document_id: target.segment_document_id}).$promise.then(function(response)
        {
            Utility.info(target.segment_name+'を削除しました');
            $scope.segmentList.splice(index, 1);
        });
    };
}]);

var segmentControlCtrl = angular.module('segmentControlCtrl',['SegmentServices', 'QueryServices']);
segmentControlCtrl.controller('SegmentControlCtrl',['$scope', '$routeParams', 'Modal','Shared', 'Segment', 'Query', 'Utility','Location',
function ($scope, $routeParams, Modal, Shared, Segment, Query, Utility, Location)
{
    function setInitializeScope()
    {
        $scope.pageTitle = Segment.pageProp($routeParams.id).pageTitle;
        $scope.viewMode = Segment.pageProp($routeParams.id).viewMode;

        $scope.segmenData = {};
        $scope.queryList = [];
        $scope.conditions = [];
        $scope.segmentSearch = '';
        $scope.segment = {};
        $scope.isExecte = false;
    }
    
    $scope.initialize = function()
    {
        $scope._construct();
        setInitializeScope();
        // setEvntListeners();
        Shared.setRoot('segment control');
        
        Query.resource.getQuery().$promise.then(function(doc)
        {
            if (2 === Segment.pageProp($routeParams.id).viewMode)
            {
                Segment.resource.get({id: $routeParams.id}).$promise.then(function(response)
                {
                    $scope.segment.segment_id = $routeParams.id;
                    $scope.segment.segment_name = response.segment_name;
                    $scope.segment.segment_document_id = response.segment_document_id;
                    Segment.setListData(doc.data, response.qIds, $scope.conditions);
                    $scope.queryList = doc.data;
                    Segment.setWhereProp($scope.queryList);
                    Segment.setWhereProp($scope.conditions, response.whereList);
                    $scope.isExecte = true;
                });
            }
            else
            {
                $scope.queryList = doc.data;
                Segment.setWhereProp($scope.queryList);
            }
        });
    };
    
    $scope.moveQuery = function(index)
    {
        $scope.conditions.push($scope.queryList[index]);
        $scope.queryList.splice(index,1);
        $scope.isExecte = true;
    };
    
    $scope.removeItem = function(index)
    {
        $scope.queryList.push($scope.conditions[index]);
        $scope.conditions.splice(index,1);
        if (0 === $scope.conditions.length) $scope.isExecte = false;
    };
    
    $scope.save = function()
    {
        var data = Segment.createExecuteInfo($scope.conditions);
        Segment.resource.executeQuery(data).$promise.then(function(response, err)
        {
            var doc = Segment.createDocData($scope.conditions);
            var docdata = {
                segment_name: $scope.segment.segment_name, 
                segment_document_id: $scope.segment.segment_document_id,
                whereList: doc.whereList, 
                qIds: doc.qIds
            };
            
            Segment.resource.saveDoc({data: docdata}).$promise.then(function(response)
            {
                var data = {
                    segment_id: $scope.segment.segment_id, 
                    segment_name: response.data.segment_name, 
                    segment_document_id:response.data.id
                };
                Segment.resource.save({data: data}).$promise.then(function(response)
                {
                    Utility.info('セグメントを保存しました');
                    Location.segment();
                });
            });
        });
    };

    $scope.execute = function()
    {
        var data = Segment.createExecuteInfo($scope.conditions);
        Segment.resource.executeQuery(data).$promise.then(function(response, err)
        {
            Utility.info('該当データは' + response.result + '件あります');
        });
    };
}]);

/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var userCtrl = angular.module('userCtrl',['UesrServices']);
userCtrl.controller('UserCtrl',['$scope', '$routeParams','Shared', 'User', 'Utility',
function ($scope, $routeParams, Shared, User, Utility)
{
    function setInitializeScope()
    {
        $scope.userList = [];
    }
    
    $scope.initialize = function()
    {
        Shared.setRoot('user');
        $scope._construct();
        setInitializeScope();

        User.resource.get().$promise.then(function(response)
        {
            $scope.userList = response.data;
        });
    };
    
    $scope.remove = function(id)
    {
        User.resource.delete({id: id}).$promise.then(function(response)
        {
            angular.forEach($scope.userList, function(v, k)
            {
                if (v.user_id === id)
                {
                    $scope.userList.splice(k,1);
                }
            });
            Utility.successSticky('ユーザーを削除しました');
        });
        
    };
    
}]);

/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
var userControlCtrl = angular.module('userControlCtrl',['UesrServices','RoleServices']);
userControlCtrl.controller('UserControlCtrl',['$scope', '$routeParams', 'User', 'Role', 'Utility', 'Shared','Location',
function ($scope, $routeParams, User, Role, Utility, Shared, Location)
{
    var pageProp = User.getPageProp($routeParams.id);
    
    function setInitializeScope()
    {
        $scope.user = {};
        $scope.pageTitle = pageProp.title;
        $scope.showPassword = true;
        $scope.passwordEdit = {show: '1'};
        $scope.pageType = pageProp.type;

        if (2 === pageProp.type)
        {
            $scope.passwordEdit.show = '0';
            $scope.showPassword = false;
            var id = parseInt($routeParams.id, 10);
            User.resource.get({id: id}).$promise.then(function(response)
            {
                $scope.user = response.data[0];
                $scope.user.password_confirm = $scope.user.password;
            });
        }
    }
    
    // TODO コントローラーに記載すべきなのか。。。。。
    function setValidation()
    {
        $scope.validators = 
        {
            password:
            {
                // ユーザー名とパスワードは一緒はダメ
                same: function (modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    var user = $scope.user || {};
    
                    return val != user.name;
                }
            },
            password_confirm:
            {
                // パスワード確認
                confirm: function (modelValue, viewValue)
                {
                    var user = $scope.user || {};
                    var val = modelValue || viewValue;
    
                    return val == user.password;
                }
            },
            selected_role:
            {
                // ロール選択
                role: function (modelValue, viewValue)
                {
                    var roleList = $scope.roleList || {};
                    var isSelect = false;
                    angular.forEach(roleList, function(item, key)
                    {
                        if (item.isPush) isSelect = true;
                    });
                    return isSelect;
                }
            },
        };
        $scope.asyncValidators = 
        {
            mailaddress:
            {
                same: function (modelValue, viewValue)
                {
                    var val = modelValue || viewValue;
                    if (void 0 === val || val.length === 0) return true;
                    
                    return User.validators.isSameMailAddress($scope.user.user_id, val);
                }
            }
        };
    }
    
    function setRole(items)
    {
        angular.forEach(items, function(item, key)
        {
            if (item.isPush)
            {
                $scope.user.role_id = item.role_id;
            }
        });
    }
    
    $scope.initialize = function()
    {
        Shared.setRoot('user control');
        $scope._construct();
        setInitializeScope();
        setValidation();

        Role.resource.get().$promise.then(function(response)
        {
            $scope.roleList = response.data;
        });
        
        if (1 === $scope.passwordEdit)
        {
            // user_name != password判定のため
            $scope.$watch('user.name', function()
            {
                $scope.userForm.password.$validate();
            });
     
            // password == password_confirm判定のため
            $scope.$watch('user.password', function()
            {
                $scope.userForm.password_confirm.$validate();
            });
        }
    
        $scope.$watch('roleList', function()
        {
            $scope.userForm.selected_role.$validate();
        },true);
    };
    
    /**
     * 登録/更新
     */
    $scope.save = function()
    {
        setRole($scope.roleList);
        
        var message = $scope.user.name + 'さんの情報を保存しました';
        if (2 === pageProp.type)
        {
            Utility.deleteCommonInfo($scope.user);
            if ('1' !== $scope.passwordEdit.show)
            {
                delete $scope.user.password_confirm;
                delete $scope.user.password;
            }
            User.resource.save({id: $scope.user.user_id, data: $scope.user}).$promise.then(function(response)
            {
                Utility.successSticky(message);
                Location.user();
            });
        }
        else
        {
            User.resource.create({data: $scope.user}).$promise.then(function(response)
            {
                Utility.successSticky(message);
                Location.user();
            });
        }
    };
    
    $scope.isSameMailAddress = function()
    {
        $scope.userForm.mailaddress.$validate();
    };

}]);
