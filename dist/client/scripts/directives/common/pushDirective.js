var myApp=angular.module("myApp");myApp.directive("pushDirective",function(){return{restrict:"A",scope:{list:"=",pushInfo:"=info",active:"=",activekey:"@",multiple:"="},link:function(a,b){if(b.css({cursor:"pointer"}),void 0!==a.active){var c=!1;"boolean"==typeof a.active?(a.pushInfo.isPush=a.active,c=a.active):("string"==typeof a.active||"number"==typeof a.active)&&a.pushInfo[a.activekey]==a.active&&(a.pushInfo.isPush=!0,c=!0),c&&b.addClass("push-active")}else a.pushInfo.isPush=!1;b.on("click",function(){a.$apply(function(){b.hasClass("push-active")?(a.pushInfo.isPush=!1,b.removeClass("push-active")):(void 0!==a.multiple&&a.multiple||(b.parent().children().removeClass("push-active"),angular.forEach(a.list,function(a){a.isPush=!1})),a.pushInfo.isPush=!0,b.addClass("push-active"))})})}}});