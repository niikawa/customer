/**
 * 共通サービス
 * 
 * @author niikawa
 */
var utilsServices = angular.module("myApp");
utilsServices.service("Utility", ['$rootScope', function($rootScope)
{
    //--------------------------------------------------------------------------
    //共通項目除去
    //--------------------------------------------------------------------------
    this.deleteCommonInfo = function(param)
    {
        if (angular.isArray(param))
        {
            angular.forEach(param, function(data, k)
            {
                if (data.hasOwnProperty('delete_flag')) delete data.delete_flag;
                if (data.hasOwnProperty('create_by')) delete data.create_by;
                if (data.hasOwnProperty('create_date')) delete data.create_date;
                if (data.hasOwnProperty('update_by')) delete data.update_by;
                if (data.hasOwnProperty('update_date')) delete data.update_date;
            });
        }
        else
        {
            if (param.hasOwnProperty('delete_flag')) delete param.delete_flag;
            if (param.hasOwnProperty('create_by')) delete param.create_by;
            if (param.hasOwnProperty('create_date')) delete param.create_date;
            if (param.hasOwnProperty('update_by')) delete param.update_by;
            if (param.hasOwnProperty('update_date')) delete param.update_date;
        }
    };
    
    //--------------------------------------------------------------------------
    //メッセージアラート
    //stickyの場合は自動で消えない
    //--------------------------------------------------------------------------
    this.info = function(message, position)
    {
        position = position == null ? 'top-center' : position;
        $().toastmessage('showToast', {
            text     : message,
            sticky   : false,
            position : position,
            type     : 'notice'
        });
    };
    
    this.infoSticky = function(message, position) {
        position = position == null ? 'top-center' : position;
        $().toastmessage('showToast', {
            text     : message,
            sticky   : true,
            position : position,
            type     : 'notice'
        });
    };
    
    this.warning = function(message, position) {
        position = position == null ? 'top-center' : position;
        $().toastmessage('showToast', {
            text     : message,
            sticky   : false,
            position : position,
            type     : 'warning'
        });
    };

    this.warningSticky = function(message, position) {
        position = position == null ? 'top-center' : position;            
        $().toastmessage('showToast', {
            text     : message,
            sticky   : true,
            position : position,
            type     : 'warning'
        });
    };
    
    this.error = function(message, position) {
        position = position == null ? 'top-center' : position;            
        var dispMessage = (message.trim().length === 0) ? '通信エラー' : message;
        $().toastmessage('showToast', {
            text     : dispMessage,
            sticky   : false,
            position : position,
            type     : 'error'
        });
    };

    this.errorSticky = function(message, position) {
        position = position == null ? 'top-center' : position;
        var dispMessage = (message.trim().length === 0) ? '通信エラー' : message;
        $().toastmessage('showToast', {
            text     : dispMessage,
            sticky   : true,
            position : position,
            type     : 'error'
        });
    };
    
    this.success = function(message, position) {
        position = position == null ? 'top-center' : position;            
        $().toastmessage('showToast', {
            text     : message,
            sticky   : false,
            position : position,
            type     : 'success'
        });
    };        

    this.successSticky = function(message, position) {
        position = position == null ? 'top-center' : position;
        $().toastmessage('showToast', {
            text     : message,
            sticky   : true,
            position : position,
            type     : 'success'
        });
    };
    
    //--------------------------------------------------------------------------
    //日付
    //本アプリケーションは日付に関してmoment.jsに依存させるため必ず読み込むこと
    //http://momentjs.com/
    //--------------------------------------------------------------------------
    //momentオブジェクトを取得する
    this.momentDefault = function() {
        return moment();
    };
    this.moment = function(d) {
        return moment(d);
    };
    //本日の日付けを文字列で取得する
    this.today = function(format) {
        var formatString = (null == format) ? 'YYYY-MM-DD' : format;
        return this.moment().format(formatString);
    };
    //指定したフォーマットでパラメータの日付を文字列で取得する
    this.formatString = function(d,format) {
        var formatString = (null == format) ? 'YYYY-MM-DD' : format;
        return this.moment(d).format(formatString);
    };
    
    //指定した年月の持つ最終日を取得する
    this.dayInMonth = function(a) {
        return moment(a).daysInMonth();
    };
    //aがbより未来かを判定する
    this.isAfter = function(a, b) {
        return moment(a).isAfter(moment(b));
    };
    this.getMomemtObject = function(date) {
        return moment(date);
    };
    //
    // add
    //
    this.addDay = function(a, b) {

        return moment(a).add(b, 'day');
    };
    this.addMonth = function(a, b) {

        return moment(a).add(b, 'month');
    };
    this.addYear = function(a, b) {

        return moment(a).add(b, 'year');
    };
    //
    // subtract
    //
    this.subtractDay = function(a, b) {
        
        return moment(a).subtract('day', b);
    };
    
    this.subtractMonth = function(a, b) {
        
        return moment(a).subtract('month', b);
    };
    this.subtractYear = function(a, b) {
        
        return moment(a).subtract('year', b);
    };
    //
    // diff
    //
    this.diffDay = function(a, b) {
        
        return moment(a).diff(moment(b), 'day');
    };

    this.diffMonth = function(a, b) {
        
        return moment(a).diff(moment(b), 'month');
    };

    this.diffYear = function(a, b) {
        
        return moment(a).diff(moment(b), 'year');
    };

    this.createDayList = function(maxDay) {
        
        var dayList = [];
        for (var index=1; index <= maxDay; index++) {
            var day = ('00' + index).slice(-2);
            dayList.push({value:day, text:day});
        }
        return dayList;
    };
    
    this.createMonthList = function() {
        var monthList = [];
        for (var index=1; index < 12; index++) {
            var month = ('00' + index).slice(-2);
            monthList.push({value:month, text:month});
        }
        return monthList;
    };
    
    this.createYearList = function(min, max) {
        
        var yearList = [];
        for (var year= min; year <= max; year++) {
            yearList.push({value:String(year), text:year});
        }
        return yearList;
    };
    
    this.setSpinner = function(bool)
    {
        if (bool)
        {
            $rootScope.$broadcast('requestStart');
        }
        else
        {
            $rootScope.$broadcast('requestEnd');
        }
    };
    
    this.isDateValid = function(target, delimiter)
    {
        if (null === target) return false;
        if (void 0 === delimiter) delimiter = '-';
        var days = target.split(delimiter);
        if (3 !== days.length) return false;
        
        var m = this.moment(target);
        return m.isValid();
    };
    
    this.confirmAlert = function(execute)
    {
        swal({
            title: "削除してもよろしいですか？",
            type: "warning",
            allowOutsideClick: true,
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "削除する",
            cancelButtonText:"キャンセル",
            closeOnConfirm: true,
            html: false
        }, function() {
            execute();
        });
    };
    this.infoAlert = function(params)
    {
        swal({
            title: params.title,
            text: params.text,
            type: "info",
            allowOutsideClick: true,
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: params.confirmButtonText,
            cancelButtonText:"閉じる",
            closeOnConfirm: true,
            html: true
        }, function() {
            params.execute();
        });
    };
}]);