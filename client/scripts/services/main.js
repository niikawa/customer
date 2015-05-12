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