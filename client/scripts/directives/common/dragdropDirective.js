var dDSharedServices = angular.module("myApp");
dDSharedServices.service('DDShared', function()
{
    var dDSharedServices = {};
    var orverIndex = 0;
    var fromData = {};

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
                }
                event.originalEvent.dataTransfer.dropEffect = 'move';
                var base = $(event.target).position();
                var now = base.top + 50;
                var scrollTop = $(window).scrollTop();
                console.log(now);
                console.log($(window).scrollTop());
                if (now > scrollTop)
                {
                    $(window).scrollTop(scrollTop+100);
                }
            });
            
            element.on('dragleave', function(event)
            {
                element.removeClass('ui-drop-target');
            });
            
            element.on('drop', function(event)
            {
                event.stopPropagation();
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
