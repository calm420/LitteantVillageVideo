webpackJsonp([31],{213:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var d=a(20),n=i(d),o=a(1),l=i(o),s=a(2),r=i(s),u=a(3),c=i(u),f=a(4),m=i(f),v=a(0),p=i(v);a(693);var y,E=function(e){function t(e){(0,l.default)(this,t);var a=(0,c.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return a.Load=function(e){e.stopPropagation();var t,a=navigator.userAgent;t=a.indexOf("iPhone")>-1||a.indexOf("iPad")>-1?"ios":"android","ios"==t?window.location.href="https://itunes.apple.com/cn/app/apple-store/id1423189213?mt=8":"android"==t&&(window.location.href="http://60.205.86.217/upload7_app/2018-08-28/14/e9c3c09b-f9da-4d7e-8ad3-b810d17a1bf8.apk")},y=a,a.state={data:{}},a}return(0,m.default)(t,e),(0,r.default)(t,[{key:"componentDidMount",value:function(){document.title="有样AR微分享";var e=window.location.href,t=e.substr(e.indexOf("?")+1),a=t.split("=")[1];y.getLittleVideoById(a),this.setState({videoId:a});var i=navigator.userAgent;if(i.indexOf("iPhone")>-1||i.indexOf("iPad")>-1?"ios":"android","android"){t=t.substr(e.indexOf("?")+1);var d=t.split("&"),a=d[0].split("=")[1];y.getLittleVideoById(a),this.setState({videoId:a})}if("ios"){var n=t.substr(t.indexOf("?")+1),a=n.split("=")[1];y.getLittleVideoById(a),this.setState({videoId:a})}this.videoElement=document.getElementsByTagName("video")[0],this.videoElement.setAttribute("playsinline","true"),this.videoElement.setAttribute("x5-playsinline","true"),this.videoElement.setAttribute("webkit-playsinline","true")}},{key:"getLittleVideoById",value:function(e){var t={method:"getLittleVideoById",videoId:e};WebServiceUtil.requestLittleAntApi(JSON.stringify(t),{onResponse:function(e){("调用成功"==e.msg||e.success)&&0==WebServiceUtil.isEmpty(e.response)&&y.setState({data:e.response})},onError:function(e){}})}},{key:"render",value:function(){return p.default.createElement("div",null,p.default.createElement("div",{id:"playVideo"},p.default.createElement("div",{className:"videoHead"},p.default.createElement("img",{className:"userFace",src:y.state.data.userInfo?y.state.data.userInfo.avatar:"",alt:""}),p.default.createElement("div",{className:"userMessage"},p.default.createElement("div",{className:"userName text_hidden"},y.state.data.userInfo?y.state.data.userInfo.userName:""),p.default.createElement("div",{className:"userinfo text_hidden"},y.state.data.videoContent))),p.default.createElement("div",{className:"videoCont"},p.default.createElement("video",(0,n.default)({className:"videoDiv empty_center",src:y.state.data.videoPath,poster:y.state.data.coverPath,controls:!0,autoPlay:!0,"x5-playsinline":"true",playsinline:"true","webkit-playsinline":"true",controlslist:"nodownload nofullscreen"},"webkit-playsinline","true"))),p.default.createElement("div",{className:"download_box"},p.default.createElement("div",{className:"download_img_box"},p.default.createElement("img",{className:"download_img",src:a(694),alt:""})),p.default.createElement("div",{className:"download_describe"},p.default.createElement("p",{className:"downloadTitle"},"有样AR微分享"),p.default.createElement("p",{className:"downloadIntro"},"据说下载的人都变成学霸了！")),p.default.createElement("div",{className:"download_button",onClick:y.Load},"去下载"))))}}]),t}(p.default.Component);t.default=E},693:function(e,t){},694:function(e,t,a){e.exports=a.p+"acd62cc39775cf2d70d40c85d8ea5d06.png"}});