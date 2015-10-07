/**
 * 共通サービス
 * 
 * @author niikawa
 */
var utilsServices = angular.module("myApp");
utilsServices.service("Utility", ['$rootScope', function($rootScope)
{
    //--------------------------------------------------------------------------
    //共通項目除去
    //--------------------------------------------------------------------------
    this.deleteCommonInfo = function(param)
    {
        if (angular.isArray(param))
        {
            angular.forEach(param, function(data, k)
            {
                if (data.hasOwnProperty('delete_flag')) delete data.delete_flag;
                if (data.hasOwnProperty('create_by')) delete data.create_by;
                if (data.hasOwnProperty('create_date')) delete data.create_date;
                if (data.hasOwnProperty('update_by')) delete data.update_by;
                if (data.hasOwnProperty('update_date')) delete data.update_date;
            });
        }
        else
        {
            if (param.hasOwnProperty('delete_flag')) delete param.delete_flag;
            if (param.hasOwnProperty('create_by')) delete param.create_by;
            if (param.hasOwnProperty('create_date')) delete param.create_date;
            if (param.hasOwnProperty('update_by')) delete param.update_by;
            if (param.hasOwnProperty('update_date')) delete param.update_date;
        }
    };
    
    //--------------------------------------------------------------------------
    //メッセージアラート
    //stickyの場合は自動で消えない
    //--------------------------------------------------------------------------
    this.info = function(message, position)
    {
        position = position == null ? 'top-center' : position;
        $().toastmessage('showToast', {
            text     : message,
            sticky   : false,
            position : position,
            type     : 'notice'
        });
    };
    
    this.infoSticky = function(message, position) {
        position = position == null ? 'top-center' : position;
        $().toastmessage('showToast', {
            text     : message,
            sticky   : true,
            position : position,
            type     : 'notice'
        });
    };
    
    this.warning = function(message, position) {
        position = position == null ? 'top-center' : position;
        $().toastmessage('showToast', {
            text     : message,
            sticky   : false,
            position : position,
            type     : 'warning'
        });
    };

    this.warningSticky = function(message, position) {
        position = position == null ? 'top-center' : position;            
        $().toastmessage('showToast', {
            text     : message,
            sticky   : true,
            position : position,
            type     : 'warning'
        });
    };
    
    this.error = function(message, position) {
        position = position == null ? 'top-center' : position;            
        var dispMessage = (message.trim().length === 0) ? '通信エラー' : message;
        $().toastmessage('showToast', {
            text     : dispMessage,
            sticky   : false,
            position : position,
            type     : 'error'
        });
    };

    this.errorSticky = function(message, position) {
        position = position == null ? 'top-center' : position;
        var dispMessage = (message.trim().length === 0) ? '通信エラー' : message;
        $().toastmessage('showToast', {
            text     : dispMessage,
            sticky   : true,
            position : position,
            type     : 'error'
        });
    };
    
    this.success = function(message, position) {
        position = position == null ? 'top-center' : position;            
        $().toastmessage('showToast', {
            text     : message,
            sticky   : false,
            position : position,
            type     : 'success'
        });
    };        

    this.successSticky = function(message, position) {
        position = position == null ? 'top-center' : position;
        $().toastmessage('showToast', {
            text     : message,
            sticky   : true,
            position : position,
            type     : 'success'
        });
    };
    
    //--------------------------------------------------------------------------
    //日付
    //本アプリケーションは日付に関してmoment.jsに依存させるため必ず読み込むこと
    //http://momentjs.com/
    //--------------------------------------------------------------------------
    //momentオブジェクトを取得する
    this.momentDefault = function() {
        return moment();
    };
    this.moment = function(d) {
        return moment(d);
    };
    //本日の日付けを文字列で取得する
    this.today = function(format) {
        var formatString = (null == format) ? 'YYYY-MM-DD' : format;
        return this.moment().format(formatString);
    };
    //指定したフォーマットでパラメータの日付を文字列で取得する
    this.formatString = function(d,format) {
        var formatString = (null == format) ? 'YYYY-MM-DD' : format;
        return this.moment(d).format(formatString);
    };
    
    //指定した年月の持つ最終日を取得する
    this.dayInMonth = function(a) {
        return moment(a).daysInMonth();
    };
    //aがbより未来かを判定する
    this.isAfter = function(a, b) {
        return moment(a).isAfter(moment(b));
    };
    this.getMomemtObject = function(date) {
        return moment(date);
    };
    //
    // add
    //
    this.addDay = function(a, b) {

        return moment(a).add(b, 'day');
    };
    this.addMonth = function(a, b) {

        return moment(a).add(b, 'month');
    };
    this.addYear = function(a, b) {

        return moment(a).add(b, 'year');
    };
    //
    // subtract
    //
    this.subtractDay = function(a, b) {
        
        return moment(a).subtract('day', b);
    };
    
    this.subtractMonth = function(a, b) {
        
        return moment(a).subtract('month', b);
    };
    this.subtractYear = function(a, b) {
        
        return moment(a).subtract('year', b);
    };
    //
    // diff
    //
    this.diffDay = function(a, b) {
        
        return moment(a).diff(moment(b), 'day');
    };

    this.diffMonth = function(a, b) {
        
        return moment(a).diff(moment(b), 'month');
    };

    this.diffYear = function(a, b) {
        
        return moment(a).diff(moment(b), 'year');
    };

    this.createDayList = function(maxDay) {
        
        var dayList = [];
        for (var index=1; index <= maxDay; index++) {
            var day = ('00' + index).slice(-2);
            dayList.push({value:day, text:day});
        }
        return dayList;
    };
    
    this.createMonthList = function() {
        var monthList = [];
        for (var index=1; index < 12; index++) {
            var month = ('00' + index).slice(-2);
            monthList.push({value:month, text:month});
        }
        return monthList;
    };
    
    this.createYearList = function(min, max) {
        
        var yearList = [];
        for (var year= min; year <= max; year++) {
            yearList.push({value:String(year), text:year});
        }
        return yearList;
    };
    
    this.setSpinner = function(bool)
    {
        if (bool)
        {
            $rootScope.$broadcast('requestStart');
        }
        else
        {
            $rootScope.$broadcast('requestEnd');
        }
    };
    
    this.isDateValid = function(target, delimiter)
    {
        if (null === target) return false;
        if (void 0 === delimiter) delimiter = '-';
        var days = target.split(delimiter);
        if (3 !== days.length) return false;
        
        var m = this.moment(target);
        return m.isValid();
    };
    
    this.confirmAlert = function(execute)
    {
        swal({
            title: "削除してもよろしいですか？",
            type: "warning",
            allowOutsideClick: true,
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "削除する",
            cancelButtonText:"キャンセル",
            closeOnConfirm: true,
            html: false
        }, function() {
            execute();
        });
    };
    this.infoAlert = function(params)
    {
        swal({
            title: params.title,
            text: params.text,
            type: "info",
            allowOutsideClick: true,
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: params.confirmButtonText,
            cancelButtonText:"閉じる",
            closeOnConfirm: true,
            html: true
        }, function() {
            params.execute();
        });
    };
}]);
var sharedServices = angular.module("myApp");
sharedServices.service('Shared', function()
{
    var sharedServices = {};
    var data = {};
    
    sharedServices.set = function(name, value)
    {
        data[name] = value;
    };
    
    sharedServices.setRoot = function(value)
    {
        if (!data.hasOwnProperty('applicationAccsessRoot'))
        {
            data['applicationAccsessRoot'] = [];
        }
        data['applicationAccsessRoot'].push(value);
    };
    sharedServices.getRoot = function(value)
    {
        return data['applicationAccsessRoot'];
    };
    
    sharedServices.get = function(name) {
        return data[name];
    };
    
    sharedServices.destloyByName = function(name)
    {
        delete data[name];
    };

    sharedServices.destloy = function()
    {
        data = [];
    };

    return sharedServices;
});

var authServices = angular.module("AuthServices", ["ngResource", "ngCookies"]);
authServices.factory("Auth", ['$resource', '$http', '$location', '$cookies','Utility', 'Shared',
    function($resource, $http, $location, $cookies, Utility, Shared)
    {
        var authServices = {};
        
        authServices.login = function(data)
        {
            var promise = $http.post('/auth/login', {mailAddress: data.mailAddress, password: data.password
            }).success(function(response, status, headers, config)
            {
                if (data.remember) {
                    //クッキーに入れる
                    $cookies.remembertkn = data.remembertkn;
                }
                Shared.set('id', response.data[0].user_id);
                Shared.set('userName', response.data[0].name);
                Shared.set('role', response.data[0].role_id);
            });
            return promise;
        };
        
        authServices.setLoginStatus = function(id)
        {
            var promise = $http.post('api/setStatus', {'id': id
            }).success(function(data, status, headers, config)
            {
                $location.path('/');
            }
            ).error(function(data)
            {
                Utility.errorSticky(data);
            });
            return promise;
        };
        
        authServices.isLogin = function()
        {
            var promise = $http.post('api/isLogin', {
            }).success(function(data, status, headers, config)
            {
                return true;
            }
            ).error(function(data)
            {
                Utility.errorSticky(data);
            });
            return promise;
        };
        
        authServices.logout = function()
        {
            var promise = $http.post('auth/logout', {
            }).success(function(data, status, headers, config)
            {
                $location.path('/login');
            }
            ).error(function(data)
            {
                Utility.errorSticky(data);
            });
            return promise;
        };
        
        return authServices;
    }
]);

//自動ログイン機能を追加時に正式に実装する
authServices.factory("AutoAuth", ['$window', '$http', '$q',
    function($window, $http, $q) {
        var deferred = $q.defer();
        //クッキーからトークンを取得
        $http.post('api/auth', {}
        ).success(function(data){
            
            return deferred.promise;
            
        }).error(function(data) {
            $window.location.href = "https://"+location.host;
        });
    }
]);
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
        return {open: open};
    }]
);
var mailServices = angular.module("myApp");
mailServices.service("Mail", ['$resource',
    function($resource) 
    {
        var mailServices = {};
        
        mailServices.resource = $resource('https://api-gozaru9.c9.io/V1/mail/:site/', {site: '@site'});

        return mailServices;
    }
]);
angular.module('myApp').factory('d3Service', function () {
  return {d3: d3};
});

/**
 * 共通サービス
 * 
 * @author niikawa
 */
var locationServices = angular.module("myApp");
locationServices.service("Location", ['$location',function($location)
{
    var locationServices = {};
    
    locationServices.home = function()
    {
        $location.path('/');
    };
    
    locationServices.user = function()
    {
        $location.path('/user');
    };

    locationServices.query = function()
    {
        $location.path('/query');
    };

    locationServices.query = function()
    {
        $location.path('/query/list');
    };

    locationServices.querySet = function()
    {
        $location.path('/query/set');
    };

    locationServices.querySave = function()
    {
        $location.path('/query/save');
    };

    locationServices.segment = function()
    {
        $location.path('/segment');
    };

    locationServices.segmentControl = function(id)
    {
        $location.path('/segment/control/'+id);
    };

    locationServices.trigger = function()
    {
        $location.path('/scenario/trigger');
    };

    locationServices.schedule = function()
    {
        $location.path('/scenario/schedule');
    };

    return locationServices;

}]);
/**
 * アプリケーション固有の通信を伴言わない処理を記述するサービスクラス
 **/
var mainServices = angular.module("myApp");
mainServices.service("Main", function()
{
    var mainService = {};
    
    mainService.getUserIdFromList = function(list, parent, child)
    {
        return list[parent].my._id;
    };
    
    mainService.getTaskIdFromList = function(list, parent, child)
    {
        return list[parent].taskList[child]._id;
    };

    mainService.removeTaskByIndex = function(list, parent, child)
    {
        list[parent].taskList.splice(child, 1);
    };

    mainService.getProgressFromList = function(list, parent, child)
    {
        return list[parent].taskList[child].progress;
    };

    mainService.getContentsFromList = function(list, parent, child)
    {
        return list[parent].taskList[child].contents;
    };


    return mainService;

});
var customerServices = angular.module("CustomerServices", ["ngResource"]);
customerServices.factory("Customer", ['$resource','Utility',
    function($resource, Utility) 
    {
        var customerServices = {};
        
        customerServices.resource = $resource('/customer/:id/', {id: '@id'},
        {
            detail:
            {
                method: 'GET',
                url: 'custmoer/detail/:id',
                cache: true,
            },
            orders:
            {
                method: 'GET',
                url: 'custmoer/orders/:id',
                cache: true,
            }
        });

        return customerServices;
    }
]);
var scenarioServices = angular.module("ScenarioServices", ["ngResource"]);
scenarioServices.factory("Scenario", ['$resource','$http','$q','Utility',
    function($resource, $http, $q, Utility) 
    {
        var scenarioServices = {};

        var pageProp = {
                schedule: {type: 1, mode: 0, title: 'スケジュール型', addTitle: '', template: 'views/scenario/schedule.html'}, 
                trigger: {type: 2, mode: 0, title: 'トリガー型', addTitle: '', template: 'views/scenario/trigger.html'}
        };
        scenarioServices.daysCondition = function()
        {
            var data = [];
            var num = 31;
            for (var index = 1; index <= num ; index++)
            {
                data.push({name: index, check:false});
            }
            data.push({name: '最終日', check:false});
            return data;
        };

        scenarioServices.resource = $resource('/scenario/:type/:id/', {id: '@id'},
        {
            list:
            {
                method: 'GET',
                url: 'scenario/list/:id',
                cache: true,
            },
            initializeData:
            {
                method: 'GET',
                url: 'scenario/initialize/:type/:id',
            },
            action:
            {
                method: 'GET',
                url: 'action/:name',
                cache: true,
            },
            save:
            {
                method: 'POST',
                url: 'scenario/save',
            },
            remove:
            {
                method: 'DELETE',
                url: 'scenario/:type/remove/:id',
            },
            valid:
            {
                method: 'GET',
                url: 'scenario/valid',
            },
            priority:
            {
                method: 'POST',
                url: 'scenario/priority',
            },
            typeCount:
            {
                method: 'GET',
                url: 'scenario/typecount',
            },
            executeplan:
            {
                method: 'GET',
                url: 'scenario/execute/plan',
            },
            bulkInvalid:
            {
                method: 'GET',
                url: 'scenario/bulkInvalid',
            },
            bulkEnable:
            {
                method: 'GET',
                url: 'scenario/bulkEnable',
            },
        });
        
        scenarioServices.getPageProp = function(type, id)
        {
            var target = pageProp[type];
            target.addTitle = (void 0 === id) ? '登録' : '更新';
            target.mode = (void 0 === id) ? 1 : 2;
            
            return target;
        };
        
        scenarioServices.validators =
        {
            isSameName : function(parameters)
            {
                return $http.post('scenario/name/', parameters
                ).then(function(response)
                {
                    if (response.data.result.count > 0)
                    {
                        return $q.reject('exists');
                    }
                    return false;
                });
            },
        };
        
        scenarioServices.setActivePushItem = function(items, propertie, bindObj, bindProp)
        {
            angular.forEach(items, function(item, key)
            {
                if (item.isPush)
                {
                    bindObj[bindProp] = item[propertie];
                    return false;
                }
            });
        };
        
        scenarioServices.createCondtionString = function(list)
        {
            var condition = '';
            var last = list.length - 1;
            angular.forEach(list, function(item, key)
            {
                condition += item.logicalname + 'が[' + item.condition.value1;
                if ('' !== item.condition.value2)
                {
                    condition += ',' + item.condition.value2;
                }
                condition += ']' + item.selectedCondition.name;
                
                if (key !== last)
                {
                    condition += ('AND' === item.condition.where) ? ' かつ ' : ' または ';
                }
            });
            return condition;
        };
        
        scenarioServices.getConditionDoc = function(list)
        {
            var doc = [];
            angular.forEach(list, function(items, key)
            {
                var push = [];
                angular.forEach(items, function(item, key)
                {
                    push.push(
                    {
                        physicalname: item.physicalname,
                        condition: item.condition,
                        selectedCondition: item.selectedCondition
                    });
                });
                doc.push(push);
            });
            return doc;
        };
        
        return scenarioServices;
    }
]);
var segmentServices = angular.module("SegmentServices", ["ngResource"]);
segmentServices.factory("Segment", ['$resource', '$http','Utility',
    function($resource, $http, Utility) 
    {
        var segmentServices = {};
        
        segmentServices.resource = $resource('/segment/:id/', {id: '@id'},
        {
            getDoc:
            {
                method: 'GET',
                url: 'segment/getdoc',
            },
            saveDoc:
            {
                method: 'POST',
                url: 'segment/savedoc',
            },
            save:
            {
                method: 'POST',
                url: 'segment/save',
            },
            download:
            {
                method: 'GET',
                url: 'segment/:id/download',
            },
            remove:
            {
                method: 'DELETE',
                url: 'segment/remove/:id/:segment_document_id',
            },
            executeQuery:
            {
                method: 'POST',
                url: 'segment/execute',
            },
            useSegment:
            {
                method: 'POST',
                url: '/segment/query/use',
            }
        });

        segmentServices.pageProp = function(id)
        {
            if (void 0 === id)
            {
                return {
                    viewMode: 1,
                    pageTitle: '登録'
                };
            }
            else
            {
                return {
                    viewMode: 2,
                    pageTitle: '更新'
                };
            }
        };
        
        segmentServices.setWhereProp = function(list, initializeData)
        {
            if (void 0 === initializeData)
            {
                angular.forEach(list, function(v, k)
                {
                    v.where = 'AND';
                });
            }
            else
            {
                angular.forEach(list, function(v, k)
                {
                    var value = (null === initializeData[k]) ? 'AND' : initializeData[k];
                    v.where = value;
                });
            }
        };
        
        segmentServices.setListData = function(queryList, queryIdList, conditionList)
        {
            angular.forEach(queryIdList, function(qid, k1)
            {
                angular.forEach(queryList, function(query, k2)
                {
                    if (qid == query.id)
                    {
                        conditionList.push(query);
                        queryList.splice(k2, 1);
                    }
                });
            });
        };
        
        segmentServices.createExecuteInfo = function(list)
        {
            var qIds = [];
            var where = {};
            var tables = {};
            
            angular.forEach(list, function(v, k)
            {
                qIds.push(v.id);
                where[v.id] = v.where;
                Object.keys(v.tables).forEach(function(key)
                {
                    if (!tables.hasOwnProperty(key))
                    {
                        tables[key] = key;
                    }
                });
            });
            return {qIds: qIds, tables: tables, conditionMap: where};
        };
        
        segmentServices.createSQL = function(list)
        {
            var sql = '';
            var last = list.length -1;
            angular.forEach(list, function(v, k)
            {
                sql += '(' + v.sql + ') ' ;
                if (last !== k) sql += v.where;
            });
            return sql;
        };
        
        segmentServices.getTables = function(list)
        {
            var tables = {};
            angular.forEach(list, function(v, k)
            {
                Object.keys(v.tables).forEach(function(key)
                {
                    if (!tables.hasOwnProperty(key))
                    {
                        tables[key] = key;
                    }
                });
            });
            
            return tables;
        };
        
        segmentServices.createDocData = function(list)
        {
            var sql = '';
            var last = list.length -1;
            var ids = [];
            var where = [];
            angular.forEach(list, function(v, k)
            {
                sql += '(' + v.sql + ') ' ;
                if (last !== k) sql += v.where;
                ids.push(v.id);
                where.push(v.where);
            });
            
            return {condition: sql, qIds: ids, whereList: where};
        };
   
        return segmentServices;
    }
]);
var queryServices = angular.module("QueryServices", ["ngResource"]);
queryServices.factory("Query", ['$resource', '$http','Shared',
    function($resource, $http, Shared)
    {
        var queryServices = {};
        
        queryServices.sql = '';
        
        queryServices.resource = $resource('/query', {id: '@id'},
        {
            getQuery:
            {
                method: 'GET',
                url: '/query/get',
            },
            getList:
            {
                method: 'GET',
                url: '/query/list',
            },
            getControlInit:
            {
                method: 'GET',
                url: '/query/control/:id',
            },
            create:
            {
                method: 'POST',
                url: '/query/create',
            },
            remove:
            {
                method: 'DELETE',
                url: '/query/:id',
            },
            getUseSegment:
            {
                method: 'GET',
                url: '/query/use/segment/:id',
            },
            executeQuery:
            {
                method: 'POST',
                url: '/query/execute',
            },
        });

        queryServices.getContentsByColumsType = function(type)
        {
            var countents = {inputType:'', };
            console.log(type);
            if ('INT' === type)
            {
                countents.inputType = 'number';
            }
            else if ('VARCHAR' === type)
            {
                countents.inputType = 'text';
            }
            else if ('DATETIME' === type)
            {
                countents.inputType = 'date';
            }
            return countents.inputType;
        };
        
        queryServices.createCondtionString = function(list)
        {
            angular.forEach(list, function(v, k)
            {
                if (void 0 === v.condition.value2 || '' === v.condition.value2)
                {
                    v.selectedCondition.condtionString = 
                        v.condition.value1 +''+ v.selectedCondition.name;
                }
                else
                {
                    v.selectedCondition.condtionString = 
                        v.condition.value1 +'から'+ v.condition.value2 + v.selectedCondition.name;
                }
            });
        };

        queryServices.getTables = function(list)
        {
            var tables = {};
            angular.forEach(list, function(v, k)
            {
                if (void 0 === tables[v.table.physicalname])
                {
                    tables[v.table.physicalname] = [];
                }
                var info = 
                {
                    column: v.column.physicalname,
                    conditionType: v.selectedCondition.value,
                    values: v.condition
                };
                tables[v.table.physicalname].push(info);
            });
            return tables;
        };
        
        queryServices.getRefTabels = function(tables)
        {
            var tableList = [];
            angular.forEach(tables, function(table)
            {
                tableList.push(table);
            });
            return tableList;
        };
        
        queryServices.getReturnURL = function()
        {
            var root = Shared.getRoot();
            var num = root.length;
            var before = root[root.length-1];
            var url = '';
            if ('query list' === before)
            {
                url = '/query/list';
            }
            else if ('query list' === before)
            {
                url = '/segment/control';
            }
            else
            {
                for (num; 0 < num; num--)
                {
                    if ('query list' === root[num])
                    {
                        url = '/query/list';
                        break;
                    }
                    else if ('segment control' === root[num])
                    {
                        url = '/segment/control';
                        break;
                    }
                }
            }
            return url;
        };

        return queryServices;
    }
]);
var approachServices = angular.module("ApproachServices", ["ngResource"]);
approachServices.factory("Approach", ['$resource','Utility',
    function($resource, Utility) 
    {
        var approachServices = {};
        
        approachServices.resource = $resource('/approach/');
        
        approachServices.pageProp = function(id)
        {
            
            if (void 0 === id)
            {
                return {
                    viewMode: 1,
                    pageTitle: '登録'
                };
            }
            else
            {
                return {
                    viewMode: 2,
                    pageTitle: '更新'
                };
            }
        };

        approachServices.getInfomation = function(id)
        {
            var info = {};
            if (1 === id)
            {
                info.title = '1日の制限回数について';
                info.message = '対象の顧客に対して1日に抽出対象とする回数になります。<br>複数のシナリオで抽出対象となる顧客の場合この回数以上は抽出されなくなります。';
            }
            else if (2 === id)
            {
                info.title = '1週間の制限回数について';
                info.message = '対象の顧客に対して1週間に抽出対象とする回数';
            }
            return info;
        };
        
        return approachServices;
    }
]);
var uesrServices = angular.module("UesrServices", ["ngResource"]);
uesrServices.factory("User", ['$resource','$http','$q','Utility',
    function($resource, $http, $q, Utility)
    {
        var userService = {};
        
        var pageProp = {
                regist: {type: 1, title: 'ユーザー登録'}, 
                edit: {type: 2, title: 'ユーザー更新'}
            };
        
        userService.resource = $resource('/user/:id', {id: '@id'},
        {
            create:
            {
                method: 'POST',
                url: 'user/create',
            },
            remove:
            {
                method: 'GET',
                url: 'user/delete',
            },
        });
        
        userService.validators = 
        {
            isSameMailAddress : function(userId, mailaddress)
            {
                return $http.post('user/mail/',{user_id: userId, mailaddress: mailaddress}
                ).then(function(response)
                {
                    if (response.data.result.count > 0)
                    {
                        return $q.reject('exists');
                    }
                    return false;
                });
            }
        };
        
        //生年月日を生成
        userService.createBirth = function (year, month, day)
        {
            if ('' !== year && '' !== month && '' !== day ) {
                
                return year + '-' + month + '-' + day;
            }
            return '';
        };
        
        //都道府県を取得
        userService.getPrefectures = function()
        {
            return [
                {value:'01', text:'北海道'},{value:'02', text:'青森'}, {value:'03', text:'岩手'},
                {value:'04', text:'宮城'},{value:'05', text:'秋田'}, {value:'06', text:'山形'},
                {value:'07', text:'福島'},{value:'08', text:'茨城'}, {value:'09', text:'栃木'},
                {value:'10', text:'群馬'},{value:'11', text:'埼玉'}, {value:'12', text:'千葉'},
                {value:'13', text:'東京'},{value:'14', text:'神奈川'}, {value:'15', text:'新潟'},
                {value:'16', text:'富山'},{value:'17', text:'石川'}, {value:'18', text:'福井'},
                {value:'19', text:'山梨'},{value:'20', text:'長野'}, {value:'21', text:'岐阜'},
                {value:'22', text:'静岡'},{value:'23', text:'愛知'}, {value:'24', text:'三重'},
                {value:'25', text:'滋賀'},{value:'26', text:'京都'}, {value:'27', text:'大阪'},
                {value:'28', text:'兵庫'},{value:'29', text:'奈良'}, {value:'30', text:'和歌山'},
                {value:'31', text:'鳥取'},{value:'32', text:'島根'}, {value:'33', text:'岡山'},
                {value:'34', text:'広島'},{value:'35', text:'山口'}, {value:'36', text:'徳島'},
                {value:'37', text:'香川'},{value:'38', text:'愛媛'}, {value:'39', text:'高知'},
                {value:'40', text:'福岡'},{value:'41', text:'佐賀'}, {value:'42', text:'長崎'},
                {value:'43', text:'熊本'},{value:'44', text:'大分'}, {value:'45', text:'宮崎'},
                {value:'46', text:'鹿児島'},{value:'47', text:'沖縄'},
            ];
        };
        
        userService.getPageProp = function(id)
        {
            if (void 0 === id)
            {
                return pageProp.regist;
            }
            else
            {
                return pageProp.edit;
            }
            
        };
        
        userService.getSelectedUserIdAndML = function(list, name)
        {
            var selectedList = [];
            var num = list.length;
            for (var i = 0; i < num; i ++)
            {
                if (list[i][name])
                {
                   selectedList.push({_id: list[i]._id, mailAddress:list[i].mailAddress}); 
                }
            }
            return selectedList;
        };

        return userService;        
    }
]);
var roleServices = angular.module("RoleServices", ["ngResource"]);
roleServices.factory("Role", ['$resource','Utility',
    function($resource, Utility) 
    {
        var roleServices = {};
        
        roleServices.resource = $resource('/role/:id', {id: '@id'}, {});

        return roleServices;
    }
]);
var accessServices = angular.module("AccessServices", ["ngResource"]);
accessServices.factory("Access", ['$resource','Utility',
    function($resource, Utility) 
    {
        var accessServices = {};
        
        accessServices.resource = $resource('/access/', {}, 
        {
            day: 
            {
                method:"POST",
                url: "/access"
            },
            dayByUser: 
            {
                method:"POST",
                url: "/access/user"
            }
        });
        return accessServices;
    }
]);
var bugServices = angular.module("BugServices", ["ngResource"]);
bugServices.factory("Bug", ['$resource','Utility', 'Upload',
    function($resource, Utility, Upload) 
    {
        var bugServices = {};
        
        bugServices.categoryList = 
        [
            {name: 'ダッシュボード', type: 1},
            {name: 'トリガーシナリオ管理', type: 2},
            {name: 'スケジュールシナリオ管理', type: 3},
            {name: 'セグメント管理', type: 4},
            {name: 'クエリー管理', type: 5},
            {name: 'アプローチ管理', type: 6},
            {name: 'ユーザー管理', type: 7},
            {name: '操作履歴', type: 8},
            {name: 'その他', type: 99},
        ];

        bugServices.resource = $resource('/bug/', {}, 
        {
            getByConditon:
            {
                method:"POST",
                url: "/bug"
            },
            resolve:
            {
                method:"GET",
                url: "/bug/resolve/:id"
            },
            save: 
            {
                method:"POST",
                url: "/bug/save"
            },
            saveComment: 
            {
                method:"POST",
                url: "/bug/save/comment"
            },
            getComment: 
            {
                method:"GET",
                url: "/bug/comment/:id"
            },
            vote:
            {
                method:"GET",
                url: "/bug/vote/:id"
            },
            download:
            {
                method:"GET",
                url: "/bug/download/:id"
            },
        });
        
        bugServices.commentSaveAndUpload = function(file, parameter, callback)
        {
            Upload.upload(
            {
                "url":"/bug/save/comment/upload/",
                file: file,
                data: {data: parameter},
            }).success(function(result, status, headers, config)
            {
                callback(null);
                
            }).error(function()
            {
                callback("通信エラー");
            });
        };
        
        bugServices.saveAndUpload = function(file, parameter, callback)
        {
            Upload.upload(
            {
                "url":"/bug/save/upload/",
                file: file,
                data: {data: parameter},
            }).success(function(result, status, headers, config)
            {
                callback(null);
                
            }).error(function()
            {
                callback("通信エラー");
            });
        };
        
        bugServices.addViewInfo = function(list)
        {
            angular.forEach(list, function(item)
            {
                switch (item.category)
                {
                    case 1:
                        item.category_name = 'ダッシュボード';
                        break;
                    case 2:
                        item.category_name = 'トリガーシナリオ管理';
                        break;
                    case 3:
                        item.category_name = 'スケジュールシナリオ管理';
                        break;
                    case 4:
                        item.category_name = 'セグメント管理';
                        break;
                    case 5:
                        item.category_name = 'クエリー管理';
                        break;
                    case 6:
                        item.category_name = 'アプローチ管理';
                        break;
                    case 7:
                        item.category_name = 'ユーザー管理';
                        break;
                    case 8:
                        item.category_name = '操作履歴';
                        break;
                    default:
                        item.category_name = 'その他';
                }
                item.type_name = (1 === item.type) ? '要望' : 'バグ';
                item.resolve_name = (1 === item.resolve) ? '解決' : '未解決';
            });
        };

        return bugServices;
    }
]);
var azureServices = angular.module("AzureServices", ["ngResource"]);
azureServices.factory("Azure", ['$resource', '$http','Shared',
    function($resource, $http, Shared)
    {
        var azureServices = {};
        
        azureServices.resource = $resource('/customer/:id/', {id: '@id'},
        {
            recomender:
            {
                method: 'GET',
                url: '/azure/recomender/:id',
            },
        });

        return azureServices;
    }
]);
var myApp = angular.module('myApp');
myApp.controller('HeadCtrl',['$scope', 'Auth', 'Modal', 'Shared', 'Mail', function ($scope, Auth, Modal, Shared, Mail)
{
    $scope.initialize = function()
    {
        if (1 == Shared.get("role"))
        {
            $scope.isShowUser = true;
        }
        else
        {
            $scope.isShowUser = false;
        }
    };
    
    $scope.addMenber = function()
    {
        $scope.modalParam = 
        {
            mailaddress:'',
            execute: sendMail,
        };
        $scope.modalInstance = Modal.open($scope, "partials/memberAdd.html");
    };
    
    $scope.logout = function()
    {
        Shared.destloy();
        Auth.logout().then(function()
        {
            $('#view').addClass('view-animate-container-wide');
            $('#view').removeClass('view-animate-container');
            $scope.$emit('logoutConplete');
        });
    };
    
    var sendMail = function()
    {
        Mail.resource.save({site: 'niikawa'}).$promise.then(function()
        {
            $scope.modalInstance.close();
        });
    };
}]);

myApp.directive('myHeader', function(){
    return {
        restrict: 'E',
        replace: true,
        controller: 'HeadCtrl',
        templateUrl: 'partials/common/header.html',
        link: function (scope, element, attrs, ctrl) 
        {
            scope.isOpenMenu = true;
            $('#view').removeClass('view-animate-container-wide');
            $('#view').addClass('view-animate-container');

            scope.openClose = function()
            {
                scope.isOpenMenu = !scope.isOpenMenu;
                if (scope.isOpenMenu)
                {
                    $('#view').removeClass('view-animate-container-wide');
                    $('#view').addClass('view-animate-container');
                }
                else
                {
                    $('#view').removeClass('view-animate-container');
                    $('#view').addClass('view-animate-container-wide');
                }
            };
            
        }
    };
});


/**
 * オートコンプリートディレクティブ
 * 
 * [属性]
 * selectedItem : コントローラー側と選択した値のバインド用
 * itemList     : リスト表示用のデータ
 * 
 * [使用方法]
 * <auto-complete-directive item-list="trackerList" selected-item="ticketModel.tracker" ></auto-complete-directive>
 * 
 * @module autoCompleteDirective
 * @author niikawa
 */
var myApp = angular.module('myApp');
myApp.directive('autoCompleteDirective', function()
{
    return {
        restrict: 'E',
        scope: {selectedItem: '=', itemList: '=', execute: '&', namePropertie: '@', appendString: '@', showLabel: '=', selectByList: '=', selectName: '='},
        template:   '<form class="navbar-form navbar-left"><input ng-show="!isLabel" class="form-control d-complete-input" ng-model="selectName">' +
                    '<span ng-show="isLabel && selectName.length != 0" ng-click="changeElement()">{{appendString}}{{selectName}}</span>' +
                    '<ul class="complete-list" ng-show="isFocus">' +
                    '<li ng-repeat="item in itemList" ng-click="click($event, item)" >' +
                    '{{item[namePropertie]}}' +
                    '</li>' +
                    '</ul></form>',
        replace: true,
        link: function (scope, element, attrs) 
        {
            scope.selectName = '';
            scope.isFocus = false;
            scope.isLabel = false;
            var originList = [];
            scope.$watch('itemList', function(newValue, oldValue)
            {
                if (void 0 !== newValue && void 0 !== oldValue)
                {
                    console.log('watch itemList');
                    if (newValue.length === oldValue.length)
                    {
                        return false;
                    }
                    if (newValue.length > oldValue.length)
                    {
                        originList = angular.copy(newValue);
                    }
                    else if (newValue.length < oldValue.length)
                    {
                        originList = angular.copy(oldValue);
                    }
                }
                else
                {
                    if (void 0 !== scope.itemList)
                    {
                        console.log('set initialize data');
                        angular.copy(scope.itemList, originList);
                    }
                }
            });

            /**
             * 要素のインプットにフォーカが合った場合にリストを表示する
             * 
             * @author niikawa
             */
            element.find('input').on('focus', function()
            {
                if (0 < scope.itemList.length)
                {
                    scope.$apply(function ()
                    {
                        scope.isFocus = true;
                    });
                }
            });
            
            /**
             * 要素のインプットからにフォーカが外れた場合にリストを非表示する
             * 
             * @author niikawa
             */
            element.find('input').on('blur', function()
            {
                var hide = setInterval(function(isExist)
                {
                    scope.$apply(function ()
                    {
                        if (scope.selectByList)
                        {
                            var num = originList.length;
                            var isExist = scope.selectName.length === 0 ? true : false;
                            for (var i = 0; i < num; i++)
                            {
                                if (scope.selectName === originList[i][scope.namePropertie])
                                {
                                    isExist = true;
                                    break;
                                }
                            }
                            
                            if (isExist)
                            {
                                element.find('input').removeClass('auto-complete-item-error');
                            }
                            else
                            {
                                element.find('input').addClass('auto-complete-item-error');
                            }
                            scope.isFocus = false;
                        }
                    });
                    clearInterval(hide);
                }, 300);
            });
            
            /**
             * 入力文字に合致した選択肢を表示する
             * 
             * @author niikawa
             */
            element.find('input').on('keyup', function()
            {
                if (0 === originList.length)
                {
                    angular.copy(scope.itemList, originList);
                }
                var createList = [];

                if (0 < scope.itemList.length)
                {
                    scope.isFocus = true;
                }
                if (scope.selectName.length === 0)
                {
                    angular.copy(originList, createList);
                }
                else
                {
                    var num = originList.length;
                    for (var i = 0; i < num ; i++)
                    {
                        if (originList[i][scope.namePropertie].indexOf(scope.selectName) !== -1)
                        {
                            createList.push(angular.copy(originList[i]));
                        }
                    }
                }
                scope.$apply(function ()
                {
                    angular.copy(createList, scope.itemList);
                });
            });
            
            /**
             * 選択肢がクリックされた時に実行され、選択したアイテムを
             * selectedItemに格納する
             * 
             * @event click
             * @author niikawa
             * @param {object} $event イベント
             * @param {string} item   選択したアイテム
             */
            scope.click = function ($event, item) 
            {
                //イベントが伝搬しないように制御
                $event.preventDefault();
                $event.stopPropagation();
                
                angular.copy(item, scope.selectedItem);
                element.find('input').removeClass('auto-complete-item-error');
                scope.isFocus = false;
                if (void 0 !== scope.execute)
                {
                    scope.execute();
                }
                if (scope.showLabel) scope.isLabel = true;
                scope.selectName = item[scope.namePropertie]; 
            };
            
            /**
             * spanからinputに変更する
             * 
             * @event click
             * @author niikawa
             */
            scope.changeElement = function()
            {
                angular.copy(originList, scope.itemList);
                scope.isLabel = false;
                element.find('input').focus();
            };
        }
    };
});
var myApp = angular.module('myApp');
myApp.directive('spinnerDirective', function()
{
    return {
        restrict: 'E',
        scope: {is: '=', src: '@'},
        template: '<div ng-show="is"><img ng-src="{{src}}"></div>',
        link: function (scope, element, attrs) 
        {
        }
    };
});
/**
 * マップを生成する
 * 
 * 
 */
var myApp = angular.module('myApp');
myApp.directive('mapDirective', [ 'Utility' ,function(Utility){
    return {
        restrict: 'AE',
        scope:{
            mapClass: '@',
            overlayClass: '@',
        },
        // compile: function(element, attrs) {
            
        //     //JS読み込みたいな
        //     // <script src="http://maps.google.com/maps/api/js?sensor=true&libraries=places"></script>
        //     // <script src="vendor/map/gmaps.js"></script>
            
            
        // },
        link: function (scope, element, attrs) 
        {
            if (void 0 === attrs.id) return false;
            
            if (!navigator.geolocation)
            {
                Utility.errorSticky('ご利用のブラウザでは位置情報を取得できません。');
                return false;
            }

            element.addClass(scope.mapClass); 

            navigator.geolocation.getCurrentPosition(createGoogleMap, error);
            
            function createGoogleMap(position)
            {
                var map = new GMaps({
                    div: '#' + attrs.id,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    zoom: 18,
                });
                map.addMarker(
                {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    animation: google.maps.Animation.BOUNCE,
                    click: function(lat, lng)
                    {
                        var geocoder = new google.maps.Geocoder();
                        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                        geocoder.geocode({'latLng': latlng}, function(results, status)
                        {
                            if (status == google.maps.GeocoderStatus.OK)
                            {
                                if (results[1])
                                {
                                    Utility.info(results[1].formatted_address);
                                    map.setZoom(17);
                                }
                                else
                                {
                                    Utility.warning('対象の住所は存在しません');
                                }
                            }
                            else
                            {
                                Utility.warning('対象の住所は存在しません');
                            }
                          });
                    }
                });
            }
            
            function error(error)
            {
                var message = "";
                
                switch (error.code) {
                
                  // 位置情報が取得できない場合
                  case error.POSITION_UNAVAILABLE:
                    message = "位置情報の取得ができませんでした。";
                    break;
                
                  // Geolocationの使用が許可されない場合
                  case error.PERMISSION_DENIED:
                    message = "位置情報取得の使用許可がされませんでした。";
                    break;
                
                  // タイムアウトした場合
                  case error.PERMISSION_DENIED_TIMEOUT:
                    message = "位置情報取得中にタイムアウトしました。";
                    break;         
                }
                
                Utility.errorSticky(message);
            }
            
        }
    };
}]);
var myApp = angular.module('myApp');
myApp.directive('drawerMenuDirective', function()
{
    return {
        restrict: 'E',
        scope: {menuList: '=', position: '@'},
        template: '<nav class="hi-icon-effect-8 drawer-menu">'
                    +'<a ng-repeat="item in itemList" style="{{item.style}}" class="drawer-menu-item" ng-href={{item.link}}>'+
                    '<i ng-if="item.fa" class="fa {{item.fa}} fa-3x"></i>'+
                    '<span ng-if="item.s">{{item.s}}</span>'+
                    '</a>'+
                    '</nav>',
        link: function (scope, element, attrs) 
        {
            if (void 0 === scope.menuList)
            {
                console.log(scope.menuList);
            }
            
            //config
            var pi = 3.14;
            var openingAngle = pi - .2;
            var menuItemsNum = 5;
            
            //実行タイプ
            var type = 1;
            
            //表示対象
            var targetWidth = 50;

            //cssクラス
            var openButtonClass = 'fa-bars';
            var closeButtonClass = 'fa-times';
            
            //座標
            var x = 0;
            var y = 0;
            
            //描画
            var durbase = 1000;

            scope.itemList = [];
            scope.isOpen = false;
            var openItem = {fa: openButtonClass, link: '', style: '#/'};
            scope.itemList.push(openItem);
            
            element.on('click', function()
            {
                scope.$apply(function()
                {
                    if (scope.isOpen)
                    {
                        scope.itemList[0].fa = openButtonClass;
                        scope.itemList.splice(1, scope.itemList.length-1);
                        
                        if (1 === type)
                        {
                            scope.itemList[0].style = 'transform: translate(0);';
                        }
                        element.children('nav').addClass('drawer-menu-right');
                        element.children('nav').removeClass('drawer-menu-center');
                    }
                    else
                    {
                        scope.itemList[0].fa = closeButtonClass;
                        element.children('nav').removeClass('drawer-menu-right');
                        element.children('nav').addClass('drawer-menu-center');
                        
                        //element.addClass('move');
                        
                        var linkList = ['', '/#/segment', '/#/scenario', '/#/approach', '/#/user'];
                        var sList = ['D', 'SE', 'SC', 'AP', 'US'];

                        if (1 === type)
                        {
                            for (var i = 1; i <= menuItemsNum; i++)
                            {
                                var angle = ((pi - openingAngle)/2)+((openingAngle/(menuItemsNum - 1))*(i - 1));
        
                                x = Math.cos(angle) * 75;
                                y = Math.sin(angle) * 75 - ((i-1) * targetWidth) - targetWidth/2;
                                var dur = durbase+(400*i);
                                var translate = 'transition-timing-function:cubic-bezier(0.935, 0.000, 0.340, 1.330);transition-duration: '+dur+'ms;transform: translate3d(' + x +'px,' + y + 'px, 0);';
                                var add = {s: sList [i-1], link: linkList[i-1],style: translate};
                                scope.itemList.push(add);
                            }
                        }
                        
                        // else if (2 === type)
                        // {
                        //     for (var i = 0; i < 5; i++)
                        //     {
                        //         x = -60;
                        //         y = -60;
                        //         var dur = 1000 +(400*i);
                        //         var translate = 'transition-timing-function:cubic-bezier(0.935, 0.000, 0.340, 1.330);transition-duration: '+dur+'ms;transform: translate3d(' + x +'px,' + y + 'px, 0);';
                        //         var add = {fa: 'fa-dashcube', link: '',style: translate};
                        //         scope.itemList.push(add);
                        //     }
                        // }
                    }
                    scope.isOpen = !scope.isOpen;
                });
            });

        }
    };
});
var dDSharedServices = angular.module("myApp");
dDSharedServices.service('DDShared', function()
{
    var dDSharedServices = {};
    var orverIndex = 0;
    var fromData = {};
    var deforePosistion = 0;
    var isMoveDown = false;

    dDSharedServices.setFrom = function(data)
    {
        fromData = data;
    };
    
    dDSharedServices.getFrom = function()
    {
        return fromData;
    };
    
    dDSharedServices.getFromCopyByIndex = function(index)
    {
        return angular.copy(fromData[index]);
    };

    dDSharedServices.getCopyFrom = function()
    {
        return angular.copy(fromData);
    };

    dDSharedServices.setOrverIndex = function(index)
    {
        orverIndex = index;
    };

    dDSharedServices.getOrverIndex = function()
    {
        return orverIndex;
    };

    dDSharedServices.getBeforePosition = function()
    {
        return deforePosistion;
    };

    dDSharedServices.setBeforePosition = function(num)
    {
        deforePosistion = num;
    };

    dDSharedServices.isMoveDown = function()
    {
        return isMoveDown;
    };

    dDSharedServices.setMove = function(num)
    {
        isMoveDown = (0 < num) ? true : false;
    };

    dDSharedServices.clear = function()
    {
        orverIndex = 0;
        fromData = {};
    };

    return dDSharedServices;
});

var myApp = angular.module('myApp');
myApp.directive('dragItemDirective', ['DDShared', function(DDShared)
{
    return {
        restrict: 'AE',
        transclude: false,
        require: '^ngModel',
        scope: {dragindex: '='},
        link: function (scope, element, attrs, ctrl) 
        {
            element.attr('draggable', true);
            element.attr('data-index', scope.dragindex);
            
            element.on('dragstart', function(event)
            {
                var index = event.target.dataset.index;
                var item = element.html();
                event.originalEvent.dataTransfer.setData('item', item);
                event.originalEvent.dataTransfer.setData('itemIndex', index);
                DDShared.setFrom(ctrl.$modelValue);
                DDShared.setBeforePosition(0);
            });
        }
    };
}]);
myApp.directive('dropDirective', ['DDShared', function(DDShared)
{
    return {
        restrict: 'A',
        scope: {dropLineName: '@'},
        require: '^ngModel',
        link: function (scope, element, attrs, ctrl) 
        {
            var lineName = (void 0 === scope.dropLineName || '' === scope.dropLineName)  ? 'line' : scope.dropLineName;
            
            element.on('dragenter', function(event)
            {
                element.addClass('ui-drop-target');
            });
            
            element.on('dragover', function(event)
            {
                event.preventDefault();
                if (void 0 !== event.target.dataset.index)
                {
                    DDShared.setOrverIndex(event.target.dataset.index);
                    var wholeheight = Math.max.apply(
                        null, 
                        [document.body.clientHeight , document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight]
                    );
                    var windowHeight = (window.innerHeight||document.body.clientHeight||0);
                    if (wholeheight > windowHeight)
                    {
                        var now = event.target.getBoundingClientRect().top + $(event.target).position().top + 50;
                        var move = 0;
                        if (0 != DDShared.getBeforePosition() && DDShared.getBeforePosition() != now)
                        {
                            var elementHeight = $(event.target).height() + 15;
                            // up : down
                            move =(DDShared.getBeforePosition() > now) ?  -elementHeight : elementHeight;
                            DDShared.setMove(move);
                            DDShared.setBeforePosition(now - (move));
                            $(window).scrollTop($(window).scrollTop()+move);
                            
                        }
                        else
                        {
                            DDShared.setBeforePosition(now);
                        }
                    }
                }
                event.originalEvent.dataTransfer.dropEffect = 'move';
            });
            
            element.on('dragleave', function(event)
            {
                element.removeClass('ui-drop-target');
            });
            
            element.on('drop', function(event)
            {
                event.stopPropagation();
                DDShared.setBeforePosition(0);
                var index = event.originalEvent.dataTransfer.getData('itemIndex');
                var pushItem = {};
                
                var orverIndex = (ctrl.$modelValue.length === 0) ? 0 : DDShared.getOrverIndex();
                if (index === orverIndex) return false;

                if (angular.isArray(DDShared.getFrom()))
                {
                    pushItem = DDShared.getFromCopyByIndex(index);
                    DDShared.getFrom().splice(index, 1);
                }
                else
                {
                    pushItem = DDShared.getCopyFrom();
                }
                
                if (void 0 !== pushItem)
                {
                    ctrl.$modelValue.splice(orverIndex, 0, pushItem);
                }
                
                var len = ctrl.$modelValue.length;

                for (var i=0; i < len; i++)
                {
                    ctrl.$modelValue[i][lineName] = i+1;
                }
                var emitObject = {
                    to:{}, 
                    from:{}, 
                    remove:{}, 
                    isSameContainer:false, 
                    areaKey: attrs.dropAreaKey, 
                    insertLine: orverIndex
                };
                emitObject.to = ctrl.$modelValue;
                emitObject.from = DDShared.getFrom();
                emitObject.remove = pushItem;
                emitObject.isSameContainer = (emitObject.to == emitObject.from);
                scope.$emit('dropItemComplete', emitObject);
                console.log(emitObject);
                scope.$$phase || scope.$apply();
            });
        }
    };
}]);

//完全に画面（データ依存）のため使い回しはできない
myApp.directive('dropJoinDirective', ['DDShared', function(DDShared)
{
    return {
        restrict: 'A',
        scope: {dropJoinIndex: '='},
        require: '^ngModel',
        link: function (scope, element, attrs, ctrl) 
        {
            element.on('dragenter', function(event)
            {
                element.addClass('ui-drop-target');
            });
            element.on('dragover', function(event)
            {
                event.preventDefault();
                if (void 0 !== event.target.dataset.index)
                {
                    DDShared.setOrverIndex(event.target.dataset.index);
                }
                event.originalEvent.dataTransfer.dropEffect = 'move';
            });
            
            element.on('dragleave', function(event)
            {
                element.removeClass('ui-drop-target');
            });
            
            element.on('drop', function(event)
            {
                event.stopPropagation();
                
                if (ctrl.$modelValue == DDShared.getFrom()) return false;

                var index = event.originalEvent.dataTransfer.getData('itemIndex');
                //自分自身へのjoinは禁止
                var pushItem = DDShared.getFromCopyByIndex(index);
                if (void 0 === pushItem) return false;
                
                //固有条件
                var isModelArray = false;
                console.log(ctrl.$modelValue);
                if (angular.isArray(ctrl.$modelValue))
                {
                    //画面別
                    if (ctrl.$modelValue[0].hasOwnProperty('table') 
                        && ctrl.$modelValue[0].hasOwnProperty('column') )
                    {
                        if (ctrl.$modelValue[0].table.physicalname == pushItem[0].table.physicalname 
                            && ctrl.$modelValue[0].column.physicalname == pushItem[0].column.physicalname) return false;
                    }
                    isModelArray = true;
                }
                
                if (angular.isArray(DDShared.getFrom()))
                {
                    DDShared.getFrom().splice(index, 1);
                }
                else
                {
                    pushItem = DDShared.getCopyFrom();
                }
                
                if (ctrl.$modelValue == DDShared.getFrom())
                {
                    console.log(index);
                    //順番を入れ替える
                    ctrl.$modelValue.splice(index, index+1, pushItem, ctrl.$modelValue[index+1]);
                    return false;
                }
                else
                {
                    if (!isModelArray)
                    {
                        var mergeItems = [];
                        mergeItems.push(ctrl.$modelValue);
                        mergeItems.push(pushItem);
                    }
                    else
                    {
                        if (angular.isArray(pushItem))
                        {
                            ctrl.$modelValue.push(pushItem[0]);
                        }
                        else
                        {
                            ctrl.$modelValue.push(pushItem);
                        }
                    }
                }

                if (ctrl.$modelValue.length > 1) 
                {
                    ctrl.$modelValue.isJoin = true;
                }
                else
                {
                    ctrl.$modelValue.isJoin = false;
                }
                console.log(ctrl.$modelValue);
                scope.$$phase || scope.$apply();
//                scope.$emit('dropJoinItemComplete', mergeItems);
                console.log('drop join complete');
            });
        }
    };
}]);

/**
 * 
 */
var myApp = angular.module('myApp');
myApp.directive('pushDirective', function(){
    return {
        restrict: 'A',
        scope:{
            list : '=',
            pushInfo: '=info',
            active: '=',
            activekey: '@',
            multiple: '='
        },
        link: function (scope, element, attrs) 
        {
            element.css({cursor: 'pointer'});
            
            if (void 0 !== scope.active)
            {
                var setActive = false;
                if ("boolean" === typeof(scope.active))
                {
                    scope.pushInfo.isPush = scope.active;
                    setActive = scope.active;
                }
                else if ("string" === typeof(scope.active) || "number" === typeof(scope.active))
                {
                    if (scope.pushInfo[scope.activekey] == scope.active)
                    {
                        scope.pushInfo.isPush = true;
                        setActive = true;
                    }
                }
                if (setActive) element.addClass('push-active');
            }
            else
            {
                scope.pushInfo.isPush = false;
            }

            element.on('click', function()
            {
                scope.$apply(function()
                {
                    if (element.hasClass('push-active'))
                    {
                        scope.pushInfo.isPush = false;
                        element.removeClass('push-active');
                    }
                    else
                    {
                        if (void 0 === scope.multiple || !scope.multiple)
                        {
                            element.parent().children().removeClass('push-active');
                            angular.forEach(scope.list, function(item, key){item.isPush = false;});
                        }
                        scope.pushInfo.isPush = true;
                        element.addClass('push-active');
                    }
                });
            });
        }
    };
});
/**
 * 絞込みディレクティブ
 * 
 * [属性]
 * selectedItem : コントローラー側と選択した値のバインド用
 * itemList     : リスト表示用のデータ
 * 
 * [使用方法]
 * <refine-directive item-list="trackerList" selected-item="ticketModel.tracker" ></refine-directive>
 * 
 * @module refineDirective
 * @author niikawa
 */
var myApp = angular.module('myApp');
myApp.directive('refineDirective', function()
{
    return {
        restrict: 'A',
        scope: {refineItem: '=', namePropertie: '@', keyword: '=', execute: '&', },
        replace: true,
        link: function (scope, element, attrs) 
        {
            var originList = [];

            /**
             * 入力文字に合致した選択肢を表示する
             * 
             * @author niikawa
             */
            element.on('keyup', function()
            {
                if (0 === originList.length)
                {
                    angular.copy(scope.refineItem, originList);
                }
                var createList = [];

                if (void 0 === scope.keyword || scope.keyword.length === 0)
                {
                    angular.copy(originList, createList);
                }
                else
                {
                    var num = originList.length;
                    var nameList = scope.namePropertie.split('|');
                    var pushList = [];
                    var primeKey = Object.keys(originList[0]);

                    for (var i = 0; i < num ; i++)
                    {
                        angular.forEach(nameList, function(name, key)
                        {
                            if (originList[i][name].indexOf(scope.keyword) !== -1)
                            {
                                if (void 0 === pushList[originList[i][primeKey[0]]])
                                {
                                    createList.push(angular.copy(originList[i]));
                                    pushList[originList[i][primeKey[0]]] = true;
                                }
                            }
                        });
                    }
                }
                scope.$apply(function ()
                {
                    angular.copy(createList, scope.refineItem);
                });
            });
        }
    };
});
var myApp = angular.module('myApp');
myApp.directive('closeButtonDirecitve', function(Shared, Utility)
{
    return {
        restrict: 'E',
        scope: {execute: '&'},
        template: '<button ng-if="isShowMine" class="close-button" ng-click="click()"><i class="fa fa-times"></i></button>',
        link: function (scope, element, attrs) 
        {
            if (3 != Shared.get("role"))
            {
                scope.isShowMine = true;
            }
            else
            {
                scope.isShowMine = false;
            }
            
            scope.click = function()
            {
                Utility.confirmAlert(scope.execute);
            };
        }
    };
});
var myApp = angular.module('myApp');
myApp.directive('saveButtonDirecitve', function(Shared)
{
    return {
        restrict: 'E',
        scope: {is:"=", execute: '&', name: "@"},
        template: '<button ng-if="is" class="close-button" ng-click="click()">{{name}}</button>',
        link: function (scope, element, attrs) 
        {
            if (3 != Shared.get("role"))
            {
                scope.isShowMine = true;
            }
            else
            {
                scope.isShowMine = false;
            }
            
            scope.click = function()
            {
                scope.execute();
            };
        }
    };
});
var myApp = angular.module('myApp');
myApp.directive('linkButtonDirecitve', function(Shared)
{
    return {
        restrict: 'E',
        scope: {href: '@', name: "@"},
        template: '<a ng-if="isShowMine" class="btn btn-default" ng-href="/#/{{href}}">{{name}}</a> ',
        link: function (scope, element, attrs) 
        {
            if (3 != Shared.get("role"))
            {
                scope.isShowMine = true;
            }
            else
            {
                scope.isShowMine = false;
            }
            
            scope.click = function()
            {
                scope.execute();
            };
        }
    };
});
/**
 * 
 */
var myApp = angular.module('myApp');
myApp.directive('conditionDirective', function(Utility){
    return {
        restrict: 'EA',
        scope:{
            conditionAppend: '=',
            screenType: '@',
        },
        template: 
                '指定した値' +
                '<select ng-model="mySlected" class="form-control"' +
                    ' ng-options="item as item.name for item in selectItems" ng-required="true"></select>'+
                'ものを条件とする'+
                '<div ng-if="isOneInput"><input type="text" name="{{conditionAppend.column.physicalname}}" class="form-control" ng-model="conditionAppend.condition.value1" ng-keyup="check()" ng-required="true">'+

                '<div ng-if="conditionAppend.error" class="item-error-box"><p class="item-error">{{conditionAppend.message}}</p></div>'+

                '</div>'+
                '<div ng-if="isTextArea"><textarea class="form-control" ng-model="conditionAppend.condition.value1" ng-required="true"></textarea></div>'+
                
                '<div ng-if="isTwoInput"><input type="text" class="form-control" ng-model="conditionAppend.condition.value1" ng-keyup="check()" ng-required="true">～<input type="text" class="form-control" ng-model="conditionAppend.condition.value2" ng-keyup="check()" ng-required="true"></div>'
                  ,
        link: function (scope, element, attrs) 
        {
            var showOneInput = function()
            {
                scope.isOneInput = true;
                scope.isTextArea = false;
                scope.isTwoInput = false;
            };
            
            var showTextArea = function()
            {
                scope.isOneInput = false;
                scope.isTextArea = true;
                scope.isTwoInput = false;
            };
            
            var showTwoInput = function()
            {
                scope.isOneInput = false;
                scope.isTextArea = false;
                scope.isTwoInput = true;
            };
            
            if (1 == scope.screenType)
            {
                scope.selectItems = [
                    {name: 'に等しい', value: 1, execute: showOneInput, 'symbol': '='},
                    {name: '以上', value: 2, execute: showOneInput, 'symbol': '>='},
                    {name: '以下', value: 3, execute: showOneInput, 'symbol': '<='},
                    {name: 'を超える', value: 4, execute: showOneInput, 'symbol': '>'},
                    {name: '未満', value: 5, execute: showOneInput, 'symbol': '<'},
                    {name: 'の間', value: 6, execute: showTwoInput, 'symbol': 'BETWEEN'},
                ];
            }
            else
            {
                scope.selectItems = [
                    {name: 'に等しい', value: 1, execute: showOneInput, 'symbol': '='},
                    {name: '以上', value: 2, execute: showOneInput, 'symbol': '>='},
                    {name: '以下', value: 3, execute: showOneInput, 'symbol': '<='},
                    {name: 'を超える', value: 4, execute: showOneInput, 'symbol': '>'},
                    {name: '未満', value: 5, execute: showOneInput, 'symbol': '<'},
                    {name: 'の間', value: 6, execute: showTwoInput, 'symbol': 'BETWEEN'},
                    {name: 'を含む', value: 7, execute: showTextArea, 'symbol': 'IN'},
                    {name: 'を含まない', value: 8, execute: showTextArea, 'symbol': 'NOT IN'},
                    {name: 'から始まる', value: 9, execute: showOneInput, 'symbol': 'LIKE'},
                    {name: 'で終わる', value: 10, execute: showOneInput, 'symbol': 'LIKE'},
                    {name: 'を一部に持つ', value: 11, execute: showOneInput, 'symbol': 'LIKE'},
                ];
            }
            

            scope.isOneInput = false;
            scope.isTextArea = false;
            scope.isTwoInput = false;

            if (void 0 === scope.conditionAppend.selectedCondition)
            {
                scope.conditionAppend.selectedCondition = {name: '', value: '', symbol: ''};
                scope.conditionAppend.condition = {value1: '', value2: '', where: 'AND'};
            }
            else
            {
                angular.forEach(scope.selectItems, function(item)
                {
                    if (item.value === scope.conditionAppend.selectedCondition.value)
                    {
                        scope.mySlected = item;
                        scope.conditionAppend.selectedCondition.name = scope.mySlected.name;
                        scope.conditionAppend.selectedCondition.value = scope.mySlected.value;
                        scope.conditionAppend.selectedCondition.symbol = scope.mySlected.symbol;
                        item.execute();
                        return false;
                    }
                });
            }
            
            element.find('select').on('change', function()
            {
                scope.conditionAppend.selectedCondition.name = scope.mySlected.name;
                scope.conditionAppend.selectedCondition.value = scope.mySlected.value;
                scope.conditionAppend.selectedCondition.symbol = scope.mySlected.symbol;
                scope.$apply(function()
                {
                    scope.mySlected.execute();
                });
            });
            
            scope.check = function(event)
            {
                var type = '';
                if (void 0 === scope.conditionAppend.column)
                {
                    type = scope.conditionAppend.type;
                }
                else
                {
                    type = scope.conditionAppend.column.type;
                }
                var val = scope.conditionAppend.condition.value1;
                if ('bigint' === type || 'int' === type || 'number' === type)
                {
                    if (void 0 === val)
                    {
                        scope.conditionAppend.error = false;
                        scope.conditionAppend.message = '';
                    }
                    else
                    {
                        if (!isFinite(parseInt(val, 10)))
                        {
                            scope.conditionAppend.error = true;
                            scope.conditionAppend.message = '数値で入力してください';
                        }
                        else
                        {
                            scope.conditionAppend.error = false;
                            scope.conditionAppend.message = '';
                        }
                    }
                }
                else if ('datetime' === type || 'smalldatetime' === type)
                {
                    if (void 0 === val)
                    {
                        scope.conditionAppend.error = false;
                        scope.conditionAppend.message = '';
                    }
                    else
                    {
                        var valL = val.split('-') ;
                        if (3 !== valL.length)
                        {
                            scope.conditionAppend.error = true;
                            scope.conditionAppend.message = '日付はYYYY-MM-DDで入力してください';
                        }
                        else
                        {
                            var m = Utility.moment(val);
                            if (!m.isValid())
                            {
                                scope.conditionAppend.error = true;
                                scope.conditionAppend.message = '有効な日付ではありません';
                            }
                            else
                            {
                                scope.conditionAppend.error = false;
                                scope.conditionAppend.message = '';
                            }
                        }
                    }
                }
            };
        }
    };
});
/**
 * オートコンプリートディレクティブ
 * 
 * [属性]
 * selectedItem : コントローラー側と選択した値のバインド用
 * itemList     : リスト表示用のデータ
 * 
 * [使用方法]
 * <auto-complete-directive item-list="trackerList" selected-item="ticketModel.tracker" ></auto-complete-directive>
 * 
 * @module autoCompleteDirective
 * @author niikawa
 */
var myApp = angular.module('myApp');
myApp.directive('autoCompleteFaDirective', function()
{
    return {
        restrict: 'E',
        scope: {selectedItem: '=', itemList: '=', execute: '&', clickExecute: '&', namePropertie: '@', appendString: '@', showLabel: '=', selectByList: '=', selectName: '=', addonString: '@'},
        template:   '<div class="input-group"><span class="input-group-addon">{{addonString}}</span>'+
                    '<input ng-show="!isLabel" class="form-control form-control-add-fa2 " ng-model="selectName">' +
                    '<span ng-show="isLabel && selectName.length != 0" ng-click="changeElement()">{{appendString}}{{selectName}}</span>' +
                    '<ul class="complete-list" ng-show="isFocus">' +
                    '<li ng-repeat="item in itemList" ng-click="click($event, item)" >' +
                    '{{item[namePropertie]}}' +
                    '</li>' +
                    '</ul>' +
                    '<span class="input-group-addon question"><i class="fa fa-plus fa-2x" ng-click="clickI()"></i></span>',
        replace: true,
        link: function (scope, element, attrs) 
        {
            scope.selectName = '';
            scope.isFocus = false;
            scope.isLabel = false;
            var originList = [];
            scope.$watch('itemList', function(newValue, oldValue)
            {
                if (void 0 !== newValue && void 0 !== oldValue)
                {
                    console.log('watch itemList');
                    if (newValue.length === oldValue.length)
                    {
                        return false;
                    }
                    if (newValue.length > oldValue.length)
                    {
                        originList = angular.copy(newValue);
                    }
                    else if (newValue.length < oldValue.length)
                    {
                        originList = angular.copy(oldValue);
                    }
                }
                else
                {
                    if (void 0 !== scope.itemList)
                    {
                        console.log('set initialize data');
                        angular.copy(scope.itemList, originList);
                    }
                }
            });

            /**
             * 要素のインプットにフォーカが合った場合にリストを表示する
             * 
             * @author niikawa
             */
            element.find('input').on('focus', function()
            {
                if (0 < scope.itemList.length)
                {
                    scope.$apply(function ()
                    {
                        scope.isFocus = true;
                    });
                }
            });
            
            /**
             * 要素のインプットからにフォーカが外れた場合にリストを非表示する
             * 
             * @author niikawa
             */
            element.find('input').on('blur', function()
            {
                var hide = setInterval(function(isExist)
                {
                    scope.$apply(function ()
                    {
                        if (scope.selectByList)
                        {
                            var num = originList.length;
                            var isExist = scope.selectName.length === 0 ? true : false;
                            for (var i = 0; i < num; i++)
                            {
                                if (scope.selectName === originList[i][scope.namePropertie])
                                {
                                    isExist = true;
                                    break;
                                }
                            }
                            
                            if (isExist)
                            {
                                element.find('input').removeClass('auto-complete-item-error');
                            }
                            else
                            {
                                element.find('input').addClass('auto-complete-item-error');
                            }
                            scope.isFocus = false;
                        }
                    });
                    clearInterval(hide);
                }, 300);
            });
            
            /**
             * 入力文字に合致した選択肢を表示する
             * 
             * @author niikawa
             */
            element.find('input').on('keyup', function()
            {
                if (0 === originList.length)
                {
                    angular.copy(scope.itemList, originList);
                }
                var createList = [];

                if (0 < scope.itemList.length)
                {
                    scope.isFocus = true;
                }
                if (scope.selectName.length === 0)
                {
                    angular.copy(originList, createList);
                }
                else
                {
                    var num = originList.length;
                    for (var i = 0; i < num ; i++)
                    {
                        if (originList[i][scope.namePropertie].indexOf(scope.selectName) !== -1)
                        {
                            createList.push(angular.copy(originList[i]));
                        }
                    }
                }
                scope.$apply(function ()
                {
                    angular.copy(createList, scope.itemList);
                });
            });
            
            /**
             * 選択肢がクリックされた時に実行され、選択したアイテムを
             * selectedItemに格納する
             * 
             * @event click
             * @author niikawa
             * @param {object} $event イベント
             * @param {string} item   選択したアイテム
             */
            scope.click = function ($event, item) 
            {
                //イベントが伝搬しないように制御
                $event.preventDefault();
                $event.stopPropagation();
                
                angular.copy(item, scope.selectedItem);
                element.find('input').removeClass('auto-complete-item-error');
                scope.isFocus = false;
                if (void 0 !== scope.execute)
                {
                    scope.execute();
                }
                if (scope.showLabel) scope.isLabel = true;
                scope.selectName = item[scope.namePropertie]; 
            };
            
            /**
             * spanからinputに変更する
             * 
             * @event click
             * @author niikawa
             */
            scope.changeElement = function()
            {
                angular.copy(originList, scope.itemList);
                scope.isLabel = false;
                element.find('input').focus();
            };
            
            scope.clickI = function()
            {
                angular.copy(originList, scope.itemList);
                scope.isFocus = false;
                scope.clickExecute();
            };
        }
    };
});
var myApp = angular.module('myApp');
myApp.controller('CalendarCtrl',['$scope','Calendar', 'Utility', function ($scope, Calendar, Utility)
{
    $scope.calendarList = [];
    $scope.calendarofMonthList = [];
    $scope.isWeek = false;
    $scope.isMonth = false;
    var isDisabled = false;
    $scope.initialize = function()
    {
        Calendar.resource.get().$promise.then(function(response)
        {
            $scope.isWeek = true;
            $scope.calendarList = response.data;
        });
    };
    
    $scope.nextDay = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        var days = Object.keys($scope.calendarList);
        var last = Utility.moment(days[days.length-1]).format("YYYY-MM-DD");
        var next = Utility.addDay(last, 1).format("YYYY-MM-DD");
        
        Calendar.resource.oneDay({day: next}).$promise.then(function(response)
        {
            delete $scope.calendarList[Object.keys($scope.calendarList)[0]];
            var nextKey = Object.keys(response.data);
            $scope.calendarList[nextKey] = response.data[nextKey];
            isDisabled = false;
        });
    };
    
    $scope.deforeDay = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        var last = Utility.moment(Object.keys($scope.calendarList)[0]).format("YYYY-MM-DD");
        var next = Utility.subtractDay(last, 1).format("YYYY-MM-DD");
        
        Calendar.resource.oneDay({day: next}).$promise.then(function(response)
        {
            var days = Object.keys($scope.calendarList);
            delete $scope.calendarList[days[days.length-1]];
            var minKey = Object.keys(response.data);
            var newList = {};
            newList[minKey] = response.data[minKey];
            Object.keys($scope.calendarList).forEach(function(key)
            {
                newList[key] = $scope.calendarList[key];
            });
            $scope.calendarList = newList;
            isDisabled = false;
        });
    };
    
    $scope.showWeek = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        Calendar.resource.get().$promise.then(function(response)
        {
            isDisabled = false;
            $scope.isWeek = true;
            $scope.isMonth = false;
            $scope.calendarList = response.data;
        });
    };
    
    $scope.showMonth = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        var days = Object.keys($scope.calendarList);
        var year = Utility.moment(days[days.length-1]).format("YYYY");
        var month = Utility.moment(days[days.length-1]).format("MM");
        Calendar.resource.month({year:year, month: month}).$promise.then(function(response)
        {
            isDisabled = false;
            $scope.isMonth = true;
            $scope.isWeek = false;
            $scope.calendarofMonthList = response.data;
            $scope.year = response.year;
            $scope.month = response.month;
        });
    };
    
    $scope.nextMonth = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        var now = $scope.year + '/' + $scope.month + '/01';
        var yearMonth = Utility.addMonth(now, 1).format("YYYY-MM");
        var params = yearMonth.split("-");

        Calendar.resource.month({year:params[0], month: params[1]}).$promise.then(function(response)
        {
            isDisabled = false;
            $scope.isWeek = false;
            $scope.isMonth = true;
            $scope.calendarofMonthList = response.data;
            $scope.year = response.year;
            $scope.month = response.month;
        });
    };

    $scope.deforeMonth = function()
    {
        if (isDisabled) return;
        isDisabled = true;
        var now = $scope.year + '/' + $scope.month + '/01';
        var yearMonth = Utility.subtractMonth(now, 1).format("YYYY-MM");
        var params = yearMonth.split("-");
        Calendar.resource.month({year:params[0], month: params[1]}).$promise.then(function(response)
        {
            isDisabled = false;
            $scope.isWeek = false;
            $scope.isMonth = true;
            $scope.calendarofMonthList = response.data;
            $scope.year = response.year;
            $scope.month = response.month;
        });
    };

}]);
myApp.factory("Calendar", ['$resource','Utility', function($resource, Utility) 
{
    var calendarServices = {};
    
    calendarServices.resource = $resource('/calendar/', {}, 
    {
        oneDay:
        {
            method:"GET",
            url: "calendar/one/:day"
        },
        month:
        {
            method:"GET",
            url: "calendar/:year/:month"
        },
    });
    
    return calendarServices;
}]);

myApp.directive('calendarDirective', function(Utility)
{
    return {
        restrict: 'E',
        templateUrl: '../../partials/calendar.html',
        controller: 'CalendarCtrl',
        replace: true,
        link: function (scope, element, attrs, ctrl) 
        {
            scope.showCircle = false;

            scope.enterCircle = function()
            {
                scope.showCircle = true;
            };
            
            scope.leaveCircle = function()
            {
                scope.showCircle = false;
            };
            
            scope.isTrigger = function(type)
            {
                return 1 === type;
            };
            scope.isScSingle = function(type)
            {
                return 2 === type;
            };
            scope.isScPriod = function(type)
            {
                return 3 === type;
            };
            scope.isHoliday = function(dayMin)
            {
                return '0sun' == dayMin;
            };
            scope.isHolidayToWeek = function(day)
            {
                return 0 == Utility.moment(day).format("e");
            };
        }
    };
});

var myApp = angular.module('myApp');
myApp.directive('myValidators', function () {
    return {
        require: 'ngModel',
        scope: {
            myValidators: '=',
        },
        link: function (scope, elem, attrs, ctrl) {
            var validators = scope.myValidators || {};
            angular.forEach(validators, function (val, key) {
                ctrl.$validators[key] = val;
            });
        }
    };
});
myApp.directive('myAsyncValidators', function () {
    return {
        require: 'ngModel',
        scope: {
            myAsyncValidators: '='
        },
        link: function (scope, elem, attrs, ctrl) {
            var asyncValidators = scope.myAsyncValidators || {};
            angular.forEach(asyncValidators, function (val, key) {
                ctrl.$asyncValidators[key] = val;
            });
        }
    };
});
var myApp = angular.module('myApp');
myApp.directive('d3Bar', ['d3Service', '$parse', function (d3Service, $parse) {
  var d3 = d3Service.d3;
  return{
    restrict: 'EAC',
    scope:{
      data: '=', // APLのController側とデータをやり取り.
      key: '@',
      valueProp: '@',
      label: '@'
    },
    link: function(scope, element){
      // 初期化時に可視化領域の確保.a
      var svg = d3.select(element[0]).append('svg').style('width', '100%');
      var colorScale = d3.scale.category20();

      var watched = {}; // $watchリスナの登録解除関数格納用.

      // (Angular) $parseでCollection要素へのアクセサを確保しておく.
      var getId = $parse(scope.key || 'id');
      var getValue = $parse(scope.valueProp || 'value');
      var getLabel = $parse(scope.label || 'name');

      // (Angular) Collectionの要素変動を監視.
      scope.$watchCollection('data', function(){
        if(!scope.data){
          return;
        }

        // (D3 , Angular) data関数にて, $scopeとd3のデータを紐付ける.
        var dataSet = svg.selectAll('g.data-group').data(scope.data, getId);

        // (D3) enter()はCollection要素の追加に対応.
        var createdGroup = dataSet.enter()
        .append('g').classed('data-group', true)
        .each(function(d){
          // (Angular) Collection要素毎の値に対する変更は、$watchで仕込んでいく.
          var self = d3.select(this);
          watched[getId(d)] = scope.$watch(function(){
            return getValue(d);
          }, function(v){
            self.select('rect').attr('width', v);
          });
        });
        createdGroup.append('rect')
        .attr('x', 130)
        .attr('height', 18)
        .attr('fill', function(d){
          return colorScale(d.name);
        });
        createdGroup.append('text').text(getLabel).attr('height', 15);

        // (D3) exit()はCollection要素の削除に対応.
        dataSet.exit().each(function(d){
          // (Angular) $watchに登録されたリスナを解除して、メモリリークを防ぐ.
          var id = getId(d);
          watched[id]();
          delete watched[id];
        }).remove();

        // (D3) Collection要素変動の度に再計算する箇所.
        dataSet.each(function(d, i){
          var self = d3.select(this);
          self.select('rect').attr('y', i * 25);
          self.select('text').attr('y', i * 25 + 15);
        });

      });

    }
  };
}]);
var myApp = angular.module('myApp');
myApp.directive('lineChart', ['d3Service', '$parse', '$window', function (d3Service, $parse, $window)
{
    var d3 = d3Service.d3;
    return {
        restrict: 'EA',
        scope:{
          data: '=',
          type: '@',
          headerLabel: '=',
          legendLabel: '=',
        },
        link: function(scope, element)
        {
            //画面
            var w = angular.element($window);

            var colorList = ['#FF8C00', '#A9A9A9'];

            //D3.jsで表現できる線のリスト
            var lineTypeList = [
              'linear','linear-closed', 'step', 'step-before', 'step-after',
              'basis', 'basis-open', 'basis-close', 'bundle', 'cardinal',
              'cardinal-open', 'cardinal-close', 'monotone'
              ];

            //描画時のmargin  
            var margin = {top: 40, right: 40, bottom: 70, left: 90};
            
            //日付パース用
            var parseDate = d3.time.format("%Y/%m").parse;

            //dataを監視して変更があったら実行する
            scope.$watchCollection('data', function()
            {
                if (void 0 !== scope.headerLabel && '' !== scope.headerLabel)
                {
                    if (element.children('p').length > 0)
                    {
                        element.children('p').remove();
                    }
                    var add = '<p class="line-title">'+scope.headerLabel+'</p>';
                    element.append(add);
                }
                
                if(!scope.data) return;
                removeSVG();
                drowLegend(false);
                drowLine(false);
            });
            
            w.on('resize', function()
            {
                removeSVG();
                drowLegend(true);
                drowLine(true);
            });
            
            //---------------------
            //描画対象取得
            //---------------------
            function getType(type)
            {
                if (-1 === lineTypeList.indexOf(type))
                {
                    return lineTypeList[0];
                }
                return type;
            }
            
            //---------------------
            //凡例描画
            //---------------------
            function drowLegend(isResize)
            {
                if (void 0 === scope.legendLabel)
                {
                    return;
                }
                var num = angular.isArray(scope.legendLabel) ? scope.legendLabel.length : 0;
                if (0 === num) return;
                var size = {width : '100%', height: num * 15};
                var svg = d3.select(element[0])
                                  .append('svg')
                                  .attr("width", size.width)
                                  .attr("height", size.height);
//                var colorScale = d3.scale.category20();
                
                svg.selectAll('rect').data(scope.legendLabel)
                  .enter().append('rect')
                  .attr("class", "pull-right")
                  .attr("width", 50)
                  .attr('height', 5)
                  .attr('x', w.width() - 150)
                  .attr('y', function(d,i){return i * 20})
                  .attr('fill', function(d, i){return colorList[i];});
                
                //ラベル生成
                svg.selectAll('text').data(scope.legendLabel)
                  .enter().append('text')
                  .text(function(d, i){ return d }) 
                  .attr('x', function(d, i){ return w.width() - 250})
                  .attr('y', function(d, i){ 
                    if (0 === i)
                    {
                        return 10;
                    } 
                    else
                    {
                        return i * 5 + 20;
                    }
                  });
            }
            
            //---------------------
            //グラフ描画
            //---------------------
            function drowLine(isResize)
            {
                //描画サイズ  
                var size = {width : w.width(), height: w.height() / 2};
                var xrange = size.width - margin.left - margin.right - 50;
                var yrange = size.height - margin.top - margin.bottom;
                //Xメモリを日付にしてrangeで描画サイズを決定する
                var x = d3.time.scale()
                  .range([0, xrange]);
                //yはscale
                var y = d3.scale.linear()
                  .range([yrange, 0]);
            
                //TODO 
                var xAxis = 
                  d3.svg.axis().scale(x).orient("bottom").innerTickSize(-yrange)
                    .outerTickSize(0).tickFormat(d3.time.format("%Y/%m"));

                var yAxis = 
                  d3.svg.axis().scale(y).orient("left").innerTickSize(-xrange).outerTickSize(0);
                  
                //描画エリアを生成
                var svg = d3.select(element[0])
                                  .append('svg')
                                  .attr("width", "100%")
                                  .attr("height", size.height)
                                  .append("g")
                                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var lineType = getType(scope.type);
                
                //d3.svg.line()で座標値を計算して線の種類を設定
                var line = d3.svg.line()
                  .x(
                    function(d, i)
                    {
                      return x(d.date); 
                    }
                  )
                  .y(
                    function(d, i)
                    { 
                      return y(d.price);
                    }
                  )
                  .interpolate(lineType);

                angular.forEach(scope.data, function(dataset, i)
                {
                    //TODO
                    if (isResize)
                    {
                        dataset.forEach(function(d)
                        {
                            d.date = d.date;
                            d.price = +d.price;
                        });
                    }
                    else
                    {
                        dataset.forEach(function(d)
                        {
                            d.date = parseDate(d.date);
                            d.price = +d.price;
                        });
                    }
                                      
                    //表X軸、Y軸のメモリを設定する
                    var lineClass = 'line-avg';
                    if (0 === i)
                    {
                        lineClass = 'line-main';
                        x.domain(d3.extent(dataset, function(d){ return d.date; })).nice();
                        y.domain(d3.extent(dataset, function(d){ return d.price; })).nice();
                        
                        // 描画
                        svg.append("g")
                          .attr("class", "x axis")
                          .attr("transform", "translate(0, " + ( size.height - margin.top - margin.bottom ) + ")")
                          .call(xAxis)
                          .selectAll("text")
                            .attr("transform", "rotate (-70)")
                            .attr("dx", "-5em")
                            .attr("dy", "-0.1em")
                            .style("text-anchor", "start");

                        svg.append("g")
                          .attr("class", "y axis")
                          .call(yAxis)
                          .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 6)
                            .attr("dy", ".7em")
                            .style("text-anchor", "end");
                    }
                    
                    svg.append("path")
                      .datum(dataset)
                      .attr("class", lineClass)
                      .attr("d", line);
                });
            }
            
            //---------------------
            //削除
            //---------------------
            function removeSVG()
            {
                if (element.children('svg').length > 0)
                {
                    element.children('svg').remove();
                }
            }
        }
    };
}]);