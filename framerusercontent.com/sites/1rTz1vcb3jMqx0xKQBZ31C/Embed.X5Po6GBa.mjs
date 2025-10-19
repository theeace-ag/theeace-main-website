import{__esmMin as e}from"./rolldown-runtime.C0UuesSg.mjs";import{init_jsx_runtime as t,init_npm_react_18_2 as n,init_ssg_sandbox_shims as r,p as i,pe as a,se as o,ue as s,window as c,ye as l}from"./react.Fe5WA0X1.mjs";import{ControlType as u,RenderTarget as d,addPropertyControls as f,init_framer_4BVLRPEB as p}from"./framer.DkZdgH-4.mjs";var m,h,g=e((()=>{p(),m={position:`relative`,width:`100%`,height:`100%`,display:`flex`,justifyContent:`center`,alignItems:`center`},h={...m,borderRadius:6,background:`rgba(136, 85, 255, 0.3)`,color:`#85F`,border:`1px dashed #85F`,flexDirection:`column`},u.EventHandler,u.EventHandler,u.EventHandler,u.Number,u.Boolean,u.String,u.Enum})),_=e((()=>{p(),n()})),v=e((()=>{n()})),y=e((()=>{p()})),b=e((()=>{p()})),x=e((()=>{n()})),S=e((()=>{p()})),C=e((()=>{r(),n()})),w=e((()=>{n(),b()})),T=e((()=>{n(),p(),b(),v()})),E=e((()=>{p(),n(),g()}));function D(){return o(()=>d.current()===d.canvas,[])}var O=e((()=>{n(),p()})),k=e((()=>{n()})),A=e((()=>{n(),p(),u.FusedNumber,u.FusedNumber})),j=e((()=>{g(),_(),v(),y(),b(),x(),S(),C(),w(),T(),E(),O(),k(),A()}));function M({type:e,url:t,html:n,zoom:r,radius:a,border:o,style:s={}}){return e===`url`&&t?i(P,{url:t,zoom:r,radius:a,border:o,style:s}):e===`html`&&n?i(I,{html:n,style:s}):i(N,{style:s})}function N({style:e}){return i(`div`,{style:{minHeight:U(e),...h,overflow:`hidden`,...e},children:i(`div`,{style:K,children:`To embed a website or widget, add it to the properties\xA0panel.`})})}function P({url:e,zoom:t,radius:n,border:r,style:a}){let o=!a.height;/[a-z]+:\/\//.test(e)||(e=`https://`+e);let c=D(),[u,d]=l(c?void 0:!1);if(s(()=>{if(!c)return;let t=!0;d(void 0);async function n(){let n=await fetch(`https://api.framer.com/functions/check-iframe-url?url=`+encodeURIComponent(e));if(n.status==200){let{isBlocked:e}=await n.json();t&&d(e)}else{let e=await n.text();console.error(e),d(Error(`This site can’t be reached.`))}}return n().catch(e=>{console.error(e),d(e)}),()=>{t=!1}},[e]),c&&o)return i(H,{message:`URL embeds do not support auto height.`,style:a});if(!e.startsWith(`https://`))return i(H,{message:`Unsupported protocol.`,style:a});if(u===void 0)return i(V,{});if(u instanceof Error)return i(H,{message:u.message,style:a});if(u===!0){let t=`Can’t embed ${e} due to its content security policy.`;return i(H,{message:t,style:a})}return i(`iframe`,{src:e,style:{...W,...a,...r,zoom:t,borderRadius:n,transformOrigin:`top center`},loading:`lazy`,fetchPriority:c?`low`:`auto`,referrerPolicy:`no-referrer`,sandbox:F(c)})}function F(e){let t=[`allow-same-origin`,`allow-scripts`];return e||t.push(`allow-downloads`,`allow-forms`,`allow-modals`,`allow-orientation-lock`,`allow-pointer-lock`,`allow-popups`,`allow-popups-to-escape-sandbox`,`allow-presentation`,`allow-storage-access-by-user-activation`,`allow-top-navigation-by-user-activation`),t.join(` `)}function I({html:e,...t}){if(e.includes(`<\/script>`)){let n=e.includes(`</spline-viewer>`),r=e.includes(`<!-- framer-direct-embed -->`);return i(n||r?R:L,{html:e,...t})}return i(z,{html:e,...t})}function L({html:e,style:t}){let n=a(),[r,o]=l(0);s(()=>{let e=n.current?.contentWindow;function t(t){if(t.source!==e)return;let n=t.data;if(typeof n!=`object`||!n)return;let r=n.embedHeight;typeof r==`number`&&o(r)}return c.addEventListener(`message`,t),e?.postMessage(`getEmbedHeight`,`*`),()=>{c.removeEventListener(`message`,t)}},[]);let u=`
<html>
    <head>
        <style>
            html, body {
                margin: 0;
                padding: 0;
            }

            body {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            :root {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }

            * {
                box-sizing: border-box;
                -webkit-font-smoothing: inherit;
            }

            h1, h2, h3, h4, h5, h6, p, figure {
                margin: 0;
            }

            body, input, textarea, select, button {
                font-size: 12px;
                font-family: sans-serif;
            }
        </style>
    </head>
    <body>
        ${e}
        <script type="module">
            let height = 0

            function sendEmbedHeight() {
                window.parent.postMessage({
                    embedHeight: height
                }, "*")
            }

            const observer = new ResizeObserver((entries) => {
                if (entries.length !== 1) return
                const entry = entries[0]
                if (entry.target !== document.body) return

                height = entry.contentRect.height
                sendEmbedHeight()
            })

            observer.observe(document.body)

            window.addEventListener("message", (event) => {
                if (event.source !== window.parent) return
                if (event.data !== "getEmbedHeight") return
                sendEmbedHeight()
            })
        <\/script>
    <body>
</html>
`,d={...W,...t};return t.height||(d.height=r+`px`),i(`iframe`,{ref:n,style:d,srcDoc:u})}function R({html:e,style:t}){let n=a();return s(()=>{let t=n.current;if(t)return t.innerHTML=e,B(t),()=>{t.innerHTML=``}},[e]),i(`div`,{ref:n,style:{...G,...t}})}function z({html:e,style:t}){return i(`div`,{style:{...G,...t},dangerouslySetInnerHTML:{__html:e}})}function B(e){if(e instanceof Element&&e.tagName===`SCRIPT`){let t=document.createElement(`script`);t.text=e.innerHTML;for(let{name:n,value:r}of e.attributes)t.setAttribute(n,r);e.parentElement.replaceChild(t,e)}else for(let t of e.childNodes)B(t)}function V(){return i(`div`,{className:`framerInternalUI-componentPlaceholder`,style:{...m,overflow:`hidden`},children:i(`div`,{style:K,children:`Loading…`})})}function H({message:e,style:t}){return i(`div`,{className:`framerInternalUI-errorPlaceholder`,style:{minHeight:U(t),...m,overflow:`hidden`,...t},children:i(`div`,{style:K,children:e})})}function U(e){if(!e.height)return 200}var W,G,K,q=e((()=>{r(),t(),n(),p(),j(),f(M,{type:{type:u.Enum,defaultValue:`url`,displaySegmentedControl:!0,options:[`url`,`html`],optionTitles:[`URL`,`HTML`]},url:{title:`URL`,type:u.String,description:`Some websites don’t support embedding.`,hidden(e){return e.type!==`url`}},html:{title:`HTML`,type:u.String,displayTextArea:!0,hidden(e){return e.type!==`html`}},border:{title:`Border`,type:u.Border,optional:!0,hidden(e){return e.type!==`url`}},radius:{type:u.BorderRadius,title:`Radius`,hidden(e){return e.type!==`url`}},zoom:{title:`Zoom`,defaultValue:1,type:u.Number,hidden(e){return e.type!==`url`},min:.1,max:1,step:.1,displayStepper:!0}}),W={width:`100%`,height:`100%`,border:`none`},G={width:`100%`,height:`100%`,display:`flex`,flexDirection:`column`,justifyContent:`center`,alignItems:`center`},K={textAlign:`center`,minWidth:140}}));export{M as Embed,q as init_Embed};
//# sourceMappingURL=Embed.X5Po6GBa.mjs.map