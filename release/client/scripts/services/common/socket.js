var socketServices=angular.module("myApp");socketServices.service("Socket",function(a){var b={},c=io.connect();return b.on=function(b,d){c.on(b,function(){var b=arguments;a.$apply(function(){d.apply(c,b)})})},b.emit=function(b,d,e){c.emit(b,d,function(){var b=arguments;a.$apply(function(){e.apply(c,b)})})},b});