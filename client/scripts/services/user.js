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
            updata: {
                method: 'PUT',
            },            
            remove:
            {
                method: 'GET',
                url: 'user/delete',
            },
            isSameMailAddress:
            {
                method: 'POST',
                url: 'user/mail/',
            }
        });
        
        userService.validators = 
        {
            isSameMailAddress : function(userId, mailaddress)
            {
                return $http.post('user/mail/',{user_id: userId, mailaddress: mailaddress}
                ).then(function(response)
                {
                    if (response.result.count > 0)
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