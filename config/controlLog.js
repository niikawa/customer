var controlLog = {
    
    get: function(controlType)
    {
        var data = {};
        switch(controlType)
        {
            case 1:
                data = {show_flag: 1, detail: '[ログインしました]'};
                break;
            case 2: 
                data = {show_flag: 1, detail: '[ユーザーの登録をしました]'};
                break;
            case 3: 
                data = {show_flag: 1, detail: '[ユーザーの更新をしました]'};
                break;
            case 4: 
                data = {show_flag: 1, detail: '[クエリを作成しました]'};
                break;
            case 5: 
                data = {show_flag: 1, detail: '[クエリを更新しました]'};
                break;
            case 6: 
                data = {show_flag: 1, detail: '[セグメントを作成しました]'};
                break;
            case 7: 
                data = {show_flag: 1, detail: '[セグメントを更新しました]'};
                break;
    
        }
        return data;
    }
};
module.exports = controlLog;
