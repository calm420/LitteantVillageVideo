webpackJsonp([22],{212:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(60),i=a(o),r=n(82),s=a(r),l=n(228),u=a(l),c=n(1),d=a(c),f=n(2),p=a(f),m=n(3),v=a(m),h=n(4),y=a(h),E=n(238),g=a(E);n(61),n(83),n(229),n(242);var b=n(0),k=a(b);n(695);var w,N=g.default.alert,C=function(e){function t(e){(0,d.default)(this,t);var n=(0,v.default)(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));n.exitAddTags=function(){$(".updateModel").slideUp(),$(".tagAddPanel_bg").hide(),n.setState({powerItem:{}})},n.addTagsForSure=function(){if(WebServiceUtil.isEmpty(n.state.powerItem.powerName))return void u.default.fail("请选择要添加的权限",2);var e={method:"saveRolePower",rolePowerJson:JSON.stringify({powerId:n.state.powerItem.powerId,roleId:n.state.roleId})};WebServiceUtil.requestLittleAntApi(JSON.stringify(e),{onResponse:function(e){"调用成功"==e.msg&&1==e.success?(u.default.success("添加成功",1),w.exitAddTags(),w.getAllPowerByRoleId(n.state.roleId)):u.default.fail(e.msg)},onError:function(e){u.default.fail(e,1)}})};var a=new s.default.DataSource({rowHasChanged:function(e,t){return e!==t}});return n.initData=[],w=n,n.state={dataSource:a.cloneWithRows(n.initData),clientHeight:document.body.clientHeight,powerItem:{}},n}return(0,y.default)(t,e),(0,p.default)(t,[{key:"componentWillMount",value:function(){document.title="用户权限管理"}},{key:"componentDidMount",value:function(){var e=decodeURI(window.location.href),t=e.substr(e.indexOf("?")+1),n=t.split("&"),a=n[0].split("=")[1],o=n[1].split("=")[1];this.getAllPowerByRoleId(a),this.getAllPowers(),this.setState({roleId:a,roleName:o})}},{key:"getAllPowerByRoleId",value:function(e){var t=this;t.initData=[];var n={},a={method:"getAllPowerByRoleId",pageNo:-1,roleId:e};WebServiceUtil.requestLittleAntApi(JSON.stringify(a),{onResponse:function(e){if("调用成功"==e.msg&&1==e.success){for(var a=e.response,o=0;o<a.length;o++){var i=a[o];n[""+o]=i}t.initData=t.initData.concat(a),t.setState({dataSource:t.state.dataSource.cloneWithRows(t.initData),isLoadingLeft:!1})}else u.default.fail(e.msg)},onError:function(e){u.default.fail(e,1)}})}},{key:"getAllPowers",value:function(){var e=this,t={method:"getAllPowers",pageNo:-1};WebServiceUtil.requestLittleAntApi(JSON.stringify(t),{onResponse:function(t){if("调用成功"==t.msg&&1==t.success){var n=t.response;WebServiceUtil.isEmpty(n)||e.buildPowerList(n)}else u.default.fail(t.msg)},onError:function(e){u.default.fail(e,1)}})}},{key:"buildPowerList",value:function(e){var t=this,n=[];e.forEach(function(e,a){n.push(k.default.createElement("li",{className:"line_public noomPowerList",onClick:function(n){t.setState({powerItem:e});for(var a=0;a<$(".noomPowerList").length;a++)$(".noomPowerList").eq(a).removeClass("active");n.target.className="active line_public noomPowerList"}},e.powerName))}),this.setState({powerList:n})}},{key:"showAddPower",value:function(){$(".updateModel").slideDown(),$(".tagAddPanel_bg").show()}},{key:"showDeletePower",value:function(e){var t,n=navigator.userAgent;t=n.indexOf("iPhone")>-1||n.indexOf("iPad")>-1?"ios":"android";var a=this;N("您确定移除吗?","",[{text:"取消",onPress:function(){return console.log("cancel")},style:"default"},{text:"确定",onPress:function(){return a.deleteRolePower(e)}}],t)}},{key:"deleteRolePower",value:function(e){var t=this,n={method:"deleteRolePower",rolePowerId:e};WebServiceUtil.requestLittleAntApi(JSON.stringify(n),{onResponse:function(n){"调用成功"==n.msg&&1==n.success?(u.default.success("删除成功",1),t.state.dataSource=[],t.state.dataSource=new s.default.DataSource({rowHasChanged:function(e,t){return e!==t}}),t.initData.forEach(function(n,a){e==n.rolePowerId&&t.initData.splice(a,1)}),t.setState({dataSource:t.state.dataSource.cloneWithRows(t.initData)})):u.default.fail(n.msg)},onError:function(e){u.default.fail(e,1)}})}},{key:"render",value:function(){var e=this,t=this,n=function(n,a,o){return k.default.createElement("div",{className:"item line_public"},k.default.createElement("span",{className:"textOver"},n.powerInfo.powerName),k.default.createElement("span",{className:"icon_delete",onClick:t.showDeletePower.bind(e,n.rolePowerId)},"删除"))};return k.default.createElement("div",{id:"accessManagement"},k.default.createElement("div",{className:"tableDiv"},k.default.createElement(s.default,{ref:function(t){return e.lv=t},dataSource:this.state.dataSource,renderHeader:function(){return k.default.createElement("div",{className:"topDiv"},k.default.createElement("div",{className:"role"},"角色：",k.default.createElement("span",null,e.state.roleName)),k.default.createElement("div",{className:"user"},"权限"))},renderFooter:function(){return k.default.createElement("div",null,k.default.createElement("div",{style:{paddingTop:5,paddingBottom:0,textAlign:"center"}},e.state.isLoadingLeft?"正在加载":"已经全部加载完毕"))},renderRow:n,className:"am-list",pageSize:30,scrollRenderAheadDistance:200,onEndReached:this.onEndReached,onEndReachedThreshold:10,initialListSize:30,scrollEventThrottle:20,style:{height:this.state.clientHeight-65}})),k.default.createElement("div",{className:"addBtn sameBack",onClick:this.showAddPower},k.default.createElement("span",null,"添加权限",k.default.createElement(i.default,{type:"plus"}))),k.default.createElement("div",{className:"updateModel",style:{display:"none"}},k.default.createElement("div",{className:"cont"},this.state.powerList),k.default.createElement("div",{className:"bottomBox"},k.default.createElement("span",{className:"close",onClick:this.exitAddTags},"取消"),k.default.createElement("span",{className:"bind",onClick:this.addTagsForSure},"确定"))),k.default.createElement("div",{className:"tagAddPanel_bg"}))}}]),t}(k.default.Component);t.default=C},224:function(e,t){e.exports=function(e,t){if(e.indexOf)return e.indexOf(t);for(var n=0;n<e.length;++n)if(e[n]===t)return n;return-1}},225:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.ModalComponent=void 0;var o=n(5),i=a(o),r=n(20),s=a(r),l=n(2),u=a(l),c=n(1),d=a(c),f=n(3),p=a(f),m=n(4),v=a(m),h=n(8),y=a(h),E=n(0),g=a(E),b=n(237),k=a(b),w=n(58),N=a(w),C=function(e,t){var n={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(n[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,a=Object.getOwnPropertySymbols(e);o<a.length;o++)t.indexOf(a[o])<0&&(n[a[o]]=e[a[o]]);return n},A=t.ModalComponent=function(e){function t(){return(0,d.default)(this,t),(0,p.default)(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return(0,v.default)(t,e),t}(g.default.Component),P=function(e){function t(){return(0,d.default)(this,t),(0,p.default)(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return(0,v.default)(t,e),(0,u.default)(t,[{key:"renderFooterButton",value:function(e,t,n){var a={};if(e.style&&"string"==typeof(a=e.style)){a={cancel:{},default:{},destructive:{color:"red"}}[a]||{}}var o=function(t){t.preventDefault(),e.onPress&&e.onPress()};return g.default.createElement(N.default,{activeClassName:t+"-button-active",key:n},g.default.createElement("a",{className:t+"-button",role:"button",style:a,onClick:o},e.text||"Button"))}},{key:"render",value:function(){var e,t=this,n=this.props,a=n.prefixCls,o=n.className,r=n.wrapClassName,l=n.transitionName,u=n.maskTransitionName,c=n.style,d=n.platform,f=n.footer,p=void 0===f?[]:f,m=n.operation,v=n.animated,h=n.transparent,E=n.popup,b=n.animationType,w=C(n,["prefixCls","className","wrapClassName","transitionName","maskTransitionName","style","platform","footer","operation","animated","transparent","popup","animationType"]),N=(0,y.default)(a+"-button-group-"+(2!==p.length||m?"v":"h"),a+"-button-group-"+(m?"operation":"normal")),A=p.length?g.default.createElement("div",{className:N,role:"group"},p.map(function(e,n){return t.renderFooterButton(e,a,n)})):null,P=void 0,T=void 0;v&&(P=T=h?"am-fade":"am-slide-up",E&&(P="slide-up"===b?"am-slide-up":"am-slide-down",T="am-fade"));var _=(0,y.default)(r,(0,s.default)({},a+"-wrap-popup",E)),x=(0,y.default)(o,(e={},(0,s.default)(e,a+"-transparent",h),(0,s.default)(e,a+"-popup",E),(0,s.default)(e,a+"-popup-"+b,E&&b),(0,s.default)(e,a+"-android","android"===d),e));return g.default.createElement(k.default,(0,i.default)({},w,{prefixCls:a,className:x,wrapClassName:_,transitionName:l||P,maskTransitionName:u||T,style:c,footer:A}))}}]),t}(A);t.default=P,P.defaultProps={prefixCls:"am-modal",transparent:!1,popup:!1,animationType:"slide-down",animated:!0,style:{},onShow:function(){},footer:[],closable:!1,operation:!1,platform:"ios"}},226:function(e,t,n){"use strict";function a(e){var t=[];return N.a.Children.forEach(e,function(e){t.push(e)}),t}function o(e,t){var n=null;return e&&e.forEach(function(e){n||e&&e.key===t&&(n=e)}),n}function i(e,t,n){var a=null;return e&&e.forEach(function(e){if(e&&e.key===t&&e.props[n]){if(a)throw new Error("two child with same key for <rc-animate> children");a=e}}),a}function r(e,t,n){var a=e.length===t.length;return a&&e.forEach(function(e,o){var i=t[o];e&&i&&(e&&!i||!e&&i?a=!1:e.key!==i.key?a=!1:n&&e.props[n]!==i.props[n]&&(a=!1))}),a}function s(e,t){var n=[],a={},i=[];return e.forEach(function(e){e&&o(t,e.key)?i.length&&(a[e.key]=i,i=[]):i.push(e)}),t.forEach(function(e){e&&a.hasOwnProperty(e.key)&&(n=n.concat(a[e.key])),n.push(e)}),n=n.concat(i)}function l(e){var t=e.children;return N.a.isValidElement(t)&&!t.key?N.a.cloneElement(t,{key:j}):t}function u(){}var c=n(5),d=n.n(c),f=n(20),p=n.n(f),m=n(1),v=n.n(m),h=n(2),y=n.n(h),E=n(3),g=n.n(E),b=n(4),k=n.n(b),w=n(0),N=n.n(w),C=n(6),A=n.n(C),P=n(36),T=n.n(P),_=n(21),x=n.n(_),L=n(230),S={isAppearSupported:function(e){return e.transitionName&&e.transitionAppear||e.animation.appear},isEnterSupported:function(e){return e.transitionName&&e.transitionEnter||e.animation.enter},isLeaveSupported:function(e){return e.transitionName&&e.transitionLeave||e.animation.leave},allowAppearCallback:function(e){return e.transitionAppear||e.animation.appear},allowEnterCallback:function(e){return e.transitionEnter||e.animation.enter},allowLeaveCallback:function(e){return e.transitionLeave||e.animation.leave}},O=S,M={enter:"transitionEnter",appear:"transitionAppear",leave:"transitionLeave"},R=function(e){function t(){return v()(this,t),g()(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return k()(t,e),y()(t,[{key:"componentWillUnmount",value:function(){this.stop()}},{key:"componentWillEnter",value:function(e){O.isEnterSupported(this.props)?this.transition("enter",e):e()}},{key:"componentWillAppear",value:function(e){O.isAppearSupported(this.props)?this.transition("appear",e):e()}},{key:"componentWillLeave",value:function(e){O.isLeaveSupported(this.props)?this.transition("leave",e):e()}},{key:"transition",value:function(e,t){var n=this,a=x.a.findDOMNode(this),o=this.props,i=o.transitionName,r="object"===(void 0===i?"undefined":T()(i));this.stop();var s=function(){n.stopper=null,t()};if((L.b||!o.animation[e])&&i&&o[M[e]]){var l=r?i[e]:i+"-"+e,u=l+"-active";r&&i[e+"Active"]&&(u=i[e+"Active"]),this.stopper=Object(L.a)(a,{name:l,active:u},s)}else this.stopper=o.animation[e](a,s)}},{key:"stop",value:function(){var e=this.stopper;e&&(this.stopper=null,e.stop())}},{key:"render",value:function(){return this.props.children}}]),t}(N.a.Component);R.propTypes={children:A.a.any};var D=R,j="rc_animate_"+Date.now(),I=function(e){function t(e){v()(this,t);var n=g()(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return W.call(n),n.currentlyAnimatingKeys={},n.keysToEnter=[],n.keysToLeave=[],n.state={children:a(l(e))},n.childrenRefs={},n}return k()(t,e),y()(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props.showProp,n=this.state.children;t&&(n=n.filter(function(e){return!!e.props[t]})),n.forEach(function(t){t&&e.performAppear(t.key)})}},{key:"componentWillReceiveProps",value:function(e){var t=this;this.nextProps=e;var n=a(l(e)),r=this.props;r.exclusive&&Object.keys(this.currentlyAnimatingKeys).forEach(function(e){t.stop(e)});var u=r.showProp,c=this.currentlyAnimatingKeys,d=r.exclusive?a(l(r)):this.state.children,f=[];u?(d.forEach(function(e){var t=e&&o(n,e.key),a=void 0;(a=t&&t.props[u]||!e.props[u]?t:N.a.cloneElement(t||e,p()({},u,!0)))&&f.push(a)}),n.forEach(function(e){e&&o(d,e.key)||f.push(e)})):f=s(d,n),this.setState({children:f}),n.forEach(function(e){var n=e&&e.key;if(!e||!c[n]){var a=e&&o(d,n);if(u){var r=e.props[u];if(a){!i(d,n,u)&&r&&t.keysToEnter.push(n)}else r&&t.keysToEnter.push(n)}else a||t.keysToEnter.push(n)}}),d.forEach(function(e){var a=e&&e.key;if(!e||!c[a]){var r=e&&o(n,a);if(u){var s=e.props[u];if(r){!i(n,a,u)&&s&&t.keysToLeave.push(a)}else s&&t.keysToLeave.push(a)}else r||t.keysToLeave.push(a)}})}},{key:"componentDidUpdate",value:function(){var e=this.keysToEnter;this.keysToEnter=[],e.forEach(this.performEnter);var t=this.keysToLeave;this.keysToLeave=[],t.forEach(this.performLeave)}},{key:"isValidChildByKey",value:function(e,t){var n=this.props.showProp;return n?i(e,t,n):o(e,t)}},{key:"stop",value:function(e){delete this.currentlyAnimatingKeys[e];var t=this.childrenRefs[e];t&&t.stop()}},{key:"render",value:function(){var e=this,t=this.props;this.nextProps=t;var n=this.state.children,a=null;n&&(a=n.map(function(n){if(null===n||void 0===n)return n;if(!n.key)throw new Error("must set key for <rc-animate> children");return N.a.createElement(D,{key:n.key,ref:function(t){return e.childrenRefs[n.key]=t},animation:t.animation,transitionName:t.transitionName,transitionEnter:t.transitionEnter,transitionAppear:t.transitionAppear,transitionLeave:t.transitionLeave},n)}));var o=t.component;if(o){var i=t;return"string"==typeof o&&(i=d()({className:t.className,style:t.style},t.componentProps)),N.a.createElement(o,i,a)}return a[0]||null}}]),t}(N.a.Component);I.isAnimate=!0,I.propTypes={component:A.a.any,componentProps:A.a.object,animation:A.a.object,transitionName:A.a.oneOfType([A.a.string,A.a.object]),transitionEnter:A.a.bool,transitionAppear:A.a.bool,exclusive:A.a.bool,transitionLeave:A.a.bool,onEnd:A.a.func,onEnter:A.a.func,onLeave:A.a.func,onAppear:A.a.func,showProp:A.a.string},I.defaultProps={animation:{},component:"span",componentProps:{},transitionEnter:!0,transitionLeave:!0,transitionAppear:!1,onEnd:u,onEnter:u,onLeave:u,onAppear:u};var W=function(){var e=this;this.performEnter=function(t){e.childrenRefs[t]&&(e.currentlyAnimatingKeys[t]=!0,e.childrenRefs[t].componentWillEnter(e.handleDoneAdding.bind(e,t,"enter")))},this.performAppear=function(t){e.childrenRefs[t]&&(e.currentlyAnimatingKeys[t]=!0,e.childrenRefs[t].componentWillAppear(e.handleDoneAdding.bind(e,t,"appear")))},this.handleDoneAdding=function(t,n){var o=e.props;if(delete e.currentlyAnimatingKeys[t],!o.exclusive||o===e.nextProps){var i=a(l(o));e.isValidChildByKey(i,t)?"appear"===n?O.allowAppearCallback(o)&&(o.onAppear(t),o.onEnd(t,!0)):O.allowEnterCallback(o)&&(o.onEnter(t),o.onEnd(t,!0)):e.performLeave(t)}},this.performLeave=function(t){e.childrenRefs[t]&&(e.currentlyAnimatingKeys[t]=!0,e.childrenRefs[t].componentWillLeave(e.handleDoneLeaving.bind(e,t)))},this.handleDoneLeaving=function(t){var n=e.props;if(delete e.currentlyAnimatingKeys[t],!n.exclusive||n===e.nextProps){var o=a(l(n));if(e.isValidChildByKey(o,t))e.performEnter(t);else{var i=function(){O.allowLeaveCallback(n)&&(n.onLeave(t),n.onEnd(t,!1))};r(e.state.children,o,n.showProp)?i():e.setState({children:o},i)}}}};t.a=I},227:function(e,t,n){"use strict";function a(e,t){for(var n=e.matches||e.webkitMatchesSelector||e.mozMatchesSelector||e.msMatchesSelector,a=e;a;){if(n.call(a,t))return a;a=a.parentElement}return null}Object.defineProperty(t,"__esModule",{value:!0}),t.default=a,e.exports=t.default},228:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function o(e,t){var n;h&&(h.destroy(),h=null),p.default.newInstance({prefixCls:y,style:{},transitionName:"am-fade",className:(0,u.default)((n={},(0,s.default)(n,y+"-mask",e),(0,s.default)(n,y+"-nomask",!e),n))},function(e){return t&&t(e)})}function i(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:3,a=arguments[3],i=!(arguments.length>4&&void 0!==arguments[4])||arguments[4],r={info:"",success:"success",fail:"fail",offline:"dislike",loading:"loading"},s=r[t];o(i,function(t){h=t,t.notice({duration:n,style:{},content:s?d.default.createElement("div",{className:y+"-text "+y+"-text-icon",role:"alert","aria-live":"assertive"},d.default.createElement(v.default,{type:s,size:"lg"}),d.default.createElement("div",{className:y+"-text-info"},e)):d.default.createElement("div",{className:y+"-text",role:"alert","aria-live":"assertive"},d.default.createElement("div",null,e)),closable:!0,onClose:function(){a&&a(),t.destroy(),t=null,h=null}})})}Object.defineProperty(t,"__esModule",{value:!0});var r=n(20),s=a(r),l=n(8),u=a(l),c=n(0),d=a(c),f=n(233),p=a(f),m=n(60),v=a(m),h=void 0,y="am-toast";t.default={SHORT:3,LONG:8,show:function(e,t,n){return i(e,"info",t,function(){},n)},info:function(e,t,n,a){return i(e,"info",t,n,a)},success:function(e,t,n,a){return i(e,"success",t,n,a)},fail:function(e,t,n,a){return i(e,"fail",t,n,a)},offline:function(e,t,n,a){return i(e,"offline",t,n,a)},loading:function(e,t,n,a){return i(e,"loading",t,n,a)},hide:function(){h&&(h.destroy(),h=null)}},e.exports=t.default},229:function(e,t,n){"use strict";n(16),n(61),n(234)},230:function(e,t,n){"use strict";function a(e,t,n){e.addEventListener(t,n,!1)}function o(e,t,n){e.removeEventListener(t,n,!1)}function i(e,t){for(var n=window.getComputedStyle(e,null),a="",o=0;o<E.length&&!(a=n.getPropertyValue(E[o]+t));o++);return a}function r(e){if(h){var t=parseFloat(i(e,"transition-delay"))||0,n=parseFloat(i(e,"transition-duration"))||0,a=parseFloat(i(e,"animation-delay"))||0,o=parseFloat(i(e,"animation-duration"))||0,r=Math.max(n+t,o+a);e.rcEndAnimTimeout=setTimeout(function(){e.rcEndAnimTimeout=null,e.rcEndListener&&e.rcEndListener()},1e3*r+200)}}function s(e){e.rcEndAnimTimeout&&(clearTimeout(e.rcEndAnimTimeout),e.rcEndAnimTimeout=null)}var l=n(36),u=n.n(l),c={transitionend:{transition:"transitionend",WebkitTransition:"webkitTransitionEnd",MozTransition:"mozTransitionEnd",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd"},animationend:{animation:"animationend",WebkitAnimation:"webkitAnimationEnd",MozAnimation:"mozAnimationEnd",OAnimation:"oAnimationEnd",msAnimation:"MSAnimationEnd"}},d=[];"undefined"!=typeof window&&"undefined"!=typeof document&&function(){var e=document.createElement("div"),t=e.style;"AnimationEvent"in window||delete c.animationend.animation,"TransitionEvent"in window||delete c.transitionend.transition;for(var n in c)if(c.hasOwnProperty(n)){var a=c[n];for(var o in a)if(o in t){d.push(a[o]);break}}}();var f={addEndEventListener:function(e,t){if(0===d.length)return void window.setTimeout(t,0);d.forEach(function(n){a(e,n,t)})},endEvents:d,removeEndEventListener:function(e,t){0!==d.length&&d.forEach(function(n){o(e,n,t)})}},p=f,m=n(231),v=n.n(m);n.d(t,"b",function(){return h});var h=0!==p.endEvents.length,y=["Webkit","Moz","O","ms"],E=["-webkit-","-moz-","-o-","ms-",""],g=function(e,t,n){var a="object"===(void 0===t?"undefined":u()(t)),o=a?t.name:t,i=a?t.active:t+"-active",l=n,c=void 0,d=void 0,f=v()(e);return n&&"[object Object]"===Object.prototype.toString.call(n)&&(l=n.end,c=n.start,d=n.active),e.rcEndListener&&e.rcEndListener(),e.rcEndListener=function(t){t&&t.target!==e||(e.rcAnimTimeout&&(clearTimeout(e.rcAnimTimeout),e.rcAnimTimeout=null),s(e),f.remove(o),f.remove(i),p.removeEndEventListener(e,e.rcEndListener),e.rcEndListener=null,l&&l())},p.addEndEventListener(e,e.rcEndListener),c&&c(),f.add(o),e.rcAnimTimeout=setTimeout(function(){e.rcAnimTimeout=null,f.add(i),d&&setTimeout(d,0),r(e)},30),{stop:function(){e.rcEndListener&&e.rcEndListener()}}};g.style=function(e,t,n){e.rcEndListener&&e.rcEndListener(),e.rcEndListener=function(t){t&&t.target!==e||(e.rcAnimTimeout&&(clearTimeout(e.rcAnimTimeout),e.rcAnimTimeout=null),s(e),p.removeEndEventListener(e,e.rcEndListener),e.rcEndListener=null,n&&n())},p.addEndEventListener(e,e.rcEndListener),e.rcAnimTimeout=setTimeout(function(){for(var n in t)t.hasOwnProperty(n)&&(e.style[n]=t[n]);e.rcAnimTimeout=null,r(e)},0)},g.setTransition=function(e,t,n){var a=t,o=n;void 0===n&&(o=a,a=""),a=a||"",y.forEach(function(t){e.style[t+"Transition"+a]=o})},g.isCssAnimationSupported=h;t.a=g},231:function(e,t,n){function a(e){if(!e||!e.nodeType)throw new Error("A DOM element reference is required");this.el=e,this.list=e.classList}try{var o=n(224)}catch(e){var o=n(224)}var i=/\s+/,r=Object.prototype.toString;e.exports=function(e){return new a(e)},a.prototype.add=function(e){if(this.list)return this.list.add(e),this;var t=this.array();return~o(t,e)||t.push(e),this.el.className=t.join(" "),this},a.prototype.remove=function(e){if("[object RegExp]"==r.call(e))return this.removeMatching(e);if(this.list)return this.list.remove(e),this;var t=this.array(),n=o(t,e);return~n&&t.splice(n,1),this.el.className=t.join(" "),this},a.prototype.removeMatching=function(e){for(var t=this.array(),n=0;n<t.length;n++)e.test(t[n])&&this.remove(t[n]);return this},a.prototype.toggle=function(e,t){return this.list?(void 0!==t?t!==this.list.toggle(e,t)&&this.list.toggle(e):this.list.toggle(e),this):(void 0!==t?t?this.add(e):this.remove(e):this.has(e)?this.remove(e):this.add(e),this)},a.prototype.array=function(){var e=this.el.getAttribute("class")||"",t=e.replace(/^\s+|\s+$/g,""),n=t.split(i);return""===n[0]&&n.shift(),n},a.prototype.has=a.prototype.contains=function(e){return this.list?this.list.contains(e):!!~o(this.array(),e)}},233:function(e,t,n){"use strict";function a(){var e=[].slice.call(arguments,0);return 1===e.length?e[0]:function(){for(var t=0;t<e.length;t++)e[t]&&e[t].apply&&e[t].apply(this,arguments)}}function o(){return"rcNotification_"+S+"_"+L++}Object.defineProperty(t,"__esModule",{value:!0});var i=n(59),r=n.n(i),s=n(20),l=n.n(s),u=n(5),c=n.n(u),d=n(1),f=n.n(d),p=n(2),m=n.n(p),v=n(3),h=n.n(v),y=n(4),E=n.n(y),g=n(0),b=n.n(g),k=n(6),w=n.n(k),N=n(21),C=n.n(N),A=n(226),P=n(8),T=n.n(P),_=function(e){function t(){var e,n,a,o;f()(this,t);for(var i=arguments.length,r=Array(i),s=0;s<i;s++)r[s]=arguments[s];return n=a=h()(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(r))),a.close=function(){a.clearCloseTimer(),a.props.onClose()},a.startCloseTimer=function(){a.props.duration&&(a.closeTimer=setTimeout(function(){a.close()},1e3*a.props.duration))},a.clearCloseTimer=function(){a.closeTimer&&(clearTimeout(a.closeTimer),a.closeTimer=null)},o=n,h()(a,o)}return E()(t,e),m()(t,[{key:"componentDidMount",value:function(){this.startCloseTimer()}},{key:"componentWillUnmount",value:function(){this.clearCloseTimer()}},{key:"render",value:function(){var e,t=this.props,n=t.prefixCls+"-notice",a=(e={},l()(e,""+n,1),l()(e,n+"-closable",t.closable),l()(e,t.className,!!t.className),e);return b.a.createElement("div",{className:T()(a),style:t.style},b.a.createElement("div",{className:n+"-content"},t.children),t.closable?b.a.createElement("a",{tabIndex:"0",onClick:this.close,className:n+"-close"},b.a.createElement("span",{className:n+"-close-x"})):null)}}]),t}(g.Component);_.propTypes={duration:w.a.number,onClose:w.a.func,children:w.a.any},_.defaultProps={onEnd:function(){},onClose:function(){},duration:1.5,style:{right:"50%"}};var x=_,L=0,S=Date.now(),O=function(e){function t(){var e,n,a,i;f()(this,t);for(var r=arguments.length,s=Array(r),l=0;l<r;l++)s[l]=arguments[l];return n=a=h()(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(s))),a.state={notices:[]},a.add=function(e){var t=e.key=e.key||o();a.setState(function(n){var a=n.notices;if(!a.filter(function(e){return e.key===t}).length)return{notices:a.concat(e)}})},a.remove=function(e){a.setState(function(t){return{notices:t.notices.filter(function(t){return t.key!==e})}})},i=n,h()(a,i)}return E()(t,e),m()(t,[{key:"getTransitionName",value:function(){var e=this.props,t=e.transitionName;return!t&&e.animation&&(t=e.prefixCls+"-"+e.animation),t}},{key:"render",value:function(){var e,t=this,n=this.props,o=this.state.notices.map(function(e){var o=a(t.remove.bind(t,e.key),e.onClose);return b.a.createElement(x,c()({prefixCls:n.prefixCls},e,{onClose:o}),e.content)}),i=(e={},l()(e,n.prefixCls,1),l()(e,n.className,!!n.className),e);return b.a.createElement("div",{className:T()(i),style:n.style},b.a.createElement(A.a,{transitionName:this.getTransitionName()},o))}}]),t}(g.Component);O.propTypes={prefixCls:w.a.string,transitionName:w.a.string,animation:w.a.oneOfType([w.a.string,w.a.object]),style:w.a.object},O.defaultProps={prefixCls:"rmc-notification",animation:"fade",style:{top:65,left:"50%"}},O.newInstance=function(e,t){function n(e){l||(l=!0,t({notice:function(t){e.add(t)},removeNotice:function(t){e.remove(t)},component:e,destroy:function(){C.a.unmountComponentAtNode(s),o||document.body.removeChild(s)}}))}var a=e||{},o=a.getContainer,i=r()(a,["getContainer"]),s=void 0;o?s=o():(s=document.createElement("div"),document.body.appendChild(s));var l=!1;C.a.render(b.a.createElement(O,c()({},i,{ref:n})),s)};var M=O;t.default=M},234:function(e,t){},237:function(e,t,n){"use strict";function a(){}function o(){}Object.defineProperty(t,"__esModule",{value:!0});var i=n(5),r=n.n(i),s=n(1),l=n.n(s),u=n(2),c=n.n(u),d=n(3),f=n.n(d),p=n(4),m=n.n(p),v=n(0),h=n.n(v),y=n(21),E=n.n(y),g=n(226),b=function(e){function t(){return l()(this,t),f()(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return m()(t,e),c()(t,[{key:"shouldComponentUpdate",value:function(e){return!!e.hiddenClassName||!!e.visible}},{key:"render",value:function(){var e=this.props.className;this.props.hiddenClassName&&!this.props.visible&&(e+=" "+this.props.hiddenClassName);var t=r()({},this.props);return delete t.hiddenClassName,delete t.visible,t.className=e,h.a.createElement("div",r()({},t))}}]),t}(h.a.Component),k=b,w=function(e){function t(){l()(this,t);var e=f()(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments));return e.getDialogElement=function(){var t=e.props,n=t.closable,a=t.prefixCls,o=void 0;t.footer&&(o=h.a.createElement("div",{className:a+"-footer",ref:function(t){return e.footerRef=t}},t.footer));var i=void 0;t.title&&(i=h.a.createElement("div",{className:a+"-header",ref:function(t){return e.headerRef=t}},h.a.createElement("div",{className:a+"-title"},t.title)));var r=void 0;n&&(r=h.a.createElement("button",{onClick:e.close,"aria-label":"Close",className:a+"-close"},h.a.createElement("span",{className:a+"-close-x"})));var s=e.getTransitionName(),l=h.a.createElement(k,{key:"dialog-element",role:"document",ref:function(t){return e.dialogRef=t},style:t.style||{},className:a+" "+(t.className||""),visible:t.visible},h.a.createElement("div",{className:a+"-content"},r,i,h.a.createElement("div",{className:a+"-body",style:t.bodyStyle,ref:function(t){return e.bodyRef=t}},t.children),o));return h.a.createElement(g.a,{key:"dialog",showProp:"visible",onAppear:e.onAnimateAppear,onLeave:e.onAnimateLeave,transitionName:s,component:"",transitionAppear:!0},l)},e.onAnimateAppear=function(){document.body.style.overflow="hidden"},e.onAnimateLeave=function(){document.body.style.overflow="",e.wrapRef&&(e.wrapRef.style.display="none"),e.props.onAnimateLeave&&e.props.onAnimateLeave(),e.props.afterClose&&e.props.afterClose()},e.close=function(t){e.props.onClose&&e.props.onClose(t)},e.onMaskClick=function(t){t.target===t.currentTarget&&e.close(t)},e}return m()(t,e),c()(t,[{key:"componentWillUnmount",value:function(){document.body.style.overflow="",this.wrapRef&&(this.wrapRef.style.display="none")}},{key:"getZIndexStyle",value:function(){var e={},t=this.props;return void 0!==t.zIndex&&(e.zIndex=t.zIndex),e}},{key:"getWrapStyle",value:function(){var e=this.props.wrapStyle||{};return r()({},this.getZIndexStyle(),e)}},{key:"getMaskStyle",value:function(){var e=this.props.maskStyle||{};return r()({},this.getZIndexStyle(),e)}},{key:"getMaskTransitionName",value:function(){var e=this.props,t=e.maskTransitionName,n=e.maskAnimation;return!t&&n&&(t=e.prefixCls+"-"+n),t}},{key:"getTransitionName",value:function(){var e=this.props,t=e.transitionName,n=e.animation;return!t&&n&&(t=e.prefixCls+"-"+n),t}},{key:"getMaskElement",value:function(){var e=this.props,t=void 0;if(e.mask){var n=this.getMaskTransitionName();t=h.a.createElement(k,{style:this.getMaskStyle(),key:"mask-element",className:e.prefixCls+"-mask",hiddenClassName:e.prefixCls+"-mask-hidden",visible:e.visible}),n&&(t=h.a.createElement(g.a,{key:"mask",showProp:"visible",transitionAppear:!0,component:"",transitionName:n},t))}return t}},{key:"render",value:function(){var e=this,t=this.props,n=t.prefixCls,a=t.maskClosable,o=this.getWrapStyle();return t.visible&&(o.display=null),h.a.createElement("div",null,this.getMaskElement(),h.a.createElement("div",r()({className:n+"-wrap "+(t.wrapClassName||""),ref:function(t){return e.wrapRef=t},onClick:a?this.onMaskClick:void 0,role:"dialog","aria-labelledby":t.title,style:o},t.wrapProps),this.getDialogElement()))}}]),t}(h.a.Component),N=w;w.defaultProps={afterClose:a,className:"",mask:!0,visible:!1,closable:!0,maskClosable:!0,prefixCls:"rmc-dialog",onClose:a};var C=!!E.a.createPortal,A=function(e){function t(){l()(this,t);var e=f()(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments));return e.saveRef=function(t){C&&(e._component=t)},e.getComponent=function(t){var n=r()({},e.props);return["visible","onAnimateLeave"].forEach(function(e){n.hasOwnProperty(e)&&delete n[e]}),h.a.createElement(N,r()({},n,{visible:t,onAnimateLeave:e.removeContainer,ref:e.saveRef}))},e.removeContainer=function(){e.container&&(C||E.a.unmountComponentAtNode(e.container),e.container.parentNode.removeChild(e.container),e.container=null)},e.getContainer=function(){if(!e.container){var t=document.createElement("div"),n=e.props.prefixCls+"-container-"+(new Date).getTime();t.setAttribute("id",n),document.body.appendChild(t),e.container=t}return e.container},e}return m()(t,e),c()(t,[{key:"componentDidMount",value:function(){this.props.visible&&this.componentDidUpdate()}},{key:"shouldComponentUpdate",value:function(e){var t=e.visible;return!(!this.props.visible&&!t)}},{key:"componentWillUnmount",value:function(){this.props.visible?C?this.removeContainer():this.renderDialog(!1):this.removeContainer()}},{key:"componentDidUpdate",value:function(){C||this.renderDialog(this.props.visible)}},{key:"renderDialog",value:function(e){E.a.unstable_renderSubtreeIntoContainer(this,this.getComponent(e),this.getContainer())}},{key:"render",value:function(){var e=this.props.visible;return C&&(e||this._component)?E.a.createPortal(this.getComponent(e),this.getContainer()):null}}]),t}(h.a.Component);t.default=A;A.defaultProps={visible:!1,prefixCls:"rmc-dialog",onClose:o}},238:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(239),i=a(o),r=n(225),s=a(r),l=n(240),u=a(l),c=n(241),d=a(c);s.default.alert=i.default,s.default.prompt=d.default,s.default.operation=u.default,t.default=s.default,e.exports=t.default},239:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function o(e,t){function n(){l.default.unmountComponentAtNode(u),u&&u.parentNode&&u.parentNode.removeChild(u)}function a(e){if(/iPhone|iPod|iPad/i.test(navigator.userAgent)){(0,c.default)(e.target,"."+p+"-footer")||e.preventDefault()}}var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[{text:"确定"}],i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"ios",s=!1;if(!e&&!t)return{close:function(){}};var u=document.createElement("div");document.body.appendChild(u);var d=o.map(function(e){var t=e.onPress||function(){};return e.onPress=function(){if(!s){var e=t();e&&e.then?e.then(function(){s=!0,n()}).catch(function(){}):(s=!0,n())}},e}),p="am-modal";return l.default.render(r.default.createElement(f.default,{visible:!0,transparent:!0,title:e,transitionName:"am-zoom",closable:!1,maskClosable:!1,footer:d,maskTransitionName:"am-fade",platform:i,wrapProps:{onTouchStart:a}},r.default.createElement("div",{className:p+"-alert-content"},t)),u),{close:n}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=o;var i=n(0),r=a(i),s=n(21),l=a(s),u=n(227),c=a(u),d=n(225),f=a(d);e.exports=t.default},240:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function o(){function e(){l.default.unmountComponentAtNode(i),i&&i.parentNode&&i.parentNode.removeChild(i)}function t(e){if(/iPhone|iPod|iPad/i.test(navigator.userAgent)){(0,c.default)(e.target,".am-modal-footer")||e.preventDefault()}}var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[{text:"确定"}],a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"ios",o=!1,i=document.createElement("div");document.body.appendChild(i);var s=n.map(function(t){var n=t.onPress||function(){};return t.onPress=function(){if(!o){var t=n();t&&t.then?t.then(function(){o=!0,e()}).catch(function(){}):(o=!0,e())}},t});return l.default.render(r.default.createElement(f.default,{visible:!0,operation:!0,transparent:!0,prefixCls:"am-modal",transitionName:"am-zoom",closable:!1,maskClosable:!0,onClose:e,footer:s,maskTransitionName:"am-fade",className:"am-modal-operation",platform:a,wrapProps:{onTouchStart:t}}),i),{close:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=o;var i=n(0),r=a(i),s=n(21),l=a(s),u=n(227),c=a(u),d=n(225),f=a(d);e.exports=t.default},241:function(e,t,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function o(e,t,n){function a(e){var t=e.target,n=t.getAttribute("type");null!==n&&(E[n]=t.value)}function o(e){var t=e.currentTarget||e.target;t&&t.focus()}function i(){l.default.unmountComponentAtNode(w),w&&w.parentNode&&w.parentNode.removeChild(w)}function s(e){if("function"==typeof e){var t=E.text,n=void 0===t?"":t,a=E.password,o=void 0===a?"":a,i="login-password"===d?[n,o]:"secure-text"===d?[o]:[n];return e.apply(void 0,i)}}function u(e){if(/iPhone|iPod|iPad/i.test(navigator.userAgent)){(0,c.default)(e.target,"."+y+"-content")||e.preventDefault()}}var d=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"default",p=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"",m=arguments.length>5&&void 0!==arguments[5]?arguments[5]:["",""],v=arguments.length>6&&void 0!==arguments[6]?arguments[6]:"ios",h=!1;if(p="string"==typeof p?p:"number"==typeof p?""+p:"",!n)return{close:function(){}};var y="am-modal",E={text:p},g=void 0,b=function(e){setTimeout(function(){e&&e.focus()},500)};switch(d){case"login-password":g=r.default.createElement("div",{className:y+"-input-container"},r.default.createElement("div",{className:y+"-input"},r.default.createElement("label",null,r.default.createElement("input",{type:"text",defaultValue:E.text,ref:function(e){return b(e)},onClick:o,onChange:a,placeholder:m[0]}))),r.default.createElement("div",{className:y+"-input"},r.default.createElement("label",null,r.default.createElement("input",{type:"password",defaultValue:E.password,onClick:o,onChange:a,placeholder:m[1]}))));break;case"secure-text":g=r.default.createElement("div",{className:y+"-input-container"},r.default.createElement("div",{className:y+"-input"},r.default.createElement("label",null,r.default.createElement("input",{type:"password",defaultValue:E.password,ref:function(e){return b(e)},onClick:o,onChange:a,placeholder:m[0]}))));break;case"default":default:g=r.default.createElement("div",{className:y+"-input-container"},r.default.createElement("div",{className:y+"-input"},r.default.createElement("label",null,r.default.createElement("input",{type:"text",defaultValue:E.text,ref:function(e){return b(e)},onClick:o,onChange:a,placeholder:m[0]}))))}var k=r.default.createElement("div",null,t,g),w=document.createElement("div");document.body.appendChild(w);var N=void 0;N="function"==typeof n?[{text:"取消",onPress:function(){}},{text:"确定",onPress:function(){s(n)}}]:n.map(function(e){return{text:e.text,onPress:function(){return s(e.onPress)}}});var C=N.map(function(e){var t=e.onPress||function(){};return e.onPress=function(){if(!h){var e=t();e&&e.then?e.then(function(){h=!0,i()}).catch(function(){}):(h=!0,i())}},e});return l.default.render(r.default.createElement(f.default,{visible:!0,transparent:!0,prefixCls:y,title:e,closable:!1,maskClosable:!1,transitionName:"am-zoom",footer:C,maskTransitionName:"am-fade",platform:v,wrapProps:{onTouchStart:u}},r.default.createElement("div",{className:y+"-propmt-content"},k)),w),{close:i}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=o;var i=n(0),r=a(i),s=n(21),l=a(s),u=n(227),c=a(u),d=n(225),f=a(d);e.exports=t.default},242:function(e,t,n){"use strict";n(16),n(243)},243:function(e,t){},695:function(e,t){}});