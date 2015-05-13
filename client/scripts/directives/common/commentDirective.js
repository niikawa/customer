/**
 * コメント表示ディレクティブ
 * 本ディレクティブを使用する場合はtimeline.cssを読み込むこと
 * 
 * [パラメータ]
 * 下記要素を持つオブジェクトの配列
 *  username:ユーザー名
 *  userimg:ユーザーの画像パス 指定されていない場合はデフォルト画像を使用する
 *  comment:コメント
 *  date:日時
 * [使用方法]
 * <rate-directive execute="function()" bind='コントローラーでバインドした値' max=10 value="rate"><rate-directive>
 * 
 * @author gozaru
 */
var myApp = angular.module('myApp');
myApp.directive('commentDirective', function()
{
    return {
        restrict: 'AE',
        scope: {bind: '='},
        template: '<ul class="timeline"></ul>',
        transclude: true,
        link: function (scope, element, attrs) 
        {
            if (void 0 === scope.bind || void 0 === scope.bind.length)
            {
                return;
            }
            
            var num = scope.bind.length;
            
            for (var index = 0; index < num; index++)
            {
                var item = scope.bind[index];
                //elementに要素を追加していく
                var imgpath = item.userimg;
                if (void 0 === imgpath || null === imgpath)
                {
                    imgpath = 'images/icon/1408515480_7.png';
                }
                var imgelEment = '<div class="timeline-badge"><img src="' + imgpath + '" width="50px"></div>';

                var commentElement = 
                    '<div class="timeline-panel"><div class="timeline-heading"><h4 class="timeline-title">'
                    + item.username
                    + item.date 
                    + '</h4></div>'
                    + '<div class="timeline-body"><p>'+ item.comment +'</p></div>'
                    + '</div>';
                var addElement = imgelEment+commentElement;
                
                if (void 0 !== index)
                {
                    if (0 === index % 2)
                    {
                        addElement = '<li class="timeline-inverted">'+addElement+'</li>';
                    }
                    else
                    {
                        addElement = '<li>'+addElement+'</li>';
                    }
                    
                }
                $(addElement).appendTo(element.children());
            }
        }
    };
});