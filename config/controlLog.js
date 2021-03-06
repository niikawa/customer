var controlLog = {
    
    get: function(controlType)
    {
        var data = {};
        switch(controlType)
        {
            case 1:
                data = {show_flag: 1, detail: 'ログインしました'};
                break;
            case 2:
                data = {show_flag: 1, detail: 'ログアウトしました'};
                break;
            case 3: 
                data = {show_flag: 1, detail: '[ユーザー管理]'};
                break;
            case 4: 
                data = {show_flag: 1, detail: '[クエリ管理]'};
                break;
            case 5: 
                data = {show_flag: 1, detail: '[セグメント管理]'};
                break;
            case 6: 
                data = {show_flag: 1, detail: '[トリガーシナリオ管理]'};
                break;
            case 7: 
                data = {show_flag: 1, detail: '[スケジュールシナリオ管理]'};
                break;
            case 8: 
                data = {show_flag: 1, detail: '[アプローチ管理]'};
                break;
            case 9: 
                data = {show_flag: 1, detail: '[操作履歴]'};
                break;
            case 99: 
                data = {show_flag: 1, detail: '[バグ報告・要望追加]'};
                break;
    
        }
        return data;
    }
};
module.exports = controlLog;
