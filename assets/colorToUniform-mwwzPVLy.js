import{S as Bt,G as Pt,B as Y,a as I}from"./Geometry-CV9yD47f.js";import{D as zt,u as T,E as Gt,a as Ut,G as It,e as Et,c as Mt}from"./index-yWwg5xd0.js";const C=Object.create(null),Z=Object.create(null);function Q(r,t){let e=Z[r];return e===void 0&&(C[t]===void 0&&(C[t]=1),Z[r]=e=C[t]++),e}let E;function ht(){return(!E||E?.isContextLost())&&(E=zt.get().createCanvas().getContext("webgl",{})),E}let M;function Tt(){if(!M){M="mediump";const r=ht();r&&r.getShaderPrecisionFormat&&(M=r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision?"highp":"mediump")}return M}function Rt(r,t,e){return t?r:e?(r=r.replace("out vec4 finalColor;",""),`

        #ifdef GL_ES // This checks if it is WebGL1
        #define in varying
        #define finalColor gl_FragColor
        #define texture texture2D
        #endif
        ${r}
        `):`

        #ifdef GL_ES // This checks if it is WebGL1
        #define in attribute
        #define out varying
        #endif
        ${r}
        `}function Vt(r,t,e){const i=e?t.maxSupportedFragmentPrecision:t.maxSupportedVertexPrecision;if(r.substring(0,9)!=="precision"){let n=e?t.requestedFragmentPrecision:t.requestedVertexPrecision;return n==="highp"&&i!=="highp"&&(n="mediump"),`precision ${n} float;
${r}`}else if(i!=="highp"&&r.substring(0,15)==="precision highp")return r.replace("precision highp","precision mediump");return r}function Ct(r,t){return t?`#version 300 es
${r}`:r}const $t={},Dt={};function Ft(r,{name:t="pixi-program"},e=!0){t=t.replace(/\s+/g,"-"),t+=e?"-fragment":"-vertex";const i=e?$t:Dt;return i[t]?(i[t]++,t+=`-${i[t]}`):i[t]=1,r.indexOf("#define SHADER_NAME")!==-1?r:`${`#define SHADER_NAME ${t}`}
${r}`}function kt(r,t){return t?r.replace("#version 300 es",""):r}const $={stripVersion:kt,ensurePrecision:Vt,addProgramDefines:Rt,setProgramName:Ft,insertVersion:Ct},A=Object.create(null),dt=class H{constructor(t){t={...H.defaultOptions,...t};const e=t.fragment.indexOf("#version 300 es")!==-1,i={stripVersion:e,ensurePrecision:{requestedFragmentPrecision:t.preferredFragmentPrecision,requestedVertexPrecision:t.preferredVertexPrecision,maxSupportedVertexPrecision:"highp",maxSupportedFragmentPrecision:Tt()},setProgramName:{name:t.name},addProgramDefines:e,insertVersion:e};let n=t.fragment,s=t.vertex;Object.keys($).forEach(a=>{const o=i[a];n=$[a](n,o,!0),s=$[a](s,o,!1)}),this.fragment=n,this.vertex=s,this.transformFeedbackVaryings=t.transformFeedbackVaryings,this._key=Q(`${this.vertex}:${this.fragment}`,"gl-program")}destroy(){this.fragment=null,this.vertex=null,this._attributeData=null,this._uniformData=null,this._uniformBlockData=null,this.transformFeedbackVaryings=null,A[this._cacheKey]=null}static from(t){const e=`${t.vertex}:${t.fragment}`;return A[e]||(A[e]=new H(t),A[e]._cacheKey=e),A[e]}};dt.defaultOptions={preferredVertexPrecision:"highp",preferredFragmentPrecision:"mediump"};let q=dt;const J={uint8x2:{size:2,stride:2,normalised:!1},uint8x4:{size:4,stride:4,normalised:!1},sint8x2:{size:2,stride:2,normalised:!1},sint8x4:{size:4,stride:4,normalised:!1},unorm8x2:{size:2,stride:2,normalised:!0},unorm8x4:{size:4,stride:4,normalised:!0},snorm8x2:{size:2,stride:2,normalised:!0},snorm8x4:{size:4,stride:4,normalised:!0},uint16x2:{size:2,stride:4,normalised:!1},uint16x4:{size:4,stride:8,normalised:!1},sint16x2:{size:2,stride:4,normalised:!1},sint16x4:{size:4,stride:8,normalised:!1},unorm16x2:{size:2,stride:4,normalised:!0},unorm16x4:{size:4,stride:8,normalised:!0},snorm16x2:{size:2,stride:4,normalised:!0},snorm16x4:{size:4,stride:8,normalised:!0},float16x2:{size:2,stride:4,normalised:!1},float16x4:{size:4,stride:8,normalised:!1},float32:{size:1,stride:4,normalised:!1},float32x2:{size:2,stride:8,normalised:!1},float32x3:{size:3,stride:12,normalised:!1},float32x4:{size:4,stride:16,normalised:!1},uint32:{size:1,stride:4,normalised:!1},uint32x2:{size:2,stride:8,normalised:!1},uint32x3:{size:3,stride:12,normalised:!1},uint32x4:{size:4,stride:16,normalised:!1},sint32:{size:1,stride:4,normalised:!1},sint32x2:{size:2,stride:8,normalised:!1},sint32x3:{size:3,stride:12,normalised:!1},sint32x4:{size:4,stride:16,normalised:!1}};function Nt(r){return J[r]??J.float32}const jt={f32:"float32","vec2<f32>":"float32x2","vec3<f32>":"float32x3","vec4<f32>":"float32x4",vec2f:"float32x2",vec3f:"float32x3",vec4f:"float32x4",i32:"sint32","vec2<i32>":"sint32x2","vec3<i32>":"sint32x3","vec4<i32>":"sint32x4",u32:"uint32","vec2<u32>":"uint32x2","vec3<u32>":"uint32x3","vec4<u32>":"uint32x4",bool:"uint32","vec2<bool>":"uint32x2","vec3<bool>":"uint32x3","vec4<bool>":"uint32x4"};function Lt({source:r,entryPoint:t}){const e={},i=r.indexOf(`fn ${t}`);if(i!==-1){const n=r.indexOf("->",i);if(n!==-1){const s=r.substring(i,n),a=/@location\((\d+)\)\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)(?:,|\s|$)/g;let o;for(;(o=a.exec(s))!==null;){const u=jt[o[3]]??"float32";e[o[2]]={location:parseInt(o[1],10),format:u,stride:Nt(u).stride,offset:0,instance:!1,start:0}}}}return e}function D(r){const t=/(^|[^/])@(group|binding)\(\d+\)[^;]+;/g,e=/@group\((\d+)\)/,i=/@binding\((\d+)\)/,n=/var(<[^>]+>)? (\w+)/,s=/:\s*(\w+)/,a=/struct\s+(\w+)\s*{([^}]+)}/g,o=/(\w+)\s*:\s*([\w\<\>]+)/g,u=/struct\s+(\w+)/,h=r.match(t)?.map(l=>({group:parseInt(l.match(e)[1],10),binding:parseInt(l.match(i)[1],10),name:l.match(n)[2],isUniform:l.match(n)[1]==="<uniform>",type:l.match(s)[1]}));if(!h)return{groups:[],structs:[]};const f=r.match(a)?.map(l=>{const d=l.match(u)[1],m=l.match(o).reduce((v,g)=>{const[c,y]=g.split(":");return v[c.trim()]=y.trim(),v},{});return m?{name:d,members:m}:null}).filter(({name:l})=>h.some(d=>d.type===l))??[];return{groups:h,structs:f}}var z=(r=>(r[r.VERTEX=1]="VERTEX",r[r.FRAGMENT=2]="FRAGMENT",r[r.COMPUTE=4]="COMPUTE",r))(z||{});function Ot({groups:r}){const t=[];for(let e=0;e<r.length;e++){const i=r[e];t[i.group]||(t[i.group]=[]),i.isUniform?t[i.group].push({binding:i.binding,visibility:z.VERTEX|z.FRAGMENT,buffer:{type:"uniform"}}):i.type==="sampler"?t[i.group].push({binding:i.binding,visibility:z.FRAGMENT,sampler:{type:"filtering"}}):i.type==="texture_2d"&&t[i.group].push({binding:i.binding,visibility:z.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d",multisampled:!1}})}return t}function Ht({groups:r}){const t=[];for(let e=0;e<r.length;e++){const i=r[e];t[i.group]||(t[i.group]={}),t[i.group][i.name]=i.binding}return t}function Kt(r,t){const e=new Set,i=new Set,n=[...r.structs,...t.structs].filter(a=>e.has(a.name)?!1:(e.add(a.name),!0)),s=[...r.groups,...t.groups].filter(a=>{const o=`${a.name}-${a.binding}`;return i.has(o)?!1:(i.add(o),!0)});return{structs:n,groups:s}}const B=Object.create(null);class U{constructor(t){this._layoutKey=0,this._attributeLocationsKey=0;const{fragment:e,vertex:i,layout:n,gpuLayout:s,name:a}=t;if(this.name=a,this.fragment=e,this.vertex=i,e.source===i.source){const o=D(e.source);this.structsAndGroups=o}else{const o=D(i.source),u=D(e.source);this.structsAndGroups=Kt(o,u)}this.layout=n??Ht(this.structsAndGroups),this.gpuLayout=s??Ot(this.structsAndGroups),this.autoAssignGlobalUniforms=this.layout[0]?.globalUniforms!==void 0,this.autoAssignLocalUniforms=this.layout[1]?.localUniforms!==void 0,this._generateProgramKey()}_generateProgramKey(){const{vertex:t,fragment:e}=this,i=t.source+e.source+t.entryPoint+e.entryPoint;this._layoutKey=Q(i,"program")}get attributeData(){return this._attributeData??(this._attributeData=Lt(this.vertex)),this._attributeData}destroy(){this.gpuLayout=null,this.layout=null,this.structsAndGroups=null,this.fragment=null,this.vertex=null,B[this._cacheKey]=null}static from(t){const e=`${t.vertex.source}:${t.fragment.source}:${t.fragment.entryPoint}:${t.vertex.entryPoint}`;return B[e]||(B[e]=new U(t),B[e]._cacheKey=e),B[e]}}const mt=["f32","i32","vec2<f32>","vec3<f32>","vec4<f32>","mat2x2<f32>","mat3x3<f32>","mat4x4<f32>","mat3x2<f32>","mat4x2<f32>","mat2x3<f32>","mat4x3<f32>","mat2x4<f32>","mat3x4<f32>","vec2<i32>","vec3<i32>","vec4<i32>"],Wt=mt.reduce((r,t)=>(r[t]=!0,r),{});function Qt(r,t){switch(r){case"f32":return 0;case"vec2<f32>":return new Float32Array(2*t);case"vec3<f32>":return new Float32Array(3*t);case"vec4<f32>":return new Float32Array(4*t);case"mat2x2<f32>":return new Float32Array([1,0,0,1]);case"mat3x3<f32>":return new Float32Array([1,0,0,0,1,0,0,0,1]);case"mat4x4<f32>":return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}return null}const pt=class gt{constructor(t,e){this._touched=0,this.uid=T("uniform"),this._resourceType="uniformGroup",this._resourceId=T("resource"),this.isUniformGroup=!0,this._dirtyId=0,this.destroyed=!1,e={...gt.defaultOptions,...e},this.uniformStructures=t;const i={};for(const n in t){const s=t[n];if(s.name=n,s.size=s.size??1,!Wt[s.type]){const a=s.type.match(/^array<(\w+(?:<\w+>)?),\s*(\d+)>$/);if(a){const[,o,u]=a;throw new Error(`Uniform type ${s.type} is not supported. Use type: '${o}', size: ${u} instead.`)}throw new Error(`Uniform type ${s.type} is not supported. Supported uniform types are: ${mt.join(", ")}`)}s.value??(s.value=Qt(s.type,s.size)),i[n]=s.value}this.uniforms=i,this._dirtyId=1,this.ubo=e.ubo,this.isStatic=e.isStatic,this._signature=Q(Object.keys(i).map(n=>`${n}-${t[n].type}`).join("-"),"uniform-group")}update(){this._dirtyId++}};pt.defaultOptions={ubo:!1,isStatic:!1};let xt=pt;class F{constructor(t){this.resources=Object.create(null),this._dirty=!0;let e=0;for(const i in t){const n=t[i];this.setResource(n,e++)}this._updateKey()}_updateKey(){if(!this._dirty)return;this._dirty=!1;const t=[];let e=0;for(const i in this.resources)t[e++]=this.resources[i]._resourceId;this._key=t.join("|")}setResource(t,e){const i=this.resources[e];t!==i&&(i&&t.off?.("change",this.onResourceChange,this),t.on?.("change",this.onResourceChange,this),this.resources[e]=t,this._dirty=!0)}getResource(t){return this.resources[t]}_touch(t){const e=this.resources;for(const i in e)e[i]._touched=t}destroy(){const t=this.resources;for(const e in t)t[e]?.off?.("change",this.onResourceChange,this);this.resources=null}onResourceChange(t){if(this._dirty=!0,t.destroyed){const e=this.resources;for(const i in e)e[i]===t&&(e[i]=null)}else this._updateKey()}}var K=(r=>(r[r.WEBGL=1]="WEBGL",r[r.WEBGPU=2]="WEBGPU",r[r.BOTH=3]="BOTH",r))(K||{});class V extends Gt{constructor(t){super(),this.uid=T("shader"),this._uniformBindMap=Object.create(null),this._ownedBindGroups=[];let{gpuProgram:e,glProgram:i,groups:n,resources:s,compatibleRenderers:a,groupMap:o}=t;this.gpuProgram=e,this.glProgram=i,a===void 0&&(a=0,e&&(a|=K.WEBGPU),i&&(a|=K.WEBGL)),this.compatibleRenderers=a;const u={};if(!s&&!n&&(s={}),s&&n)throw new Error("[Shader] Cannot have both resources and groups");if(!e&&n&&!o)throw new Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");if(!e&&n&&o)for(const h in o)for(const f in o[h]){const l=o[h][f];u[l]={group:h,binding:f,name:l}}else if(e&&n&&!o){const h=e.structsAndGroups.groups;o={},h.forEach(f=>{o[f.group]=o[f.group]||{},o[f.group][f.binding]=f.name,u[f.name]=f})}else if(s){n={},o={},e&&e.structsAndGroups.groups.forEach(l=>{o[l.group]=o[l.group]||{},o[l.group][l.binding]=l.name,u[l.name]=l});let h=0;for(const f in s)u[f]||(n[99]||(n[99]=new F,this._ownedBindGroups.push(n[99])),u[f]={group:99,binding:h,name:f},o[99]=o[99]||{},o[99][h]=f,h++);for(const f in s){const l=f;let d=s[f];!d.source&&!d._resourceType&&(d=new xt(d));const m=u[l];m&&(n[m.group]||(n[m.group]=new F,this._ownedBindGroups.push(n[m.group])),n[m.group].setResource(d,m.binding))}}this.groups=n,this._uniformBindMap=o,this.resources=this._buildResourceAccessor(n,u)}addResource(t,e,i){var n,s;(n=this._uniformBindMap)[e]||(n[e]={}),(s=this._uniformBindMap[e])[i]||(s[i]=t),this.groups[e]||(this.groups[e]=new F,this._ownedBindGroups.push(this.groups[e]))}_buildResourceAccessor(t,e){const i={};for(const n in e){const s=e[n];Object.defineProperty(i,s.name,{get(){return t[s.group].getResource(s.binding)},set(a){t[s.group].setResource(a,s.binding)}})}return i}destroy(t=!1){this.emit("destroy",this),t&&(this.gpuProgram?.destroy(),this.glProgram?.destroy()),this.gpuProgram=null,this.glProgram=null,this.removeAllListeners(),this._uniformBindMap=null,this._ownedBindGroups.forEach(e=>{e.destroy()}),this._ownedBindGroups=null,this.resources=null,this.groups=null}static from(t){const{gpu:e,gl:i,...n}=t;let s,a;return e&&(s=U.from(e)),i&&(a=q.from(i)),new V({gpuProgram:s,glProgram:a,...n})}}const vt=class W extends V{constructor(t){t={...W.defaultOptions,...t},super(t),this.enabled=!0,this._state=Bt.for2d(),this.blendMode=t.blendMode,this.padding=t.padding,typeof t.antialias=="boolean"?this.antialias=t.antialias?"on":"off":this.antialias=t.antialias,this.resolution=t.resolution,this.blendRequired=t.blendRequired,this.clipToViewport=t.clipToViewport,this.addResource("uTexture",0,1)}apply(t,e,i,n){t.applyFilter(this,e,i,n)}get blendMode(){return this._state.blendMode}set blendMode(t){this._state.blendMode=t}static from(t){const{gpu:e,gl:i,...n}=t;let s,a;return e&&(s=U.from(e)),i&&(a=q.from(i)),new W({gpuProgram:s,glProgram:a,...n})}};vt.defaultOptions={blendMode:"normal",resolution:1,padding:0,antialias:"off",blendRequired:!1,clipToViewport:!0};let Ce=vt;class tt{constructor(t){typeof t=="number"?this.rawBinaryData=new ArrayBuffer(t):t instanceof Uint8Array?this.rawBinaryData=t.buffer:this.rawBinaryData=t,this.uint32View=new Uint32Array(this.rawBinaryData),this.float32View=new Float32Array(this.rawBinaryData),this.size=this.rawBinaryData.byteLength}get int8View(){return this._int8View||(this._int8View=new Int8Array(this.rawBinaryData)),this._int8View}get uint8View(){return this._uint8View||(this._uint8View=new Uint8Array(this.rawBinaryData)),this._uint8View}get int16View(){return this._int16View||(this._int16View=new Int16Array(this.rawBinaryData)),this._int16View}get int32View(){return this._int32View||(this._int32View=new Int32Array(this.rawBinaryData)),this._int32View}get float64View(){return this._float64Array||(this._float64Array=new Float64Array(this.rawBinaryData)),this._float64Array}get bigUint64View(){return this._bigUint64Array||(this._bigUint64Array=new BigUint64Array(this.rawBinaryData)),this._bigUint64Array}view(t){return this[`${t}View`]}destroy(){this.rawBinaryData=null,this._int8View=null,this._uint8View=null,this._int16View=null,this.uint16View=null,this._int32View=null,this.uint32View=null,this.float32View=null}static sizeOf(t){switch(t){case"int8":case"uint8":return 1;case"int16":case"uint16":return 2;case"int32":case"uint32":case"float32":return 4;default:throw new Error(`${t} isn't a valid view type`)}}}function et(r,t){const e=r.byteLength/8|0,i=new Float64Array(r,0,e);new Float64Array(t,0,e).set(i);const s=r.byteLength-e*8;if(s>0){const a=new Uint8Array(r,e*8,s);new Uint8Array(t,e*8,s).set(a)}}const qt={normal:"normal-npm",add:"add-npm",screen:"screen-npm"};var Xt=(r=>(r[r.DISABLED=0]="DISABLED",r[r.RENDERING_MASK_ADD=1]="RENDERING_MASK_ADD",r[r.MASK_ACTIVE=2]="MASK_ACTIVE",r[r.INVERSE_MASK_ACTIVE=3]="INVERSE_MASK_ACTIVE",r[r.RENDERING_MASK_REMOVE=4]="RENDERING_MASK_REMOVE",r[r.NONE=5]="NONE",r))(Xt||{});function rt(r,t){return t.alphaMode==="no-premultiply-alpha"&&qt[r]||r}const Yt=["precision mediump float;","void main(void){","float test = 0.1;","%forloop%","gl_FragColor = vec4(0.0);","}"].join(`
`);function Zt(r){let t="";for(let e=0;e<r;++e)e>0&&(t+=`
else `),e<r-1&&(t+=`if(test == ${e}.0){}`);return t}function Jt(r,t){if(r===0)throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");const e=t.createShader(t.FRAGMENT_SHADER);try{for(;;){const i=Yt.replace(/%forloop%/gi,Zt(r));if(t.shaderSource(e,i),t.compileShader(e),!t.getShaderParameter(e,t.COMPILE_STATUS))r=r/2|0;else break}}finally{t.deleteShader(e)}return r}let w=null;function te(){if(w)return w;const r=ht();return w=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),w=Jt(w,r),r.getExtension("WEBGL_lose_context")?.loseContext(),w}class ee{constructor(){this.ids=Object.create(null),this.textures=[],this.count=0}clear(){for(let t=0;t<this.count;t++){const e=this.textures[t];this.textures[t]=null,this.ids[e.uid]=null}this.count=0}}class re{constructor(){this.renderPipeId="batch",this.action="startBatch",this.start=0,this.size=0,this.textures=new ee,this.blendMode="normal",this.topology="triangle-strip",this.canBundle=!0}destroy(){this.textures=null,this.gpuBindGroup=null,this.bindGroup=null,this.batcher=null}}const G=[];let R=0;It.register({clear:()=>{if(G.length>0)for(const r of G)r&&r.destroy();G.length=0,R=0}});function it(){return R>0?G[--R]:new re}function nt(r){G[R++]=r}let P=0;const bt=class yt{constructor(t){this.uid=T("batcher"),this.dirty=!0,this.batchIndex=0,this.batches=[],this._elements=[],t={...yt.defaultOptions,...t},t.maxTextures||(Ut("v8.8.0","maxTextures is a required option for Batcher now, please pass it in the options"),t.maxTextures=te());const{maxTextures:e,attributesInitialSize:i,indicesInitialSize:n}=t;this.attributeBuffer=new tt(i*4),this.indexBuffer=new Uint16Array(n),this.maxTextures=e}begin(){this.elementSize=0,this.elementStart=0,this.indexSize=0,this.attributeSize=0;for(let t=0;t<this.batchIndex;t++)nt(this.batches[t]);this.batchIndex=0,this._batchIndexStart=0,this._batchIndexSize=0,this.dirty=!0}add(t){this._elements[this.elementSize++]=t,t._indexStart=this.indexSize,t._attributeStart=this.attributeSize,t._batcher=this,this.indexSize+=t.indexSize,this.attributeSize+=t.attributeSize*this.vertexSize}checkAndUpdateTexture(t,e){const i=t._batch.textures.ids[e._source.uid];return!i&&i!==0?!1:(t._textureId=i,t.texture=e,!0)}updateElement(t){this.dirty=!0;const e=this.attributeBuffer;t.packAsQuad?this.packQuadAttributes(t,e.float32View,e.uint32View,t._attributeStart,t._textureId):this.packAttributes(t,e.float32View,e.uint32View,t._attributeStart,t._textureId)}break(t){const e=this._elements;if(!e[this.elementStart])return;let i=it(),n=i.textures;n.clear();const s=e[this.elementStart];let a=rt(s.blendMode,s.texture._source),o=s.topology;this.attributeSize*4>this.attributeBuffer.size&&this._resizeAttributeBuffer(this.attributeSize*4),this.indexSize>this.indexBuffer.length&&this._resizeIndexBuffer(this.indexSize);const u=this.attributeBuffer.float32View,h=this.attributeBuffer.uint32View,f=this.indexBuffer;let l=this._batchIndexSize,d=this._batchIndexStart,m="startBatch";const v=this.maxTextures;for(let g=this.elementStart;g<this.elementSize;++g){const c=e[g];e[g]=null;const x=c.texture._source,p=rt(c.blendMode,x),b=a!==p||o!==c.topology;if(x._batchTick===P&&!b){c._textureId=x._textureBindLocation,l+=c.indexSize,c.packAsQuad?(this.packQuadAttributes(c,u,h,c._attributeStart,c._textureId),this.packQuadIndex(f,c._indexStart,c._attributeStart/this.vertexSize)):(this.packAttributes(c,u,h,c._attributeStart,c._textureId),this.packIndex(c,f,c._indexStart,c._attributeStart/this.vertexSize)),c._batch=i;continue}x._batchTick=P,(n.count>=v||b)&&(this._finishBatch(i,d,l-d,n,a,o,t,m),m="renderBatch",d=l,a=p,o=c.topology,i=it(),n=i.textures,n.clear(),++P),c._textureId=x._textureBindLocation=n.count,n.ids[x.uid]=n.count,n.textures[n.count++]=x,c._batch=i,l+=c.indexSize,c.packAsQuad?(this.packQuadAttributes(c,u,h,c._attributeStart,c._textureId),this.packQuadIndex(f,c._indexStart,c._attributeStart/this.vertexSize)):(this.packAttributes(c,u,h,c._attributeStart,c._textureId),this.packIndex(c,f,c._indexStart,c._attributeStart/this.vertexSize))}n.count>0&&(this._finishBatch(i,d,l-d,n,a,o,t,m),d=l,++P),this.elementStart=this.elementSize,this._batchIndexStart=d,this._batchIndexSize=l}_finishBatch(t,e,i,n,s,a,o,u){t.gpuBindGroup=null,t.bindGroup=null,t.action=u,t.batcher=this,t.textures=n,t.blendMode=s,t.topology=a,t.start=e,t.size=i,++P,this.batches[this.batchIndex++]=t,o.add(t)}finish(t){this.break(t)}ensureAttributeBuffer(t){t*4<=this.attributeBuffer.size||this._resizeAttributeBuffer(t*4)}ensureIndexBuffer(t){t<=this.indexBuffer.length||this._resizeIndexBuffer(t)}_resizeAttributeBuffer(t){const e=Math.max(t,this.attributeBuffer.size*2),i=new tt(e);et(this.attributeBuffer.rawBinaryData,i.rawBinaryData),this.attributeBuffer=i}_resizeIndexBuffer(t){const e=this.indexBuffer;let i=Math.max(t,e.length*1.5);i+=i%2;const n=i>65535?new Uint32Array(i):new Uint16Array(i);if(n.BYTES_PER_ELEMENT!==e.BYTES_PER_ELEMENT)for(let s=0;s<e.length;s++)n[s]=e[s];else et(e.buffer,n.buffer);this.indexBuffer=n}packQuadIndex(t,e,i){t[e]=i+0,t[e+1]=i+1,t[e+2]=i+2,t[e+3]=i+0,t[e+4]=i+2,t[e+5]=i+3}packIndex(t,e,i,n){const s=t.indices,a=t.indexSize,o=t.indexOffset,u=t.attributeOffset;for(let h=0;h<a;h++)e[i++]=n+s[h+o]-u}destroy(){if(this.batches!==null){for(let t=0;t<this.batches.length;t++)nt(this.batches[t]);this.batches=null;for(let t=0;t<this._elements.length;t++)this._elements[t]&&(this._elements[t]._batch=null);this._elements=null,this.indexBuffer=null,this.attributeBuffer.destroy(),this.attributeBuffer=null}}};bt.defaultOptions={maxTextures:null,attributesInitialSize:4,indicesInitialSize:6};let ie=bt;const ne=new Float32Array(1),se=new Uint32Array(1);class oe extends Pt{constructor(){const e=new Y({data:ne,label:"attribute-batch-buffer",usage:I.VERTEX|I.COPY_DST,shrinkToFit:!1}),i=new Y({data:se,label:"index-batch-buffer",usage:I.INDEX|I.COPY_DST,shrinkToFit:!1}),n=24;super({attributes:{aPosition:{buffer:e,format:"float32x2",stride:n,offset:0},aUV:{buffer:e,format:"float32x2",stride:n,offset:8},aColor:{buffer:e,format:"unorm8x4",stride:n,offset:16},aTextureIdAndRound:{buffer:e,format:"uint16x2",stride:n,offset:20}},indexBuffer:i})}}function st(r,t,e){if(r)for(const i in r){const n=i.toLocaleLowerCase(),s=t[n];if(s){let a=r[i];i==="header"&&(a=a.replace(/@in\s+[^;]+;\s*/g,"").replace(/@out\s+[^;]+;\s*/g,"")),e&&s.push(`//----${e}----//`),s.push(a)}else Et(`${i} placement hook does not exist in shader`)}}const ae=/\{\{(.*?)\}\}/g;function ot(r){const t={};return(r.match(ae)?.map(i=>i.replace(/[{()}]/g,""))??[]).forEach(i=>{t[i]=[]}),t}function at(r,t){let e;const i=/@in\s+([^;]+);/g;for(;(e=i.exec(r))!==null;)t.push(e[1])}function ut(r,t,e=!1){const i=[];at(t,i),r.forEach(o=>{o.header&&at(o.header,i)});const n=i;e&&n.sort();const s=n.map((o,u)=>`       @location(${u}) ${o},`).join(`
`);let a=t.replace(/@in\s+[^;]+;\s*/g,"");return a=a.replace("{{in}}",`
${s}
`),a}function ct(r,t){let e;const i=/@out\s+([^;]+);/g;for(;(e=i.exec(r))!==null;)t.push(e[1])}function ue(r){const e=/\b(\w+)\s*:/g.exec(r);return e?e[1]:""}function ce(r){const t=/@.*?\s+/g;return r.replace(t,"")}function le(r,t){const e=[];ct(t,e),r.forEach(u=>{u.header&&ct(u.header,e)});let i=0;const n=e.sort().map(u=>u.indexOf("builtin")>-1?u:`@location(${i++}) ${u}`).join(`,
`),s=e.sort().map(u=>`       var ${ce(u)};`).join(`
`),a=`return VSOutput(
            ${e.sort().map(u=>` ${ue(u)}`).join(`,
`)});`;let o=t.replace(/@out\s+[^;]+;\s*/g,"");return o=o.replace("{{struct}}",`
${n}
`),o=o.replace("{{start}}",`
${s}
`),o=o.replace("{{return}}",`
${a}
`),o}function lt(r,t){let e=r;for(const i in t){const n=t[i];n.join(`
`).length?e=e.replace(`{{${i}}}`,`//-----${i} START-----//
${n.join(`
`)}
//----${i} FINISH----//`):e=e.replace(`{{${i}}}`,"")}return e}const _=Object.create(null),k=new Map;let fe=0;function he({template:r,bits:t}){const e=_t(r,t);if(_[e])return _[e];const{vertex:i,fragment:n}=me(r,t);return _[e]=St(i,n,t),_[e]}function de({template:r,bits:t}){const e=_t(r,t);return _[e]||(_[e]=St(r.vertex,r.fragment,t)),_[e]}function me(r,t){const e=t.map(a=>a.vertex).filter(a=>!!a),i=t.map(a=>a.fragment).filter(a=>!!a);let n=ut(e,r.vertex,!0);n=le(e,n);const s=ut(i,r.fragment,!0);return{vertex:n,fragment:s}}function _t(r,t){return t.map(e=>(k.has(e)||k.set(e,fe++),k.get(e))).sort((e,i)=>e-i).join("-")+r.vertex+r.fragment}function St(r,t,e){const i=ot(r),n=ot(t);return e.forEach(s=>{st(s.vertex,i,s.name),st(s.fragment,n,s.name)}),{vertex:lt(r,i),fragment:lt(t,n)}}const pe=`
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}

        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);

        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`,ge=`
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;

    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {

        {{start}}

        var outColor:vec4<f32>;

        {{main}}

        var finalColor:vec4<f32> = outColor * vColor;

        {{end}}

        return finalColor;
      };
`,xe=`
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;

        {{start}}

        vColor = vec4(1.);

        {{main}}

        vUV = uv;

        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`,ve=`

    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {

        {{start}}

        vec4 outColor;

        {{main}}

        finalColor = outColor * vColor;

        {{end}}
    }
`,be={name:"global-uniforms-bit",vertex:{header:`
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `}},ye={name:"global-uniforms-bit",vertex:{header:`
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `}};function _e({bits:r,name:t}){const e=he({template:{fragment:ge,vertex:pe},bits:[be,...r]});return U.from({name:t,vertex:{source:e.vertex,entryPoint:"main"},fragment:{source:e.fragment,entryPoint:"main"}})}function Se({bits:r,name:t}){return new q({name:t,...de({template:{vertex:xe,fragment:ve},bits:[ye,...r]})})}const we={name:"color-bit",vertex:{header:`
            @in aColor: vec4<f32>;
        `,main:`
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `}},Ae={name:"color-bit",vertex:{header:`
            in vec4 aColor;
        `,main:`
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `}},N={};function Be(r){const t=[];if(r===1)t.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"),t.push("@group(1) @binding(1) var textureSampler1: sampler;");else{let e=0;for(let i=0;i<r;i++)t.push(`@group(1) @binding(${e++}) var textureSource${i+1}: texture_2d<f32>;`),t.push(`@group(1) @binding(${e++}) var textureSampler${i+1}: sampler;`)}return t.join(`
`)}function Pe(r){const t=[];if(r===1)t.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");else{t.push("switch vTextureId {");for(let e=0;e<r;e++)e===r-1?t.push("  default:{"):t.push(`  case ${e}:{`),t.push(`      outColor = textureSampleGrad(textureSource${e+1}, textureSampler${e+1}, vUV, uvDx, uvDy);`),t.push("      break;}");t.push("}")}return t.join(`
`)}function ze(r){return N[r]||(N[r]={name:"texture-batch-bit",vertex:{header:`
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `},fragment:{header:`
                @in @interpolate(flat) vTextureId: u32;

                ${Be(r)}
            `,main:`
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${Pe(r)}
            `}}),N[r]}const j={};function Ge(r){const t=[];for(let e=0;e<r;e++)e>0&&t.push("else"),e<r-1&&t.push(`if(vTextureId < ${e}.5)`),t.push("{"),t.push(`	outColor = texture(uTextures[${e}], vUV);`),t.push("}");return t.join(`
`)}function Ue(r){return j[r]||(j[r]={name:"texture-batch-bit",vertex:{header:`
                in vec2 aTextureIdAndRound;
                out float vTextureId;

            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `},fragment:{header:`
                in float vTextureId;

                uniform sampler2D uTextures[${r}];

            `,main:`

                ${Ge(r)}
            `}}),j[r]}const Ie={name:"round-pixels-bit",vertex:{header:`
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32>
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},Ee={name:"round-pixels-bit",vertex:{header:`
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},ft={};function Me(r){let t=ft[r];if(t)return t;const e=new Int32Array(r);for(let i=0;i<r;i++)e[i]=i;return t=ft[r]=new xt({uTextures:{value:e,type:"i32",size:r}},{isStatic:!0}),t}class Te extends V{constructor(t){const e=Se({name:"batch",bits:[Ae,Ue(t),Ee]}),i=_e({name:"batch",bits:[we,ze(t),Ie]});super({glProgram:e,gpuProgram:i,resources:{batchSamplers:Me(t)}})}}let L=null;const wt=class At extends ie{constructor(t){super(t),this.geometry=new oe,this.name=At.extension.name,this.vertexSize=6,L??(L=new Te(t.maxTextures)),this.shader=L}packAttributes(t,e,i,n,s){const a=s<<16|t.roundPixels&65535,o=t.transform,u=o.a,h=o.b,f=o.c,l=o.d,d=o.tx,m=o.ty,{positions:v,uvs:g}=t,c=t.color,y=t.attributeOffset,x=y+t.attributeSize;for(let p=y;p<x;p++){const b=p*2,S=v[b],X=v[b+1];e[n++]=u*S+f*X+d,e[n++]=l*X+h*S+m,e[n++]=g[b],e[n++]=g[b+1],i[n++]=c,i[n++]=a}}packQuadAttributes(t,e,i,n,s){const a=t.texture,o=t.transform,u=o.a,h=o.b,f=o.c,l=o.d,d=o.tx,m=o.ty,v=t.bounds,g=v.maxX,c=v.minX,y=v.maxY,x=v.minY,p=a.uvs,b=t.color,S=s<<16|t.roundPixels&65535;e[n+0]=u*c+f*x+d,e[n+1]=l*x+h*c+m,e[n+2]=p.x0,e[n+3]=p.y0,i[n+4]=b,i[n+5]=S,e[n+6]=u*g+f*x+d,e[n+7]=l*x+h*g+m,e[n+8]=p.x1,e[n+9]=p.y1,i[n+10]=b,i[n+11]=S,e[n+12]=u*g+f*y+d,e[n+13]=l*y+h*g+m,e[n+14]=p.x2,e[n+15]=p.y2,i[n+16]=b,i[n+17]=S,e[n+18]=u*c+f*y+d,e[n+19]=l*y+h*c+m,e[n+20]=p.x3,e[n+21]=p.y3,i[n+22]=b,i[n+23]=S}};wt.extension={type:[Mt.Batcher],name:"default"};let $e=wt;const O={name:"local-uniform-bit",vertex:{header:`

            struct LocalUniforms {
                uTransformMatrix:mat3x3<f32>,
                uColor:vec4<f32>,
                uRound:f32,
            }

            @group(1) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `}},De={...O,vertex:{...O.vertex,header:O.vertex.header.replace("group(1)","group(2)")}},Fe={name:"local-uniform-bit",vertex:{header:`

            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix = uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `}};class ke{constructor(){this.batcherName="default",this.topology="triangle-list",this.attributeSize=4,this.indexSize=6,this.packAsQuad=!0,this.roundPixels=0,this._attributeStart=0,this._batcher=null,this._batch=null}get blendMode(){return this.renderable.groupBlendMode}get color(){return this.renderable.groupColorAlpha}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.bounds=null}destroy(){}}function Ne(r,t,e){const i=(r>>24&255)/255;t[e++]=(r&255)/255*i,t[e++]=(r>>8&255)/255*i,t[e++]=(r>>16&255)/255*i,t[e++]=i}export{F as B,$e as D,Ce as F,U as G,K as R,Xt as S,xt as U,tt as V,_e as a,we as b,Q as c,V as d,O as e,et as f,ze as g,q as h,Nt as i,ke as j,Ne as k,De as l,Jt as m,Se as n,Ae as o,Ue as p,Fe as q,Ie as r,Ee as s,Me as t,rt as u};
