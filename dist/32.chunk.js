webpackJsonp([32],{193:function(e,n,t){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var i=t(1),s=o(i),c=t(2),a=o(c),r=t(3),l=o(r),u=t(4),_=o(u),m=t(0),d=o(m);t(664);var f=t(599);window.simpleMS=null;var g=null,h=function(e){function n(e){(0,s.default)(this,n);var t=(0,l.default)(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,e));return t.getLoginLittleVideoSystemEwm=function(){var e=t,n={method:"getLoginLittleVideoSystemEwm",uuid:g};WebServiceUtil.requestLittleAntApi(JSON.stringify(n),{onResponse:function(n){if(n.success){var t=n.response,o=d.default.createElement("img",{src:t});e.setState({loginImg:o})}else Toast.fail("登录失败")},onError:function(e){Toast.fail(e,1)}})},t.state={title:"app",open:!1,loginImg:""},t}return(0,_.default)(n,e),(0,a.default)(n,[{key:"componentWillMount",value:function(){Bridge.setRefreshAble("false"),simpleMS=new f.SimpleWebsocketConnection,simpleMS.connect(),g=this.createMachineId(),console.log("machineId==>"+g)}},{key:"componentDidMount",value:function(){this.getLoginLittleVideoSystemEwm(),simpleMS.msgWsListener={onError:function(e){},onWarn:function(e){},onMessage:function(e){var n=e.command;if(console.log("command===>"+n),0==WebServiceUtil.isEmpty(n)&&"allowLoginLittleVideoSystem"==n){var t=e.data,o=t.uuid,i=t.user;WebServiceUtil.isEmpty(sessionStorage.getItem("loginUser"))&&sessionStorage.setItem("loginUser",JSON.stringify(i)),o==g&&(location.hash="AppSystem"),console.log("data==============>"+t)}}}}},{key:"createMachineId",value:function(){for(var e=[],n="0123456789abcdef",t=0;t<36;t++)e[t]=n.substr(Math.floor(16*Math.random()),1);return e[14]="4",e[19]=n.substr(3&e[19]|8,1),e[8]=e[13]=e[18]=e[23]="-",e.join("")}},{key:"render",value:function(){return d.default.createElement("div",{id:"Login"},d.default.createElement("div",{className:"ThinkChange_cont"},d.default.createElement("div",{className:"Thinkhead"},d.default.createElement("p",{className:"title"},d.default.createElement("span",null,"有样")),d.default.createElement("p",{className:"title2"},d.default.createElement("span",null,"AR微分享学习平台"))),d.default.createElement("div",{className:"ThinkChange"},this.state.loginImg),d.default.createElement("div",{className:"ThinkChange_text"},"请使用有样APP扫码授权登录")))}}]),n}(d.default.Component);n.default=h},599:function(module,__webpack_exports__,__webpack_require__){"use strict";function SimpleWebsocketConnection(){this.msgWsListener=null,this.REMOTE_URL="wss://www.maaee.com:7891/Excoord_SimpleWsServer/simple",this.LOCAL_URL="ws://192.168.50.15:8891/Excoord_SimpleWsServer/simple",this.WS_URL=isDebug?this.LOCAL_URL:this.REMOTE_URL,this.ws=null,this.PING_COMMAND="ping_0123456789_abcdefg",this.PONG_COMMAND="pong_0123456789_abcdefg",this.connected=!1,this.connecting=!1,this.reconnectTimeout,this.heartBeatTimeout,this.connect=function(){var connection=this;connection.connecting=!0,connection.ws=new WebSocket(connection.WS_URL),connection.ws.onmessage=function(event){if(connection.connecting=!1,event.data==connection.PING_COMMAND)return void connection.send(connection.PONG_COMMAND);if(event.data==connection.PONG_COMMAND)return void console.log("收到服务器的 pong");if(null!=connection.msgWsListener){var jsonMessage=eval("("+event.data+")");if(-1==jsonMessage.statusCode){var errorResult=jsonMessage.errorResult;connection.msgWsListener.onError(errorResult.message)}else if(0==jsonMessage.statusCode){var warnResult=jsonMessage.warnResult;connection.msgWsListener.onWarn(warnResult.message)}else if(1==jsonMessage.statusCode){var infoResult=jsonMessage.infoResult,command=infoResult.command;connection.msgWsListener.onMessage(infoResult)}}},connection.ws.onclose=function(e){connection.connecting=!1,connection.connected=!1,connection.reconnect()},connection.ws.onopen=function(e){connection.connecting=!1,connection.connected=!0},connection.ws.onerror=function(e){connection.connecting=!1}},this.closeConnection=function(){var e=this;clearTimeout(e.reconnectTimeout),clearTimeout(e.heartBeatTimeout),e.ws.close()},this.reconnect=function(){var e=this;e.connected||e.connecting||(e.reconnectTimeout=setTimeout(function(){e.connect(),e.reconnect(),console.log("重连中 ...")},1e4))},this.send=function(e){var n=this;!n.connecting&&n.connected&&n.ws.send(JSON.stringify(e))},this.heartBeat=function(){var e=this,n=e.PING_COMMAND;e.heartBeatTimeout=setTimeout(function(){e.send(n),e.heartBeat()},1e4)},this.heartBeat()}Object.defineProperty(__webpack_exports__,"__esModule",{value:!0}),__webpack_exports__.SimpleWebsocketConnection=SimpleWebsocketConnection;var __WEBPACK_IMPORTED_MODULE_0_react__=__webpack_require__(0),__WEBPACK_IMPORTED_MODULE_0_react___default=__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__),isDebug=!1},664:function(e,n){}});