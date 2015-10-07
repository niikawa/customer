var scenarioServices=angular.module("ScenarioServices",["ngResource"]);scenarioServices.factory("Scenario",["$resource","$http","$q","Utility",function(a,b,c){var d={},e={schedule:{type:1,mode:0,title:"スケジュール型",addTitle:"",template:"views/scenario/schedule.html"},trigger:{type:2,mode:0,title:"トリガー型",addTitle:"",template:"views/scenario/trigger.html"}};return d.daysCondition=function(){for(var a=[],b=31,c=1;b>=c;c++)a.push({name:c,check:!1});return a.push({name:"最終日",check:!1}),a},d.resource=a("/scenario/:type/:id/",{id:"@id"},{list:{method:"GET",url:"scenario/list/:id",cache:!0},initializeData:{method:"GET",url:"scenario/initialize/:type/:id"},action:{method:"GET",url:"action/:name",cache:!0},save:{method:"POST",url:"scenario/save"},remove:{method:"DELETE",url:"scenario/:type/remove/:id"},valid:{method:"GET",url:"scenario/valid"},priority:{method:"POST",url:"scenario/priority"},typeCount:{method:"GET",url:"scenario/typecount"},executeplan:{method:"GET",url:"scenario/execute/plan"},bulkInvalid:{method:"GET",url:"scenario/bulkInvalid"},bulkEnable:{method:"GET",url:"scenario/bulkEnable"}}),d.getPageProp=function(a,b){var c=e[a];return c.addTitle=void 0===b?"登録":"更新",c.mode=void 0===b?1:2,c},d.validators={isSameName:function(a){return b.post("scenario/name/",a).then(function(a){return a.data.result.count>0?c.reject("exists"):!1})}},d.setActivePushItem=function(a,b,c,d){angular.forEach(a,function(a){return a.isPush?(c[d]=a[b],!1):void 0})},d.createCondtionString=function(a){var b="",c=a.length-1;return angular.forEach(a,function(a,d){b+=a.logicalname+"が["+a.condition.value1,""!==a.condition.value2&&(b+=","+a.condition.value2),b+="]"+a.selectedCondition.name,d!==c&&(b+="AND"===a.condition.where?" かつ ":" または ")}),b},d.getConditionDoc=function(a){var b=[];return angular.forEach(a,function(a){var c=[];angular.forEach(a,function(a){c.push({physicalname:a.physicalname,condition:a.condition,selectedCondition:a.selectedCondition})}),b.push(c)}),b},d}]);