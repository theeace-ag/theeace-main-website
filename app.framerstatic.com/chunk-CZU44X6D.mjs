import{k as m}from"https://app.framerstatic.com/chunk-ZQUNXESX.mjs";import{a as g}from"https://app.framerstatic.com/chunk-NIDOI5EE.mjs";import{c as f,e as V}from"https://app.framerstatic.com/chunk-AHQIRSXG.mjs";var h=f(b=>{"use strict";var a=g();function q(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var L=typeof Object.is=="function"?Object.is:q,I=a.useState,D=a.useEffect,J=a.useLayoutEffect,M=a.useDebugValue;function _(e,t){var r=t(),o=I({inst:{value:r,getSnapshot:t}}),n=o[0].inst,u=o[1];return J(function(){n.value=r,n.getSnapshot=t,S(n)&&u({inst:n})},[e,r,t]),D(function(){return S(n)&&u({inst:n}),e(function(){S(n)&&u({inst:n})})},[e]),M(r),r}function S(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!L(e,r)}catch{return!0}}function z(e,t){return t()}var A=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?z:_;b.useSyncExternalStore=a.useSyncExternalStore!==void 0?a.useSyncExternalStore:A});var E=f((F,w)=>{"use strict";w.exports=h()});var y=f(v=>{"use strict";var U=E();v.useSubscription=function(e){return U.useSyncExternalStore(e.subscribe,e.getCurrentValue)}});var j=f((R,x)=>{"use strict";x.exports=y()});var d=V(g()),N=V(j());var s=new Map,p=new Set;window.addEventListener("storage",e=>{if(!(e.storageArea!==localStorage||e.key===null))try{if(e.newValue===null)s.set(e.key,null);else if(e.oldValue!==e.newValue){let t=JSON.parse(e.newValue);s.set(e.key,t)}for(let t of p)t(e.key)}catch{}});function C(e,t){if(t===null)s.set(e,null),localStorage.removeItem(e);else{s.set(e,t);let r=JSON.stringify(t);localStorage.setItem(e,r)}for(let r of p)r(e)}function H(e,t){let r=(0,d.useMemo)(()=>{function u(){if(s.has(e))return s.get(e);let c=localStorage.getItem(e);if(c)try{let i=JSON.parse(c);return s.set(e,i),i}catch{}return null}function l(c){function i(O){O===e&&c()}return p.add(i),()=>p.delete(i)}return{getCurrentValue:u,subscribe:l}},[e]),o=(0,N.useSubscription)(r)??t,n=(0,d.useCallback)(u=>{try{if(m(u)){let l=s.get(e),c=s.has(e)&&l!==null?l:o,i=u(c);C(e,i)}else C(e,u)}catch{}},[o,e]);return[o,n]}export{E as a,C as b,H as c};
/*! Bundled license information:

use-sync-external-store/cjs/use-sync-external-store-shim.production.js:
  (**
   * @license React
   * use-sync-external-store-shim.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

use-subscription/cjs/use-subscription.production.min.js:
  (**
   * @license React
   * use-subscription.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=https://app.framerstatic.com/chunk-CZU44X6D.mjs.map
