webpackJsonp([28],{215:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var r=t(228),o=i(r),a=t(1),s=i(a),c=t(2),l=i(c),u=t(3),f=i(u),p=t(4),d=i(p);t(229);var m=t(0),v=i(m);t(711);var h,y=function(e){function n(e){(0,s.default)(this,n);var t=(0,f.default)(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,e));return h=t,t.state={loginUser:{}},t}return(0,d.default)(n,e),(0,l.default)(n,[{key:"componentDidMount",value:function(){var e=this;document.title="发布文章";var n=window.location.href,t=n.substr(n.indexOf("?")+1),i=t.split("&"),r=i[0].split("=")[1];setTimeout(function(){h.getLittleVideoUserById(r)},100),window.addEventListener("message",function(n){e.onMessage(n)})}},{key:"onMessage",value:function(e){if(e.data){var n=JSON.parse(e.data);"mobile-submit"==n.method?h.saveArticleInfo(n.article):"unloadFilesForEdit"==n.method&&Bridge.callHandler(n,function(e){var n=document.getElementById("iframe_mobile"),t={method:"callbackSrc",res:e};n.contentWindow.postMessage(JSON.stringify(t),"*")},function(e){console.log(e)})}}},{key:"saveArticleInfo",value:function(e){var n=[],t=e.attacheMents,i=[];for(var r in t)i.push({userId:h.state.loginUser.uid,type:"image"==t[r].type?0:1,path:t[r].path,coverPath:t[r].cover,isCover:t[r].isMainCover}),t[r].isMainCover&&n.push(t[r].cover);this.saveArticleInfoFinal(e.title,e.content,e.author,e.type,n,i)}},{key:"saveArticleInfoFinal",value:function(e,n,t,i,r,a){var s={method:"saveArticleInfo",articleInfoJson:{userId:this.state.loginUser.uid,schoolId:this.state.loginUser.schoolId,gradeId:this.state.loginUser.gradeId,status:i,articleTitle:e,articleContent:n,author:t,articleAttachments:WebServiceUtil.isEmpty(a)?[]:a}};WebServiceUtil.requestLittleAntApi(JSON.stringify(s),{onResponse:function(e){e.success?(o.default.info(0==i?"保存成功":"发布成功",1),setTimeout(function(){var e={method:"finish"};Bridge.callHandler(e,null,function(e){console.log(e)})},1e3)):o.default.fail("保存/发布失败")},onError:function(e){o.default.fail(e,1)}})}},{key:"getLittleVideoUserById",value:function(e){var n={method:"getLittleVideoUserById",uid:e};WebServiceUtil.requestLittleAntApi(JSON.stringify(n),{onResponse:function(e){e.success&&h.setState({loginUser:e.response})},onError:function(e){}})}},{key:"render",value:function(){return v.default.createElement("div",{id:"mobileEditor"},v.default.createElement("iframe",{id:"iframe_mobile",className:"mobile-iframe",src:"http://jiaoxue.maaee.com:8094/richTextMobileEditor/",frameborder:"0"}))}}]),n}(v.default.Component);n.default=y},224:function(e,n){e.exports=function(e,n){if(e.indexOf)return e.indexOf(n);for(var t=0;t<e.length;++t)if(e[t]===n)return t;return-1}},226:function(e,n,t){"use strict";function i(e){var n=[];return b.a.Children.forEach(e,function(e){n.push(e)}),n}function r(e,n){var t=null;return e&&e.forEach(function(e){t||e&&e.key===n&&(t=e)}),t}function o(e,n,t){var i=null;return e&&e.forEach(function(e){if(e&&e.key===n&&e.props[t]){if(i)throw new Error("two child with same key for <rc-animate> children");i=e}}),i}function a(e,n,t){var i=e.length===n.length;return i&&e.forEach(function(e,r){var o=n[r];e&&o&&(e&&!o||!e&&o?i=!1:e.key!==o.key?i=!1:t&&e.props[t]!==o.props[t]&&(i=!1))}),i}function s(e,n){var t=[],i={},o=[];return e.forEach(function(e){e&&r(n,e.key)?o.length&&(i[e.key]=o,o=[]):o.push(e)}),n.forEach(function(e){e&&i.hasOwnProperty(e.key)&&(t=t.concat(i[e.key])),t.push(e)}),t=t.concat(o)}function c(e){var n=e.children;return b.a.isValidElement(n)&&!n.key?b.a.cloneElement(n,{key:W}):n}function l(){}var u=t(5),f=t.n(u),p=t(20),d=t.n(p),m=t(1),v=t.n(m),h=t(2),y=t.n(h),E=t(3),g=t.n(E),k=t(4),A=t.n(k),T=t(0),b=t.n(T),L=t(6),w=t.n(L),C=t(36),N=t.n(C),O=t(21),_=t.n(O),x=t(230),P={isAppearSupported:function(e){return e.transitionName&&e.transitionAppear||e.animation.appear},isEnterSupported:function(e){return e.transitionName&&e.transitionEnter||e.animation.enter},isLeaveSupported:function(e){return e.transitionName&&e.transitionLeave||e.animation.leave},allowAppearCallback:function(e){return e.transitionAppear||e.animation.appear},allowEnterCallback:function(e){return e.transitionEnter||e.animation.enter},allowLeaveCallback:function(e){return e.transitionLeave||e.animation.leave}},S=P,j={enter:"transitionEnter",appear:"transitionAppear",leave:"transitionLeave"},M=function(e){function n(){return v()(this,n),g()(this,(n.__proto__||Object.getPrototypeOf(n)).apply(this,arguments))}return A()(n,e),y()(n,[{key:"componentWillUnmount",value:function(){this.stop()}},{key:"componentWillEnter",value:function(e){S.isEnterSupported(this.props)?this.transition("enter",e):e()}},{key:"componentWillAppear",value:function(e){S.isAppearSupported(this.props)?this.transition("appear",e):e()}},{key:"componentWillLeave",value:function(e){S.isLeaveSupported(this.props)?this.transition("leave",e):e()}},{key:"transition",value:function(e,n){var t=this,i=_.a.findDOMNode(this),r=this.props,o=r.transitionName,a="object"===(void 0===o?"undefined":N()(o));this.stop();var s=function(){t.stopper=null,n()};if((x.b||!r.animation[e])&&o&&r[j[e]]){var c=a?o[e]:o+"-"+e,l=c+"-active";a&&o[e+"Active"]&&(l=o[e+"Active"]),this.stopper=Object(x.a)(i,{name:c,active:l},s)}else this.stopper=r.animation[e](i,s)}},{key:"stop",value:function(){var e=this.stopper;e&&(this.stopper=null,e.stop())}},{key:"render",value:function(){return this.props.children}}]),n}(b.a.Component);M.propTypes={children:w.a.any};var I=M,W="rc_animate_"+Date.now(),U=function(e){function n(e){v()(this,n);var t=g()(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,e));return R.call(t),t.currentlyAnimatingKeys={},t.keysToEnter=[],t.keysToLeave=[],t.state={children:i(c(e))},t.childrenRefs={},t}return A()(n,e),y()(n,[{key:"componentDidMount",value:function(){var e=this,n=this.props.showProp,t=this.state.children;n&&(t=t.filter(function(e){return!!e.props[n]})),t.forEach(function(n){n&&e.performAppear(n.key)})}},{key:"componentWillReceiveProps",value:function(e){var n=this;this.nextProps=e;var t=i(c(e)),a=this.props;a.exclusive&&Object.keys(this.currentlyAnimatingKeys).forEach(function(e){n.stop(e)});var l=a.showProp,u=this.currentlyAnimatingKeys,f=a.exclusive?i(c(a)):this.state.children,p=[];l?(f.forEach(function(e){var n=e&&r(t,e.key),i=void 0;(i=n&&n.props[l]||!e.props[l]?n:b.a.cloneElement(n||e,d()({},l,!0)))&&p.push(i)}),t.forEach(function(e){e&&r(f,e.key)||p.push(e)})):p=s(f,t),this.setState({children:p}),t.forEach(function(e){var t=e&&e.key;if(!e||!u[t]){var i=e&&r(f,t);if(l){var a=e.props[l];if(i){!o(f,t,l)&&a&&n.keysToEnter.push(t)}else a&&n.keysToEnter.push(t)}else i||n.keysToEnter.push(t)}}),f.forEach(function(e){var i=e&&e.key;if(!e||!u[i]){var a=e&&r(t,i);if(l){var s=e.props[l];if(a){!o(t,i,l)&&s&&n.keysToLeave.push(i)}else s&&n.keysToLeave.push(i)}else a||n.keysToLeave.push(i)}})}},{key:"componentDidUpdate",value:function(){var e=this.keysToEnter;this.keysToEnter=[],e.forEach(this.performEnter);var n=this.keysToLeave;this.keysToLeave=[],n.forEach(this.performLeave)}},{key:"isValidChildByKey",value:function(e,n){var t=this.props.showProp;return t?o(e,n,t):r(e,n)}},{key:"stop",value:function(e){delete this.currentlyAnimatingKeys[e];var n=this.childrenRefs[e];n&&n.stop()}},{key:"render",value:function(){var e=this,n=this.props;this.nextProps=n;var t=this.state.children,i=null;t&&(i=t.map(function(t){if(null===t||void 0===t)return t;if(!t.key)throw new Error("must set key for <rc-animate> children");return b.a.createElement(I,{key:t.key,ref:function(n){return e.childrenRefs[t.key]=n},animation:n.animation,transitionName:n.transitionName,transitionEnter:n.transitionEnter,transitionAppear:n.transitionAppear,transitionLeave:n.transitionLeave},t)}));var r=n.component;if(r){var o=n;return"string"==typeof r&&(o=f()({className:n.className,style:n.style},n.componentProps)),b.a.createElement(r,o,i)}return i[0]||null}}]),n}(b.a.Component);U.isAnimate=!0,U.propTypes={component:w.a.any,componentProps:w.a.object,animation:w.a.object,transitionName:w.a.oneOfType([w.a.string,w.a.object]),transitionEnter:w.a.bool,transitionAppear:w.a.bool,exclusive:w.a.bool,transitionLeave:w.a.bool,onEnd:w.a.func,onEnter:w.a.func,onLeave:w.a.func,onAppear:w.a.func,showProp:w.a.string},U.defaultProps={animation:{},component:"span",componentProps:{},transitionEnter:!0,transitionLeave:!0,transitionAppear:!1,onEnd:l,onEnter:l,onLeave:l,onAppear:l};var R=function(){var e=this;this.performEnter=function(n){e.childrenRefs[n]&&(e.currentlyAnimatingKeys[n]=!0,e.childrenRefs[n].componentWillEnter(e.handleDoneAdding.bind(e,n,"enter")))},this.performAppear=function(n){e.childrenRefs[n]&&(e.currentlyAnimatingKeys[n]=!0,e.childrenRefs[n].componentWillAppear(e.handleDoneAdding.bind(e,n,"appear")))},this.handleDoneAdding=function(n,t){var r=e.props;if(delete e.currentlyAnimatingKeys[n],!r.exclusive||r===e.nextProps){var o=i(c(r));e.isValidChildByKey(o,n)?"appear"===t?S.allowAppearCallback(r)&&(r.onAppear(n),r.onEnd(n,!0)):S.allowEnterCallback(r)&&(r.onEnter(n),r.onEnd(n,!0)):e.performLeave(n)}},this.performLeave=function(n){e.childrenRefs[n]&&(e.currentlyAnimatingKeys[n]=!0,e.childrenRefs[n].componentWillLeave(e.handleDoneLeaving.bind(e,n)))},this.handleDoneLeaving=function(n){var t=e.props;if(delete e.currentlyAnimatingKeys[n],!t.exclusive||t===e.nextProps){var r=i(c(t));if(e.isValidChildByKey(r,n))e.performEnter(n);else{var o=function(){S.allowLeaveCallback(t)&&(t.onLeave(n),t.onEnd(n,!1))};a(e.state.children,r,t.showProp)?o():e.setState({children:r},o)}}}};n.a=U},228:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e,n){var t;h&&(h.destroy(),h=null),d.default.newInstance({prefixCls:y,style:{},transitionName:"am-fade",className:(0,l.default)((t={},(0,s.default)(t,y+"-mask",e),(0,s.default)(t,y+"-nomask",!e),t))},function(e){return n&&n(e)})}function o(e,n){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:3,i=arguments[3],o=!(arguments.length>4&&void 0!==arguments[4])||arguments[4],a={info:"",success:"success",fail:"fail",offline:"dislike",loading:"loading"},s=a[n];r(o,function(n){h=n,n.notice({duration:t,style:{},content:s?f.default.createElement("div",{className:y+"-text "+y+"-text-icon",role:"alert","aria-live":"assertive"},f.default.createElement(v.default,{type:s,size:"lg"}),f.default.createElement("div",{className:y+"-text-info"},e)):f.default.createElement("div",{className:y+"-text",role:"alert","aria-live":"assertive"},f.default.createElement("div",null,e)),closable:!0,onClose:function(){i&&i(),n.destroy(),n=null,h=null}})})}Object.defineProperty(n,"__esModule",{value:!0});var a=t(20),s=i(a),c=t(8),l=i(c),u=t(0),f=i(u),p=t(232),d=i(p),m=t(60),v=i(m),h=void 0,y="am-toast";n.default={SHORT:3,LONG:8,show:function(e,n,t){return o(e,"info",n,function(){},t)},info:function(e,n,t,i){return o(e,"info",n,t,i)},success:function(e,n,t,i){return o(e,"success",n,t,i)},fail:function(e,n,t,i){return o(e,"fail",n,t,i)},offline:function(e,n,t,i){return o(e,"offline",n,t,i)},loading:function(e,n,t,i){return o(e,"loading",n,t,i)},hide:function(){h&&(h.destroy(),h=null)}},e.exports=n.default},229:function(e,n,t){"use strict";t(16),t(61),t(233)},230:function(e,n,t){"use strict";function i(e,n,t){e.addEventListener(n,t,!1)}function r(e,n,t){e.removeEventListener(n,t,!1)}function o(e,n){for(var t=window.getComputedStyle(e,null),i="",r=0;r<E.length&&!(i=t.getPropertyValue(E[r]+n));r++);return i}function a(e){if(h){var n=parseFloat(o(e,"transition-delay"))||0,t=parseFloat(o(e,"transition-duration"))||0,i=parseFloat(o(e,"animation-delay"))||0,r=parseFloat(o(e,"animation-duration"))||0,a=Math.max(t+n,r+i);e.rcEndAnimTimeout=setTimeout(function(){e.rcEndAnimTimeout=null,e.rcEndListener&&e.rcEndListener()},1e3*a+200)}}function s(e){e.rcEndAnimTimeout&&(clearTimeout(e.rcEndAnimTimeout),e.rcEndAnimTimeout=null)}var c=t(36),l=t.n(c),u={transitionend:{transition:"transitionend",WebkitTransition:"webkitTransitionEnd",MozTransition:"mozTransitionEnd",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd"},animationend:{animation:"animationend",WebkitAnimation:"webkitAnimationEnd",MozAnimation:"mozAnimationEnd",OAnimation:"oAnimationEnd",msAnimation:"MSAnimationEnd"}},f=[];"undefined"!=typeof window&&"undefined"!=typeof document&&function(){var e=document.createElement("div"),n=e.style;"AnimationEvent"in window||delete u.animationend.animation,"TransitionEvent"in window||delete u.transitionend.transition;for(var t in u)if(u.hasOwnProperty(t)){var i=u[t];for(var r in i)if(r in n){f.push(i[r]);break}}}();var p={addEndEventListener:function(e,n){if(0===f.length)return void window.setTimeout(n,0);f.forEach(function(t){i(e,t,n)})},endEvents:f,removeEndEventListener:function(e,n){0!==f.length&&f.forEach(function(t){r(e,t,n)})}},d=p,m=t(231),v=t.n(m);t.d(n,"b",function(){return h});var h=0!==d.endEvents.length,y=["Webkit","Moz","O","ms"],E=["-webkit-","-moz-","-o-","ms-",""],g=function(e,n,t){var i="object"===(void 0===n?"undefined":l()(n)),r=i?n.name:n,o=i?n.active:n+"-active",c=t,u=void 0,f=void 0,p=v()(e);return t&&"[object Object]"===Object.prototype.toString.call(t)&&(c=t.end,u=t.start,f=t.active),e.rcEndListener&&e.rcEndListener(),e.rcEndListener=function(n){n&&n.target!==e||(e.rcAnimTimeout&&(clearTimeout(e.rcAnimTimeout),e.rcAnimTimeout=null),s(e),p.remove(r),p.remove(o),d.removeEndEventListener(e,e.rcEndListener),e.rcEndListener=null,c&&c())},d.addEndEventListener(e,e.rcEndListener),u&&u(),p.add(r),e.rcAnimTimeout=setTimeout(function(){e.rcAnimTimeout=null,p.add(o),f&&setTimeout(f,0),a(e)},30),{stop:function(){e.rcEndListener&&e.rcEndListener()}}};g.style=function(e,n,t){e.rcEndListener&&e.rcEndListener(),e.rcEndListener=function(n){n&&n.target!==e||(e.rcAnimTimeout&&(clearTimeout(e.rcAnimTimeout),e.rcAnimTimeout=null),s(e),d.removeEndEventListener(e,e.rcEndListener),e.rcEndListener=null,t&&t())},d.addEndEventListener(e,e.rcEndListener),e.rcAnimTimeout=setTimeout(function(){for(var t in n)n.hasOwnProperty(t)&&(e.style[t]=n[t]);e.rcAnimTimeout=null,a(e)},0)},g.setTransition=function(e,n,t){var i=n,r=t;void 0===t&&(r=i,i=""),i=i||"",y.forEach(function(n){e.style[n+"Transition"+i]=r})},g.isCssAnimationSupported=h;n.a=g},231:function(e,n,t){function i(e){if(!e||!e.nodeType)throw new Error("A DOM element reference is required");this.el=e,this.list=e.classList}try{var r=t(224)}catch(e){var r=t(224)}var o=/\s+/,a=Object.prototype.toString;e.exports=function(e){return new i(e)},i.prototype.add=function(e){if(this.list)return this.list.add(e),this;var n=this.array();return~r(n,e)||n.push(e),this.el.className=n.join(" "),this},i.prototype.remove=function(e){if("[object RegExp]"==a.call(e))return this.removeMatching(e);if(this.list)return this.list.remove(e),this;var n=this.array(),t=r(n,e);return~t&&n.splice(t,1),this.el.className=n.join(" "),this},i.prototype.removeMatching=function(e){for(var n=this.array(),t=0;t<n.length;t++)e.test(n[t])&&this.remove(n[t]);return this},i.prototype.toggle=function(e,n){return this.list?(void 0!==n?n!==this.list.toggle(e,n)&&this.list.toggle(e):this.list.toggle(e),this):(void 0!==n?n?this.add(e):this.remove(e):this.has(e)?this.remove(e):this.add(e),this)},i.prototype.array=function(){var e=this.el.getAttribute("class")||"",n=e.replace(/^\s+|\s+$/g,""),t=n.split(o);return""===t[0]&&t.shift(),t},i.prototype.has=i.prototype.contains=function(e){return this.list?this.list.contains(e):!!~r(this.array(),e)}},232:function(e,n,t){"use strict";function i(){var e=[].slice.call(arguments,0);return 1===e.length?e[0]:function(){for(var n=0;n<e.length;n++)e[n]&&e[n].apply&&e[n].apply(this,arguments)}}function r(){return"rcNotification_"+P+"_"+x++}Object.defineProperty(n,"__esModule",{value:!0});var o=t(59),a=t.n(o),s=t(20),c=t.n(s),l=t(5),u=t.n(l),f=t(1),p=t.n(f),d=t(2),m=t.n(d),v=t(3),h=t.n(v),y=t(4),E=t.n(y),g=t(0),k=t.n(g),A=t(6),T=t.n(A),b=t(21),L=t.n(b),w=t(226),C=t(8),N=t.n(C),O=function(e){function n(){var e,t,i,r;p()(this,n);for(var o=arguments.length,a=Array(o),s=0;s<o;s++)a[s]=arguments[s];return t=i=h()(this,(e=n.__proto__||Object.getPrototypeOf(n)).call.apply(e,[this].concat(a))),i.close=function(){i.clearCloseTimer(),i.props.onClose()},i.startCloseTimer=function(){i.props.duration&&(i.closeTimer=setTimeout(function(){i.close()},1e3*i.props.duration))},i.clearCloseTimer=function(){i.closeTimer&&(clearTimeout(i.closeTimer),i.closeTimer=null)},r=t,h()(i,r)}return E()(n,e),m()(n,[{key:"componentDidMount",value:function(){this.startCloseTimer()}},{key:"componentWillUnmount",value:function(){this.clearCloseTimer()}},{key:"render",value:function(){var e,n=this.props,t=n.prefixCls+"-notice",i=(e={},c()(e,""+t,1),c()(e,t+"-closable",n.closable),c()(e,n.className,!!n.className),e);return k.a.createElement("div",{className:N()(i),style:n.style},k.a.createElement("div",{className:t+"-content"},n.children),n.closable?k.a.createElement("a",{tabIndex:"0",onClick:this.close,className:t+"-close"},k.a.createElement("span",{className:t+"-close-x"})):null)}}]),n}(g.Component);O.propTypes={duration:T.a.number,onClose:T.a.func,children:T.a.any},O.defaultProps={onEnd:function(){},onClose:function(){},duration:1.5,style:{right:"50%"}};var _=O,x=0,P=Date.now(),S=function(e){function n(){var e,t,i,o;p()(this,n);for(var a=arguments.length,s=Array(a),c=0;c<a;c++)s[c]=arguments[c];return t=i=h()(this,(e=n.__proto__||Object.getPrototypeOf(n)).call.apply(e,[this].concat(s))),i.state={notices:[]},i.add=function(e){var n=e.key=e.key||r();i.setState(function(t){var i=t.notices;if(!i.filter(function(e){return e.key===n}).length)return{notices:i.concat(e)}})},i.remove=function(e){i.setState(function(n){return{notices:n.notices.filter(function(n){return n.key!==e})}})},o=t,h()(i,o)}return E()(n,e),m()(n,[{key:"getTransitionName",value:function(){var e=this.props,n=e.transitionName;return!n&&e.animation&&(n=e.prefixCls+"-"+e.animation),n}},{key:"render",value:function(){var e,n=this,t=this.props,r=this.state.notices.map(function(e){var r=i(n.remove.bind(n,e.key),e.onClose);return k.a.createElement(_,u()({prefixCls:t.prefixCls},e,{onClose:r}),e.content)}),o=(e={},c()(e,t.prefixCls,1),c()(e,t.className,!!t.className),e);return k.a.createElement("div",{className:N()(o),style:t.style},k.a.createElement(w.a,{transitionName:this.getTransitionName()},r))}}]),n}(g.Component);S.propTypes={prefixCls:T.a.string,transitionName:T.a.string,animation:T.a.oneOfType([T.a.string,T.a.object]),style:T.a.object},S.defaultProps={prefixCls:"rmc-notification",animation:"fade",style:{top:65,left:"50%"}},S.newInstance=function(e,n){function t(e){c||(c=!0,n({notice:function(n){e.add(n)},removeNotice:function(n){e.remove(n)},component:e,destroy:function(){L.a.unmountComponentAtNode(s),r||document.body.removeChild(s)}}))}var i=e||{},r=i.getContainer,o=a()(i,["getContainer"]),s=void 0;r?s=r():(s=document.createElement("div"),document.body.appendChild(s));var c=!1;L.a.render(k.a.createElement(S,u()({},o,{ref:t})),s)};var j=S;n.default=j},233:function(e,n){},711:function(e,n){}});