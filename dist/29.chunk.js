webpackJsonp([29],{207:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var r=t(232),o=i(r),a=t(1),s=i(a),l=t(2),c=i(l),u=t(3),f=i(u),p=t(4),d=i(p);t(233);var m=t(0),h=i(m);t(689);var v,y=function(e){function n(e){(0,s.default)(this,n);var t=(0,f.default)(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,e));return v=t,t.state={userId:"",clientHeight:document.body.clientHeight},t}return(0,d.default)(n,e),(0,c.default)(n,[{key:"componentWillMount",value:function(){document.title="权限管理"}},{key:"componentDidMount",value:function(){var e=window.location.href,n=e.substr(e.indexOf("?")+1),t=n.split("&"),i=t[0].split("=")[1];this.getAllPowersByUserId(i),this.setState({userId:i})}},{key:"getAllPowersByUserId",value:function(e){var n=this,t={method:"getAllPowersByUserId",userId:e,pageNo:-1};WebServiceUtil.requestLittleAntApi(JSON.stringify(t),{onResponse:function(e){"调用成功"==e.msg&&1==e.success?0!=e.response.length&&n.buildList(e.response):o.default.fail(e.msg)},onError:function(e){o.default.fail(e,1)}})}},{key:"buildList",value:function(e){var n=[];e.forEach(function(e,t){console.log(e),n.push(h.default.createElement("li",{key:e.powerId,onClick:v.listOnClick.bind(this,e.powerUrl)},h.default.createElement("img",{src:e.iconUrl,alt:""}),h.default.createElement("span",{className:"textOver"},e.powerName)))}),this.setState({listArr:n})}},{key:"listOnClick",value:function(e){console.log(e);var n=e+"?ident="+v.state.userId,t={method:"openNewPage",url:n};Bridge.callHandler(t,null,function(e){window.location.href=n})}},{key:"render",value:function(){return h.default.createElement("div",{id:"powerList"},h.default.createElement("div",{className:"my_flex listCont",style:{height:this.state.clientHeight-20}},this.state.listArr))}}]),n}(h.default.Component);n.default=y},228:function(e,n){e.exports=function(e,n){if(e.indexOf)return e.indexOf(n);for(var t=0;t<e.length;++t)if(e[t]===n)return t;return-1}},230:function(e,n,t){"use strict";function i(e){var n=[];return b.a.Children.forEach(e,function(e){n.push(e)}),n}function r(e,n){var t=null;return e&&e.forEach(function(e){t||e&&e.key===n&&(t=e)}),t}function o(e,n,t){var i=null;return e&&e.forEach(function(e){if(e&&e.key===n&&e.props[t]){if(i)throw new Error("two child with same key for <rc-animate> children");i=e}}),i}function a(e,n,t){var i=e.length===n.length;return i&&e.forEach(function(e,r){var o=n[r];e&&o&&(e&&!o||!e&&o?i=!1:e.key!==o.key?i=!1:t&&e.props[t]!==o.props[t]&&(i=!1))}),i}function s(e,n){var t=[],i={},o=[];return e.forEach(function(e){e&&r(n,e.key)?o.length&&(i[e.key]=o,o=[]):o.push(e)}),n.forEach(function(e){e&&i.hasOwnProperty(e.key)&&(t=t.concat(i[e.key])),t.push(e)}),t=t.concat(o)}function l(e){var n=e.children;return b.a.isValidElement(n)&&!n.key?b.a.cloneElement(n,{key:D}):n}function c(){}var u=t(5),f=t.n(u),p=t(20),d=t.n(p),m=t(1),h=t.n(m),v=t(2),y=t.n(v),E=t(3),g=t.n(E),k=t(4),A=t.n(k),T=t(0),b=t.n(T),L=t(6),w=t.n(L),C=t(36),N=t.n(C),O=t(21),_=t.n(O),x=t(234),P={isAppearSupported:function(e){return e.transitionName&&e.transitionAppear||e.animation.appear},isEnterSupported:function(e){return e.transitionName&&e.transitionEnter||e.animation.enter},isLeaveSupported:function(e){return e.transitionName&&e.transitionLeave||e.animation.leave},allowAppearCallback:function(e){return e.transitionAppear||e.animation.appear},allowEnterCallback:function(e){return e.transitionEnter||e.animation.enter},allowLeaveCallback:function(e){return e.transitionLeave||e.animation.leave}},j=P,S={enter:"transitionEnter",appear:"transitionAppear",leave:"transitionLeave"},M=function(e){function n(){return h()(this,n),g()(this,(n.__proto__||Object.getPrototypeOf(n)).apply(this,arguments))}return A()(n,e),y()(n,[{key:"componentWillUnmount",value:function(){this.stop()}},{key:"componentWillEnter",value:function(e){j.isEnterSupported(this.props)?this.transition("enter",e):e()}},{key:"componentWillAppear",value:function(e){j.isAppearSupported(this.props)?this.transition("appear",e):e()}},{key:"componentWillLeave",value:function(e){j.isLeaveSupported(this.props)?this.transition("leave",e):e()}},{key:"transition",value:function(e,n){var t=this,i=_.a.findDOMNode(this),r=this.props,o=r.transitionName,a="object"===(void 0===o?"undefined":N()(o));this.stop();var s=function(){t.stopper=null,n()};if((x.b||!r.animation[e])&&o&&r[S[e]]){var l=a?o[e]:o+"-"+e,c=l+"-active";a&&o[e+"Active"]&&(c=o[e+"Active"]),this.stopper=Object(x.a)(i,{name:l,active:c},s)}else this.stopper=r.animation[e](i,s)}},{key:"stop",value:function(){var e=this.stopper;e&&(this.stopper=null,e.stop())}},{key:"render",value:function(){return this.props.children}}]),n}(b.a.Component);M.propTypes={children:w.a.any};var W=M,D="rc_animate_"+Date.now(),R=function(e){function n(e){h()(this,n);var t=g()(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,e));return K.call(t),t.currentlyAnimatingKeys={},t.keysToEnter=[],t.keysToLeave=[],t.state={children:i(l(e))},t.childrenRefs={},t}return A()(n,e),y()(n,[{key:"componentDidMount",value:function(){var e=this,n=this.props.showProp,t=this.state.children;n&&(t=t.filter(function(e){return!!e.props[n]})),t.forEach(function(n){n&&e.performAppear(n.key)})}},{key:"componentWillReceiveProps",value:function(e){var n=this;this.nextProps=e;var t=i(l(e)),a=this.props;a.exclusive&&Object.keys(this.currentlyAnimatingKeys).forEach(function(e){n.stop(e)});var c=a.showProp,u=this.currentlyAnimatingKeys,f=a.exclusive?i(l(a)):this.state.children,p=[];c?(f.forEach(function(e){var n=e&&r(t,e.key),i=void 0;(i=n&&n.props[c]||!e.props[c]?n:b.a.cloneElement(n||e,d()({},c,!0)))&&p.push(i)}),t.forEach(function(e){e&&r(f,e.key)||p.push(e)})):p=s(f,t),this.setState({children:p}),t.forEach(function(e){var t=e&&e.key;if(!e||!u[t]){var i=e&&r(f,t);if(c){var a=e.props[c];if(i){!o(f,t,c)&&a&&n.keysToEnter.push(t)}else a&&n.keysToEnter.push(t)}else i||n.keysToEnter.push(t)}}),f.forEach(function(e){var i=e&&e.key;if(!e||!u[i]){var a=e&&r(t,i);if(c){var s=e.props[c];if(a){!o(t,i,c)&&s&&n.keysToLeave.push(i)}else s&&n.keysToLeave.push(i)}else a||n.keysToLeave.push(i)}})}},{key:"componentDidUpdate",value:function(){var e=this.keysToEnter;this.keysToEnter=[],e.forEach(this.performEnter);var n=this.keysToLeave;this.keysToLeave=[],n.forEach(this.performLeave)}},{key:"isValidChildByKey",value:function(e,n){var t=this.props.showProp;return t?o(e,n,t):r(e,n)}},{key:"stop",value:function(e){delete this.currentlyAnimatingKeys[e];var n=this.childrenRefs[e];n&&n.stop()}},{key:"render",value:function(){var e=this,n=this.props;this.nextProps=n;var t=this.state.children,i=null;t&&(i=t.map(function(t){if(null===t||void 0===t)return t;if(!t.key)throw new Error("must set key for <rc-animate> children");return b.a.createElement(W,{key:t.key,ref:function(n){return e.childrenRefs[t.key]=n},animation:n.animation,transitionName:n.transitionName,transitionEnter:n.transitionEnter,transitionAppear:n.transitionAppear,transitionLeave:n.transitionLeave},t)}));var r=n.component;if(r){var o=n;return"string"==typeof r&&(o=f()({className:n.className,style:n.style},n.componentProps)),b.a.createElement(r,o,i)}return i[0]||null}}]),n}(b.a.Component);R.isAnimate=!0,R.propTypes={component:w.a.any,componentProps:w.a.object,animation:w.a.object,transitionName:w.a.oneOfType([w.a.string,w.a.object]),transitionEnter:w.a.bool,transitionAppear:w.a.bool,exclusive:w.a.bool,transitionLeave:w.a.bool,onEnd:w.a.func,onEnter:w.a.func,onLeave:w.a.func,onAppear:w.a.func,showProp:w.a.string},R.defaultProps={animation:{},component:"span",componentProps:{},transitionEnter:!0,transitionLeave:!0,transitionAppear:!1,onEnd:c,onEnter:c,onLeave:c,onAppear:c};var K=function(){var e=this;this.performEnter=function(n){e.childrenRefs[n]&&(e.currentlyAnimatingKeys[n]=!0,e.childrenRefs[n].componentWillEnter(e.handleDoneAdding.bind(e,n,"enter")))},this.performAppear=function(n){e.childrenRefs[n]&&(e.currentlyAnimatingKeys[n]=!0,e.childrenRefs[n].componentWillAppear(e.handleDoneAdding.bind(e,n,"appear")))},this.handleDoneAdding=function(n,t){var r=e.props;if(delete e.currentlyAnimatingKeys[n],!r.exclusive||r===e.nextProps){var o=i(l(r));e.isValidChildByKey(o,n)?"appear"===t?j.allowAppearCallback(r)&&(r.onAppear(n),r.onEnd(n,!0)):j.allowEnterCallback(r)&&(r.onEnter(n),r.onEnd(n,!0)):e.performLeave(n)}},this.performLeave=function(n){e.childrenRefs[n]&&(e.currentlyAnimatingKeys[n]=!0,e.childrenRefs[n].componentWillLeave(e.handleDoneLeaving.bind(e,n)))},this.handleDoneLeaving=function(n){var t=e.props;if(delete e.currentlyAnimatingKeys[n],!t.exclusive||t===e.nextProps){var r=i(l(t));if(e.isValidChildByKey(r,n))e.performEnter(n);else{var o=function(){j.allowLeaveCallback(t)&&(t.onLeave(n),t.onEnd(n,!1))};a(e.state.children,r,t.showProp)?o():e.setState({children:r},o)}}}};n.a=R},232:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e,n){var t;v&&(v.destroy(),v=null),d.default.newInstance({prefixCls:y,style:{},transitionName:"am-fade",className:(0,c.default)((t={},(0,s.default)(t,y+"-mask",e),(0,s.default)(t,y+"-nomask",!e),t))},function(e){return n&&n(e)})}function o(e,n){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:3,i=arguments[3],o=!(arguments.length>4&&void 0!==arguments[4])||arguments[4],a={info:"",success:"success",fail:"fail",offline:"dislike",loading:"loading"},s=a[n];r(o,function(n){v=n,n.notice({duration:t,style:{},content:s?f.default.createElement("div",{className:y+"-text "+y+"-text-icon",role:"alert","aria-live":"assertive"},f.default.createElement(h.default,{type:s,size:"lg"}),f.default.createElement("div",{className:y+"-text-info"},e)):f.default.createElement("div",{className:y+"-text",role:"alert","aria-live":"assertive"},f.default.createElement("div",null,e)),closable:!0,onClose:function(){i&&i(),n.destroy(),n=null,v=null}})})}Object.defineProperty(n,"__esModule",{value:!0});var a=t(20),s=i(a),l=t(8),c=i(l),u=t(0),f=i(u),p=t(236),d=i(p),m=t(60),h=i(m),v=void 0,y="am-toast";n.default={SHORT:3,LONG:8,show:function(e,n,t){return o(e,"info",n,function(){},t)},info:function(e,n,t,i){return o(e,"info",n,t,i)},success:function(e,n,t,i){return o(e,"success",n,t,i)},fail:function(e,n,t,i){return o(e,"fail",n,t,i)},offline:function(e,n,t,i){return o(e,"offline",n,t,i)},loading:function(e,n,t,i){return o(e,"loading",n,t,i)},hide:function(){v&&(v.destroy(),v=null)}},e.exports=n.default},233:function(e,n,t){"use strict";t(16),t(61),t(237)},234:function(e,n,t){"use strict";function i(e,n,t){e.addEventListener(n,t,!1)}function r(e,n,t){e.removeEventListener(n,t,!1)}function o(e,n){for(var t=window.getComputedStyle(e,null),i="",r=0;r<E.length&&!(i=t.getPropertyValue(E[r]+n));r++);return i}function a(e){if(v){var n=parseFloat(o(e,"transition-delay"))||0,t=parseFloat(o(e,"transition-duration"))||0,i=parseFloat(o(e,"animation-delay"))||0,r=parseFloat(o(e,"animation-duration"))||0,a=Math.max(t+n,r+i);e.rcEndAnimTimeout=setTimeout(function(){e.rcEndAnimTimeout=null,e.rcEndListener&&e.rcEndListener()},1e3*a+200)}}function s(e){e.rcEndAnimTimeout&&(clearTimeout(e.rcEndAnimTimeout),e.rcEndAnimTimeout=null)}var l=t(36),c=t.n(l),u={transitionend:{transition:"transitionend",WebkitTransition:"webkitTransitionEnd",MozTransition:"mozTransitionEnd",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd"},animationend:{animation:"animationend",WebkitAnimation:"webkitAnimationEnd",MozAnimation:"mozAnimationEnd",OAnimation:"oAnimationEnd",msAnimation:"MSAnimationEnd"}},f=[];"undefined"!=typeof window&&"undefined"!=typeof document&&function(){var e=document.createElement("div"),n=e.style;"AnimationEvent"in window||delete u.animationend.animation,"TransitionEvent"in window||delete u.transitionend.transition;for(var t in u)if(u.hasOwnProperty(t)){var i=u[t];for(var r in i)if(r in n){f.push(i[r]);break}}}();var p={addEndEventListener:function(e,n){if(0===f.length)return void window.setTimeout(n,0);f.forEach(function(t){i(e,t,n)})},endEvents:f,removeEndEventListener:function(e,n){0!==f.length&&f.forEach(function(t){r(e,t,n)})}},d=p,m=t(235),h=t.n(m);t.d(n,"b",function(){return v});var v=0!==d.endEvents.length,y=["Webkit","Moz","O","ms"],E=["-webkit-","-moz-","-o-","ms-",""],g=function(e,n,t){var i="object"===(void 0===n?"undefined":c()(n)),r=i?n.name:n,o=i?n.active:n+"-active",l=t,u=void 0,f=void 0,p=h()(e);return t&&"[object Object]"===Object.prototype.toString.call(t)&&(l=t.end,u=t.start,f=t.active),e.rcEndListener&&e.rcEndListener(),e.rcEndListener=function(n){n&&n.target!==e||(e.rcAnimTimeout&&(clearTimeout(e.rcAnimTimeout),e.rcAnimTimeout=null),s(e),p.remove(r),p.remove(o),d.removeEndEventListener(e,e.rcEndListener),e.rcEndListener=null,l&&l())},d.addEndEventListener(e,e.rcEndListener),u&&u(),p.add(r),e.rcAnimTimeout=setTimeout(function(){e.rcAnimTimeout=null,p.add(o),f&&setTimeout(f,0),a(e)},30),{stop:function(){e.rcEndListener&&e.rcEndListener()}}};g.style=function(e,n,t){e.rcEndListener&&e.rcEndListener(),e.rcEndListener=function(n){n&&n.target!==e||(e.rcAnimTimeout&&(clearTimeout(e.rcAnimTimeout),e.rcAnimTimeout=null),s(e),d.removeEndEventListener(e,e.rcEndListener),e.rcEndListener=null,t&&t())},d.addEndEventListener(e,e.rcEndListener),e.rcAnimTimeout=setTimeout(function(){for(var t in n)n.hasOwnProperty(t)&&(e.style[t]=n[t]);e.rcAnimTimeout=null,a(e)},0)},g.setTransition=function(e,n,t){var i=n,r=t;void 0===t&&(r=i,i=""),i=i||"",y.forEach(function(n){e.style[n+"Transition"+i]=r})},g.isCssAnimationSupported=v;n.a=g},235:function(e,n,t){function i(e){if(!e||!e.nodeType)throw new Error("A DOM element reference is required");this.el=e,this.list=e.classList}try{var r=t(228)}catch(e){var r=t(228)}var o=/\s+/,a=Object.prototype.toString;e.exports=function(e){return new i(e)},i.prototype.add=function(e){if(this.list)return this.list.add(e),this;var n=this.array();return~r(n,e)||n.push(e),this.el.className=n.join(" "),this},i.prototype.remove=function(e){if("[object RegExp]"==a.call(e))return this.removeMatching(e);if(this.list)return this.list.remove(e),this;var n=this.array(),t=r(n,e);return~t&&n.splice(t,1),this.el.className=n.join(" "),this},i.prototype.removeMatching=function(e){for(var n=this.array(),t=0;t<n.length;t++)e.test(n[t])&&this.remove(n[t]);return this},i.prototype.toggle=function(e,n){return this.list?(void 0!==n?n!==this.list.toggle(e,n)&&this.list.toggle(e):this.list.toggle(e),this):(void 0!==n?n?this.add(e):this.remove(e):this.has(e)?this.remove(e):this.add(e),this)},i.prototype.array=function(){var e=this.el.getAttribute("class")||"",n=e.replace(/^\s+|\s+$/g,""),t=n.split(o);return""===t[0]&&t.shift(),t},i.prototype.has=i.prototype.contains=function(e){return this.list?this.list.contains(e):!!~r(this.array(),e)}},236:function(e,n,t){"use strict";function i(){var e=[].slice.call(arguments,0);return 1===e.length?e[0]:function(){for(var n=0;n<e.length;n++)e[n]&&e[n].apply&&e[n].apply(this,arguments)}}function r(){return"rcNotification_"+P+"_"+x++}Object.defineProperty(n,"__esModule",{value:!0});var o=t(59),a=t.n(o),s=t(20),l=t.n(s),c=t(5),u=t.n(c),f=t(1),p=t.n(f),d=t(2),m=t.n(d),h=t(3),v=t.n(h),y=t(4),E=t.n(y),g=t(0),k=t.n(g),A=t(6),T=t.n(A),b=t(21),L=t.n(b),w=t(230),C=t(8),N=t.n(C),O=function(e){function n(){var e,t,i,r;p()(this,n);for(var o=arguments.length,a=Array(o),s=0;s<o;s++)a[s]=arguments[s];return t=i=v()(this,(e=n.__proto__||Object.getPrototypeOf(n)).call.apply(e,[this].concat(a))),i.close=function(){i.clearCloseTimer(),i.props.onClose()},i.startCloseTimer=function(){i.props.duration&&(i.closeTimer=setTimeout(function(){i.close()},1e3*i.props.duration))},i.clearCloseTimer=function(){i.closeTimer&&(clearTimeout(i.closeTimer),i.closeTimer=null)},r=t,v()(i,r)}return E()(n,e),m()(n,[{key:"componentDidMount",value:function(){this.startCloseTimer()}},{key:"componentWillUnmount",value:function(){this.clearCloseTimer()}},{key:"render",value:function(){var e,n=this.props,t=n.prefixCls+"-notice",i=(e={},l()(e,""+t,1),l()(e,t+"-closable",n.closable),l()(e,n.className,!!n.className),e);return k.a.createElement("div",{className:N()(i),style:n.style},k.a.createElement("div",{className:t+"-content"},n.children),n.closable?k.a.createElement("a",{tabIndex:"0",onClick:this.close,className:t+"-close"},k.a.createElement("span",{className:t+"-close-x"})):null)}}]),n}(g.Component);O.propTypes={duration:T.a.number,onClose:T.a.func,children:T.a.any},O.defaultProps={onEnd:function(){},onClose:function(){},duration:1.5,style:{right:"50%"}};var _=O,x=0,P=Date.now(),j=function(e){function n(){var e,t,i,o;p()(this,n);for(var a=arguments.length,s=Array(a),l=0;l<a;l++)s[l]=arguments[l];return t=i=v()(this,(e=n.__proto__||Object.getPrototypeOf(n)).call.apply(e,[this].concat(s))),i.state={notices:[]},i.add=function(e){var n=e.key=e.key||r();i.setState(function(t){var i=t.notices;if(!i.filter(function(e){return e.key===n}).length)return{notices:i.concat(e)}})},i.remove=function(e){i.setState(function(n){return{notices:n.notices.filter(function(n){return n.key!==e})}})},o=t,v()(i,o)}return E()(n,e),m()(n,[{key:"getTransitionName",value:function(){var e=this.props,n=e.transitionName;return!n&&e.animation&&(n=e.prefixCls+"-"+e.animation),n}},{key:"render",value:function(){var e,n=this,t=this.props,r=this.state.notices.map(function(e){var r=i(n.remove.bind(n,e.key),e.onClose);return k.a.createElement(_,u()({prefixCls:t.prefixCls},e,{onClose:r}),e.content)}),o=(e={},l()(e,t.prefixCls,1),l()(e,t.className,!!t.className),e);return k.a.createElement("div",{className:N()(o),style:t.style},k.a.createElement(w.a,{transitionName:this.getTransitionName()},r))}}]),n}(g.Component);j.propTypes={prefixCls:T.a.string,transitionName:T.a.string,animation:T.a.oneOfType([T.a.string,T.a.object]),style:T.a.object},j.defaultProps={prefixCls:"rmc-notification",animation:"fade",style:{top:65,left:"50%"}},j.newInstance=function(e,n){function t(e){l||(l=!0,n({notice:function(n){e.add(n)},removeNotice:function(n){e.remove(n)},component:e,destroy:function(){L.a.unmountComponentAtNode(s),r||document.body.removeChild(s)}}))}var i=e||{},r=i.getContainer,o=a()(i,["getContainer"]),s=void 0;r?s=r():(s=document.createElement("div"),document.body.appendChild(s));var l=!1;L.a.render(k.a.createElement(j,u()({},o,{ref:t})),s)};var S=j;n.default=S},237:function(e,n){},689:function(e,n){}});