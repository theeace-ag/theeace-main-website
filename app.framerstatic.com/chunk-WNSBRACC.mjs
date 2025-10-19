function r(t,...s){if(t)return;let e=Error("Assertion Error"+(s.length>0?": "+s.join(" "):""));if(e.stack)try{let n=e.stack.split(`
`);n[1]?.includes("assert")?(n.splice(1,1),e.stack=n.join(`
`)):n[0]?.includes("assert")&&(n.splice(0,1),e.stack=n.join(`
`))}catch{}throw e}function i(t,s){throw s||new Error(t?`Unexpected value: ${t}`:"Application entered invalid state")}export{r as a,i as b};
//# sourceMappingURL=https://app.framerstatic.com/chunk-WNSBRACC.mjs.map
