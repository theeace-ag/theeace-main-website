function s(t,...r){if(t)return;let n=Error("Assertion Error"+(r.length>0?": "+r.join(" "):""));if(n.stack)try{let e=n.stack.split(`
`);e[1]?.includes("assert")?(e.splice(1,1),n.stack=e.join(`
`)):e[0]?.includes("assert")&&(e.splice(0,1),n.stack=e.join(`
`))}catch{}throw n}function i(t,r){throw r||new Error(t?`Unexpected value: ${t}`:"Application entered invalid state")}export{s as a,i as b};
//# sourceMappingURL=https://app.framerstatic.com/chunk-4AQCMAAQ.mjs.map
