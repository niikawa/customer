var fs = require("fs");
var moment = require("moment");
(function()
{
    var fileHelper = {};
    
    /**
     * 出力先
     */
    fileHelper.output = "";
    /**
     * セパレータ
     */
    fileHelper.separator = ",";
    /**
     * 拡張子
     */
    fileHelper.extension = ".csv";
    /**
     * 1つの配列に格納される要素の最大数
     */
    fileHelper.maxListNum = 100000;

    /**
     * Example:
     *          option = 
     *          {
     *              fileName: "sample",
     *              separator: ",",
     *              extension: "csv",
     *              max: 10,
     *              outputCol: {name: name}
     *          }
     * 
     * @param {object} データベースから取得した結果
     * @param {object} option 
     *                      path : ファイル出力パス
     *                      fileName : 指定しない場合はYYYYMMDhhmmss
     *                      separator : 指定しない場合はカンマ
     *                      extension : 指定しない場合はcsv
     *                      max : 指定しない場合は制限なし
     *                      outputCol : 出力対象を指定する
     */
    fileHelper.write = function(dbData, option, callback)
    {
        console.log(dbData);
        console.log(option);
        if (option.hasOwnProperty("separator")) this.setSeparator(option.separator);
        if (option.hasOwnProperty("extension")) this.setExtension(option.extension);
        
        var isHeader = true;
        if (option.hasOwnProperty('isHeader'))
        {
            isHeader = option.isHeader;
        }
        
        var fileName = "";
        if (option.hasOwnProperty("fileName"))
        {
            fileName = option.fileName;
        }
        else
        {
            fileName = moment().format('YYYYMMDDhhmmss');
        }
    
        if (option.hasOwnProperty("path"))
        {
            this.output = option.path + "/" + fileName;
        }
        
        var isRemove = false;
        if (option.hasOwnProperty("outputCol"))
        {
            isRemove = option.outputCol.length > 0;
        }
        
        if (isHeader)
        {
            var headerRowList = [];
            if (isRemove)
            {
                headerRowList = createSpecifiedHeaderList(dbData[0], option.outputCol);
            }
            else
            {
                headerRowList = createHeaderList(dbData[0]);
            }
    
            if (0 === headerRowList.length)
            {
                var err = 
                {
                    status: "510",
                    message: "It does not create a header",
                    parameters: {data: dbData, option: option}
                };
                callback(err, "");
            }
                
            var headerRow = headerRowList.join(this.separator);
            fs.writeFileSync(this.output, headerRow, 'utf8');
        }
        
        var dataNum = dbData.length;
        var splitNum = (dataNum < this.maxListNum) ? 0 : Math.ceil(dataNum / this.maxListNum);
        var row = {};
        var rowList = [];
        var rowString = "\n";
        if (isRemove)
        {
            // for (var index = 0; index < splitNum; index++)
            // {
                for (var rowNum = 0; rowNum < dataNum; rowNum++)
                {
                    row = dbData[rowNum];
                    rowList = createSpecifiedRowList(row, option.outputCol);
                    rowString += rowList.join(this.separator) + "\n";
                }
                fs.appendFileSync(this.output, rowString, 'utf8');
            // }
        }
        else
        {
            // for (var index = 0; index < splitNum; index++)
            // {
                for (var rowNum = 0; rowNum < dataNum; rowNum++)
                {
                    row = dbData[rowNum];
                    rowList = createRowList(row);
                    rowString += rowList.join(this.separator) + "\n";
                }
                fs.appendFileSync(this.output, rowString, 'utf8');
            // }
        }
        callback(null, {output: this.output, fileName: fileName+this.extension});
    };
    
    fileHelper.setSeparator = function(s)
    {
        this.separator = s;
    };

    fileHelper.setExtension = function(ex)
    {
        this.extension = ex;
    };

    function createHeaderList(row)
    {
        var headerRowList = [];
        Object.keys(row).forEach(function(colName)
        {
            headerRowList.push(colName);
        });
        return headerRowList;
    }
    
    function createSpecifiedHeaderList(row, outputList)
    {
        var headerRowList = [];
        Object.keys(row).forEach(function(colName)
        {
            if (outputList.hasOwnProperty(colName))
            {
                headerRowList.push(colName);
            }
        });
        return headerRowList;
    }
    
    function createRowList(row)
    {
        var rowList = [];
        Object.keys(row).forEach(function(colName)
        {
            rowList.push(row[colName]);
        });
        return rowList;
    }
    
    function createSpecifiedRowList(row, outputList)
    {
        var rowList = [];
        Object.keys(row).forEach(function(colName)
        {
            if (outputList.hasOwnProperty(colName))
            {
                rowList.push(row[colName]);
            }
        });
        return rowList;
    }
    
    module.exports = fileHelper;
}());
