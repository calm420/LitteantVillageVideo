var isDebug = false;
var localDomain = "192.168.50.71";   //请求地址
var isDebugLocal = false;
var localUrl = "192.168.50.72";    //跳转地址http:
var isSafeDebug = false;     //false则为隐藏主页列表，本地调试改为true



// //小蚂蚁webService地址
const apiWebServiceURLOfLocalsApi = "http://" + localDomain + ":9006/Excoord_ApiServer/webservice";
const apiWebServiceURLOfRemoteApi = "https://www.maaee.com/Excoord_For_Education/webservice";
var apiWebServiceURLApi = isDebug ? apiWebServiceURLOfLocalsApi : apiWebServiceURLOfRemoteApi;
// //云校本地测试webService地址
// var elearningWebserviceURLOfLocal = "http://" + localDomain + ":8888/elearning/elearningControl/";
// //云校的远程服务器地址
// var elearningWebserviceURLOfRemote = "http://www.maaee.com/elearning/elearningControl/";
// var elearningWebserviceURL = isDebug ? elearningWebserviceURLOfLocal : elearningWebserviceURLOfRemote;

// //小蚂蚁webService地址
const apiWebServiceURLOfLocals = "http://" + localDomain + ":6012/Excoord_LittleVideoApiServer/webservice";

const apiWebServiceURLOfRemote = "http://www.maaee.com:6012/Excoord_LittleVideoApiServer/webservice";
var apiWebServiceURL = isDebug ? apiWebServiceURLOfLocals : apiWebServiceURLOfRemote;
//小蚂蚁mobile地址
const mobileURLOfLocal = "http://" + localUrl + ":7094/#/";
const mobileURLOfRemote = "http://jiaoxue.maaee.com:8094/#/";


//老人健康手环地址
const OldManBraceletURLOfLocals = "http://" + localDomain + ":6010/Excoord_OldManBracelet/webservice";
// const OldManBraceletURLOfLocals = "http://192.168.50.15:9010/Excoord_OldManBracelet/webservice";
const OldManBraceletURLOfRemote = "http://www.maaee.com:6010/Excoord_OldManBracelet/webservice";
var OldManBraceletURL = isDebug ? OldManBraceletURLOfLocals : OldManBraceletURLOfRemote;

function WebServiceUtil() {

};

WebServiceUtil.mobileServiceURL = isDebugLocal ? mobileURLOfLocal : mobileURLOfRemote;

/**
 * 不带请求头的ajax---云校
 * @param data
 * @param listener
 */
WebServiceUtil.requestLittleAntApi9006 = function (data, listener) {
    $.ajax({
        type: "post",
        url: apiWebServiceURLApi,
        data: {params: data},
        dataType: "json",
        success: function (result) {
            listener.onResponse(result);
        }, error: function (error) {
            listener.onError(error);
        }
    });
}


/**
 * 不带请求头的ajax
 * @param data
 * @param listener
 */
WebServiceUtil.requestLittleAntApi = function (data, listener) {
    $.ajax({
        type: "post",
        url: apiWebServiceURL,
        data: {params: data},
        dataType: "json",
        success: function (result) {
            listener.onResponse(result);
        }, error: function (error) {
            listener.onError(error);
        }
    });
}

/**
 * 请求头的ajax
 * @param data
 * @param listener
 */
WebServiceUtil.requestLittleAntApiOldManBracelet = function (data, listener) {
    $.ajax({
        type: "post",
        url: OldManBraceletURL,
        data: {params: data},
        dataType: "json",
        success: function (result) {
            listener.onResponse(result);
        }, error: function (error) {
            listener.onError(error);
        }
    });
}

/**
 * 带有请求头的ajax
 * @param data
 * @param headObj
 * @param listener
 */
WebServiceUtil.requestLittleAntApiWithHead = function (data, headObj, listener) {
    $.ajax({
        type: "post",
        url: apiWebServiceURL,
        data: {params: data},
        dataType: "json",
        headers: JSON.parse(headObj),
        success: function (result) {
            listener.onResponse(result);
        }, error: function (error) {
            listener.onError(error);
        }
    });
}

/**
 * 系统非空判断
 * @param content
 * @returns {boolean}
 */
WebServiceUtil.isEmpty = function (content) {
    if (content == null || content == "null" || content == "" || typeof (content) == "undefined") {
        return true;
    } else {
        return false;
    }
};

/**
 * 时间戳转年月日
 * @param nS
 * @returns {string}
 */
WebServiceUtil.formatYMD = function (nS) {
    var da = new Date(parseInt(nS));
    var year = da.getFullYear();
    var month = da.getMonth() + 1;
    var date = da.getDate();
    var ymdStr = [year, month, date].join('-');
    return ymdStr;
};

/**
 * 时间戳日
 * @param nS
 * @returns {string}
 */
WebServiceUtil.formatD = function (nS) {
    var da = new Date(parseInt(nS));
    var year = da.getFullYear();
    var month = da.getMonth() + 1;
    var date = da.getDate();
    var ymdStr = [date];
    return ymdStr;
};


/**
 * 时间戳转月日
 * @param nS
 * @returns {string}
 */
WebServiceUtil.formatMD = function (nS) {
    var da = new Date(parseInt(nS));
    var year = da.getFullYear();
    var month = da.getMonth() + 1;
    var date = da.getDate();
    var ymdStr = [month, date].join('-');
    return ymdStr;
};

/**
 * 时间戳转年月日时分秒，完整时间显示
 * @param nS
 * @returns {string}
 */
WebServiceUtil.formatAllTime = function (nS) {
    var da = new Date(parseInt(nS));
    var year = da.getFullYear();
    var month = da.getMonth() + 1;
    var date = da.getDate();
    var hour = (da.getHours() < 10 ? '0' + (da.getHours()) : da.getHours()) + ":";
    var minutes = (da.getMinutes() < 10 ? '0' + (da.getMinutes()) : da.getMinutes()) + ":";
    var sencond = (da.getSeconds() < 10 ? '0' + (da.getSeconds()) : da.getSeconds());
    var dayStr = [year, month, date].join('-');
    var dateStr = dayStr + " " + hour + minutes + sencond;
    return dateStr;
};

/**
 * 时间戳转年月
 * @param nS
 * @returns {string}
 */
WebServiceUtil.formatYM = function (nS) {
    var da = new Date(parseInt(nS));
    var year = da.getFullYear();
    var month = da.getMonth() + 1;
    var ymdStr = [year, month].join('-');
    return ymdStr;
};

/**
 * 时间戳转时分
 * @param nS
 * @returns {string}
 */
WebServiceUtil.formatHM = function (nS) {
    var da = new Date(parseInt(nS));
    var hour = da.getHours() + ":";
    var minutes = da.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    var hmStr = hour + minutes;
    return hmStr;
};
/**
 * 时间戳转分
 * @param nS
 * @returns {string}
 */
WebServiceUtil.formatM = function (nS) {
    var da = new Date(parseInt(nS));
    var hour = da.getHours() + ":";
    var minutes = da.getMinutes();
    // if (minutes < 10) {
    //     minutes = "0" + minutes;
    // }
    var hmStr = minutes;
    return hmStr;
};

WebServiceUtil.createUUID = function () {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
};


