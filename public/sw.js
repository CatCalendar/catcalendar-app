if(!self.define){let e,s={};const t=(t,n)=>(t=new URL(t+".js",n).href,s[t]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=t,e.onload=s,document.head.appendChild(e)}else e=t,importScripts(t),s()})).then((()=>{let e=s[t];if(!e)throw new Error(`Module ${t} didn’t register its module`);return e})));self.define=(n,a)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let c={};const o=e=>t(e,i),r={module:{uri:i},exports:c,require:o};s[i]=Promise.all(n.map((e=>r[e]||o(e)))).then((e=>(a(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/BG-ZUq5K5yBvID-_fRBju/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/23-40f53182453d4ae2.js",revision:"BG-ZUq5K5yBvID-_fRBju"},{url:"/_next/static/chunks/291-e23a65d14f1fb5f1.js",revision:"BG-ZUq5K5yBvID-_fRBju"},{url:"/_next/static/chunks/app/_not-found/page-8b5ceee93fba5cda.js",revision:"BG-ZUq5K5yBvID-_fRBju"},{url:"/_next/static/chunks/app/layout-5c7966a438aa7e0e.js",revision:"BG-ZUq5K5yBvID-_fRBju"},{url:"/_next/static/chunks/app/loginredirect/page-492f59e813927998.js",revision:"BG-ZUq5K5yBvID-_fRBju"},{url:"/_next/static/chunks/app/mylist/page-bd0c306f1af962db.js",revision:"BG-ZUq5K5yBvID-_fRBju"},{url:"/_next/static/chunks/app/page-5b2f1d2398c4ffd3.js",revision:"BG-ZUq5K5yBvID-_fRBju"},{url:"/_next/static/chunks/app/set/page-337815cb20c4c4e8.js",revision:"BG-ZUq5K5yBvID-_fRBju"},{url:"/_next/static/chunks/app/userinfo/page-aa791feb81120589.js",revision:"BG-ZUq5K5yBvID-_fRBju"},{url:"/_next/static/chunks/fd9d1056-53d0ef7c047cec68.js",revision:"BG-ZUq5K5yBvID-_fRBju"},{url:"/_next/static/chunks/framework-f66176bb897dc684.js",revision:"BG-ZUq5K5yBvID-_fRBju"},{url:"/_next/static/chunks/main-app-fcc5450ccd1c0b19.js",revision:"BG-ZUq5K5yBvID-_fRBju"},{url:"/_next/static/chunks/main-dafc3c53878e5a7e.js",revision:"BG-ZUq5K5yBvID-_fRBju"},{url:"/_next/static/chunks/pages/_app-6a626577ffa902a4.js",revision:"BG-ZUq5K5yBvID-_fRBju"},{url:"/_next/static/chunks/pages/_error-1be831200e60c5c0.js",revision:"BG-ZUq5K5yBvID-_fRBju"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-2fcd81b131ad6418.js",revision:"BG-ZUq5K5yBvID-_fRBju"},{url:"/_next/static/css/fb5c3792c3c02538.css",revision:"fb5c3792c3c02538"},{url:"/cat_calendar_192x192.png",revision:"69dba001be8d4e44eb18ca372232f22d"},{url:"/cat_calendar_512x512.png",revision:"b72fbfba994445a4d9623732ec7c6037"},{url:"/firebase-messaging-sw.js",revision:"d0d7d97c89c8b918456ee12d2b2e0dfc"},{url:"/fonts/otf/BMDOHYEON_otf.otf",revision:"36832d8a62e404d88a6e27a464b509a6"},{url:"/fonts/otf/BMEULJIRO.otf",revision:"0cbe8592cfbea7b46b421e124af8d278"},{url:"/fonts/otf/BMEuljiro10yearslaterOTF.otf",revision:"cff030612de576843d7cfecd5ae28791"},{url:"/fonts/otf/BMEuljirooraeoraeOTF.otf",revision:"17c8c27e13a7b5a3c97a7af408d7ade9"},{url:"/fonts/otf/BMHANNAAir_otf.otf",revision:"f3d3e1c461ac941338dd7bda93a5cd39"},{url:"/fonts/otf/BMHANNAProOTF.otf",revision:"ba63542925fef755b9371c58361b008c"},{url:"/fonts/otf/BMHANNA_11yrs_otf.otf",revision:"6040aeebef9019e798fea909e9570756"},{url:"/fonts/otf/BMJUA_otf.otf",revision:"7592a08778fd0fc3b37b052386aac91a"},{url:"/fonts/otf/BMKIRANGHAERANG-OTF.otf",revision:"a34a4cbce0fdf72b3101b9794c18e908"},{url:"/fonts/otf/BMYEONSUNG_otf.otf",revision:"6f67016d941ca8998785bdf120cee8a1"},{url:"/manifest.json",revision:"6a048adac8d7ae10607a097cd9627e13"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:t,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
