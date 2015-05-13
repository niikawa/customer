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
        scope: {},
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
                event.preventDefault();
                var index = event.originalEvent.dataTransfer.getData('itemIndex');
                var pushItem = {};
                if (angular.isArray(DDShared.getFrom()))
                {
                    pushItem = DDShared.getFromCopyByIndex(index);
                    DDShared.getFrom().splice(index, 1);
                }
                else
                {
                    pushItem = DDShared.getCopyFrom();
                }
                var orverIndex = (ctrl.$modelValue.length === 0) ? 0 : DDShared.getOrverIndex();
                ctrl.$modelValue.splice(orverIndex, 0, pushItem);
                
                var len = ctrl.$modelValue.length;
                for (var i=0; i < len; i++)
                {
                    ctrl.$modelValue[i].line = i+1;
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
                DDShared.clear();
                scope.$emit('dropItemComplete', emitObject);
            });
        }
    };
}]);
