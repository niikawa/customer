var myApp=angular.module("myApp");myApp.directive("rateDirective",function(){return{restrict:"E",scope:{bind:"=",execute:"&"},template:'<div style="display: inline-block"></div>',transclude:!0,link:function(a,b,c){function d(a,c){b.children().empty();for(var d=1;c>=d;d++){var e=a>=d?h:i,f='<img class="rate" value="'+d+'" src="'+e+'">';$(f).appendTo(b.children())}var j='<span class="label label-success">'+g(a,c)+"%</span>";$(j).appendTo(b.children())}function e(){var a=c.max;return"number"!=typeof a&&"string"!=typeof a?5:a==parseFloat(a)&&isFinite(a)?Math.ceil(a):5}function f(){var a=c.value;return"number"!=typeof a&&"string"!=typeof a?0:Math.ceil(a)}function g(a,b){return a==b?100:(100*(a/b)).toFixed(1)}var h="images/icon/Star6.png",i="images/icon/Star7.png";void 0!==c.onimage&&(h=c.onimage),void 0!==c.offimage&&(i=c.offimage);var j=e(),k=f();d(k,j),a.$watch("bind",function(a){var b=e(),c=Math.ceil((a/(100/b)).toFixed(1));d(c,b)}),b.on("click","img",function(){var c=e(),f=$(this).attr("value");b.attr("value",f),d(f,c),a.$apply(function(){a.bind=g(f,c)}),void 0!==a.execute&&a.$apply(a.execute)})}}});