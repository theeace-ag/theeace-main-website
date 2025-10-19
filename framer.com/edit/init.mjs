var re=Object.defineProperty;var ie=(e,t,o)=>t in e?re(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o;var y=(e,t,o)=>ie(e,typeof t!="symbol"?t+"":t,o);var I="__framer_force_showing_editorbar_since",h="2147483647";var D=300;var b=12,F="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAApNJREFUSA2tlUtLlFEYgEe7mtFFQ8NLFBG1SJAwahtiLVy5ceVSEPQH1LZf0Lp9FO1bdYNyI7gyBFcS2kAzilYq3sfxeYZ55Zv6FGfohWfOd97vnPd23u9MXeZoaeb1Q7gPHXAFzsAS5GACxiEPqVKXqs1kmtAPQi+cAtedToz1PJ8ExxPwDl7CAlRImoN7rBiF86ABHTiGAzMIh8n3O+ifwWc4EL0n5TGTYQijvjNSxbUadozInUeGZ3nuh1WYgpIkM+hGMwYajAgdrfUn+AaLoLTCAxiAOxCZxL4RdB+gZMjxEjwHo4hS8Jh5DR9hz0mKaNizegoNEI7Wee6FXJTISG6AUgDr+QImoAiHie+mwZJow/PRps4uwnsnRj8Epqc4voVJJ8eULOtW4BFYYjPpgjc+3IWI2sh/wFeoVl6xYQ48dDGLfjOwc/ygQqz595hUMVouS9QHBm4l6k3HWpnBLqicgVrlCxujSbR1Swd+UDpQYRS/oVaZZ2MWwlZBB9Zdxf+QTYw8SRgq6sAvz7vH6JULEB9USVHFjzZskgPRQR4ayxoXXIdaHdg9HrB2rErByWxZERnYtrWUzD0esDbtTmXPhzXwHrKLxEUbYGbVyDkWWwkdadfqbPmwDXZSCyh2VAf8BM/nOOJH5Y0QopMt2I5U/KO4DZZJB47XwEX+ex0mGroMV8sLwp56gyuGwiyW4SZ4c8bt2cZzO7jBNeqtsRHbeZ1g9krsMbhfYPv/c5gecA+4yAVuitFszE5Hjva872OMdXagF19JIoOYWyozMTI3J0tmA6gLvXPfO1cc/XOqOLe/HbjwD8yCXRD3VNJROEgatiRZMJsKsbZHia3nAdphtq8fkiWyXJbBe8uM1aXKPouNnz2Bm1kwAAAAAElFTkSuQmCC",v="__framer-editorbar-container",E="__framer-editorbar-label",x="__framer-editorbar-button",T="__framer-editorbar-loading-spinner",L="__framer-editorbar-button-tooltip-visible",se=`
#${v} {
    align-items: center;
    bottom: 50%;
    display: flex;
    gap: 8px;
    position: fixed;
    right: 10px;
    transform: translateY(50%);
    z-index: calc(${h});
}

#${E} {
    background-color: #111;
    border-radius: 8px;
    font-family: "Inter", "Inter-Regular", system-ui, Arial, sans-serif;
    font-size: 12px;
    height: fit-content;
    opacity: 0;
    padding: 4px 8px;
    transition: opacity 0.4s ease-out;
    font-weight: 500;
}

#${x} {
    all: unset;
    align-items: center;
    border-radius: 15px;
    cursor: pointer;
    display: flex;
    height: 30px;
    justify-content: center;
    width: 30px;
}

#${E}.${L} {
    opacity: 1;
}

#${E}, #${x} {
    backdrop-filter: blur(10px);
    background-color: rgba(34, 34, 34, 0.8);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(0, 0, 0, 0.05) 0px 1px 0px 0px, rgba(255, 255, 255, 0.15) 0px 0px 0px 1px;
    color: #fff;
}

#${T} {
    width: ${b}px;
    height: ${b}px;
    -webkit-mask: url(${F});
    mask: url(${F});
    -webkit-mask-size: ${b}px;
    mask-size: ${b}px;
    background-color: #fff;


    animation-duration: 800ms;
    animation-iteration-count: infinite;
    animation-name: __framer-loading-spin;
    animation-timing-function: linear;
}

@keyframes __framer-loading-spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
`,M=document.createElement("style");M.innerHTML=se;document.head.appendChild(M);var N;(s=>(s.isTouch="ontouchstart"in window||navigator.maxTouchPoints>0,s.isChrome=navigator.userAgent.toLowerCase().includes("chrome/"),s.isWebKit=navigator.userAgent.toLowerCase().includes("applewebkit/"),s.isSafari=s.isWebKit&&!s.isChrome,s.isSafariDesktop=s.isSafari&&!s.isTouch,s.isWindows=/Win/u.test(navigator.platform),s.isMacOS=/Mac/u.test(navigator.platform),s.isAndroidWebView=s.isChrome&&navigator.userAgent.toLowerCase().includes("; wv)"),s.isIosWebView=s.isWebKit&&!navigator.userAgent.toLowerCase().includes("safari/"),s.isWebView=s.isAndroidWebView||s.isIosWebView))(N||={});var w=class extends Promise{constructor(){let o,r;super((n,i)=>{o=n,r=i});y(this,"_state","initial");y(this,"resolve");y(this,"reject");this.resolve=n=>{this._state="fulfilled",o(n)},this.reject=n=>{this._state="rejected",r(n)}}get state(){return this._state}pending(){return this._state="pending",this}isResolved(){return this._state==="fulfilled"||this._state==="rejected"}};w.prototype.constructor=Promise;var B="framer_",p="editSite";function _(e){let t=window.__framer_editorBarDependencies;if(!t)throw new Error("Dependencies not found");if(t.__version<1||t.__version>2)throw new Error("Unsupported version");let o=t[e];if(!o)throw new Error("Dependency not found");return o}var{createElement:P,memo:U,useCallback:V,useEffect:m,useRef:k,useState:u}=_("react");var{createPortal:W}=_("react-dom");var z="autoplay";function d(e,t,o){let{children:r,...n}=t??{};return o!==void 0&&(n.key=o),P(e,n,r)}function O(e,t,o){let{children:r,...n}=t??{};return o!==void 0&&(n.key=o),P(e,n,...r)}function Y({isLoading:e,isEditorVisible:t,onClick:o}){let[r,n]=u(!1),[i,a]=u(t);return i!==t&&(a(t),t||n(!1)),O("div",{id:v,dir:"ltr",children:[d("span",{"aria-label":"Edit Framer Content",id:E,className:r?L:void 0,children:"Edit Content"}),d("button",{type:"button","aria-labelledby":E,id:x,onClick:o,onMouseMove:()=>{n(!0)},onMouseLeave:()=>{n(!1)},children:e?d(ce,{}):d(ae,{})})]})}function ae(){return O("svg",{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",fill:"none",children:[d("path",{d:"M8.75 2.25a1.77 1.77 0 0 1 2.5 0h0c.69.69.69 1.81 0 2.5l-7 7h-2.5v-2.5Z",fill:"transparent",strokeWidth:"1.5",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round"}),d("path",{d:"M8 11.75h3.75",fill:"transparent",strokeWidth:"1.5",stroke:"currentColor",strokeLinecap:"round"})]})}function ce(){return d("div",{id:T})}var A="data-original-href",j="link[rel*='icon']",ue=`${j}:not([${A}])`,de="https://framerusercontent.com/sites/icons/writing-hand-favicon.png";function H(){document.querySelectorAll(ue).forEach(e=>{e instanceof HTMLLinkElement&&(e.setAttribute(A,e.href),e.setAttribute("href",de))})}function X(){document.querySelectorAll(j).forEach(e=>{e instanceof HTMLLinkElement&&e.getAttribute(A)&&(e.setAttribute("href",e.getAttribute(A)??""),e.removeAttribute(A))})}function Z(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function G(e,t){let[o,r]=u(!1);return m(()=>{let n=i=>{if(i.origin!==e||!Z(i.data))return;let{apiVersion:a,type:c,component:l}=i.data;a===1&&c==="initializeComponent"&&l===t&&r(!0)};return window.addEventListener("message",n),()=>{window.removeEventListener("message",n)}},[e,t]),o}var{useCurrentRoute:$,useLocaleInfo:J,useRouter:q}=_("framer");function K(){let e=$(),t=J()?.activeLocale??void 0,{collectionUtils:o}=q(),[r,n]=u(),i=e?.id,a=e?.collectionId,c=e?.pathVariables;return m(()=>{if(!i)return;let l=!1;return le(t,a,o,c).then(f=>{l||n({collectionItemNodeId:f,webPageNodeId:i})}).catch(()=>{l||n({collectionItemNodeId:void 0,webPageNodeId:i})}),()=>{l=!0}},[t,a,o,c,i]),r}async function le(e,t,o,r){if(!t)return;let n=Object.values(r??{}),[i]=n;if(n.length!==1||!i||typeof i!="string")return;let a=o?.[t];return(await a?.())?.getRecordIdBySlug(i,e)}function Q(e,t){let o=K(),r=G(t,"OnPageActiveRouteStore");m(()=>{r&&e.current?.contentWindow?.postMessage({apiVersion:1,type:"updateNodeIds",nodeIds:o},t)},[e,o,t,r])}var fe=Date.now();function pe(){return window.self!==window.top}var me=`
#__framer-editorbar {
    /* https://sergeyski.com/css-color-scheme-and-iframes-lessons-learned-from-disqus-background-bug */
    color-scheme: light dark;
    overflow: hidden;
    position: fixed;
    border: none;
    z-index: calc(${h});
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    touch-action: manipulation;
}

@supports (height: 100dvh) {
    #__framer-editorbar {
        height: 100dvh;
    }
}

#__framer-editorbar.status_hidden {
    display: none;
}

#__framer-editorbar.status_visually_hidden {
    clip-path: circle(1px at calc(100% - 20px) calc(50% + 4px));
    z-index: calc(${h} - 1);
}

#__framer-editorbar.status_measuring {
    clip-path: unset;
}
`,ne=document.createElement("style");ne.innerHTML=me;document.head.appendChild(ne);var R=new URL(import.meta.url).origin;function ge(){if(localStorage[I])return ee(),!0;let e=new URL(window.location.href),t=e.searchParams.has(p),o=e.searchParams.has(p.toLowerCase());if(!t&&!o)return!1;let r=t?p:p.toLowerCase(),n=e.searchParams.get(r);if(n!==""&&n!==null)return!1;for(let i of e.searchParams.keys())if(i!==p&&i!==p.toLowerCase()&&!i.startsWith(B))return!1;return ee(),localStorage[I]=new Date().toString(),!0}function ee(){let e=new URL(window.location.href);e.searchParams.has(p)&&(e.searchParams.delete(p),e.searchParams.delete(p.toLowerCase()),window.history.replaceState({},"",e.toString()))}var S=(()=>{try{return ge()}catch(e){return console.error(e),!1}})();function te(){return null}function he(){let e=document.getElementsByClassName("lenis-scrolling");for(let t of e)t.classList.remove("lenis-scrolling")}function Ee(e){let[t,o]=u(e),r=V(()=>{"requestIdleCallback"in window?requestIdleCallback(()=>{o(!0)}):setTimeout(()=>{o(!0)},300)},[]);return m(()=>{if(!t)if(document.readyState==="complete")r();else{let n=()=>{document.readyState==="complete"&&r()};return document.addEventListener("readystatechange",n,{once:!0}),()=>{document.removeEventListener("readystatechange",n)}}},[t,r]),t}function _e(e,t){let[o,r]=u(t),[n,i]=u(!0),[a,c]=u(!1),[l,f]=u("hidden"),s=k();return s.current??=new w,m(()=>{function C(g){if(g.origin===R&&typeof g.data=="object"&&g.data?.apiVersion===1)if(g.data.type==="accessResult"&&g.data.data.status==="success"){r(!0);try{localStorage[I]=new Date().toString()}catch(oe){console.error(oe)}}else g.data.type==="exitFullscreen"?(document.body.style.overflow="auto",window.scrollTo({behavior:"instant",top:g.data.position?.top??0}),f("hidden")):g.data.type==="sandboxReadyState"&&g.data.data.status==="ready"&&(i(!1),setTimeout(()=>{s.current?.resolve()},50))}return window.addEventListener("message",C),()=>{window.removeEventListener("message",C)}},[]),{showEntrypointButton:o,entrypointButtonLoading:a?n:!1,iframeState:l,onEditContent:()=>{e.current?.contentWindow?.postMessage({apiVersion:1,type:"enterOnPageEditing"},R),f("fullscreen"),c(!0),s.current?.then(()=>{e.current?.contentWindow?.postMessage({apiVersion:1,type:"showCanvas",position:{top:window.scrollY}},R),setTimeout(()=>{document.body.style.overflow="hidden"},D),c(!1)}),he()}}}function Ie({framerSiteId:e,features:t,iframeRef:o,className:r}){Q(o,R);let n=new URL(import.meta.url),i=n.pathname.lastIndexOf("/");if(i<0)throw new Error("Invalid pathname");let a=t?.editorBarDisableFrameAncestorsSecurity?"fake-domain.example":window.location.hostname;return n.pathname=n.pathname.slice(0,i),n.searchParams.set("framerSiteId",e),n.searchParams.set("source",a),n.searchParams.set("features",JSON.stringify(t||{})),n.searchParams.set("loadStart",fe.toString()),S&&n.searchParams.set("forceShow","true"),d("iframe",{id:"__framer-editorbar",ref:o,src:n.href,"aria-hidden":"true",allow:z,tabIndex:-1,className:r})}function we({framerSiteId:e,features:t}){let o=k(null),r=Ee(S),n=S||r,{showEntrypointButton:i,entrypointButtonLoading:a,iframeState:c,onEditContent:l}=_e(o,S);if(m(()=>{if(c!=="fullscreen")return;let s=document.title;return document.title="Editing Page...",H(),()=>{document.title=s,X()}},[c]),!n)return null;let f;return c==="fullscreen"?f="fullscreen":i?f="status_visually_hidden":f="status_hidden",W([i?d(Y,{isLoading:a,onClick:l,isEditorVisible:c==="fullscreen"},"button"):null,d(Ie,{framerSiteId:e,features:t,iframeRef:o,className:f},"iframe")],document.body)}function mt(){return pe()?(console.log("[Framer Editor Bar] Unavailable because site is embedded in iframe"),te):N.isWebView?(console.log("[Framer Editor Bar] Unavailable because running in WebView"),te):U(we)}export{mt as createEditorBar};
//# sourceMappingURL=https://app.framerstatic.com/editorbar-initializer.VFKT4ZEZ.mjs.map
