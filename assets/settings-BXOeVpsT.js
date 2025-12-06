import{g as $,s as S,w as f,d as M}from"./index-CfNnot19.js";const s=$(),A=t=>Math.round(t*100)/100,u=document.getElementById("settings-container"),w=()=>document.getElementById("settings").getAttribute("data-events-enabled")==="true",h=[];let v=0;const m=()=>h[v],g=(t,e)=>{s[e]===M[e]?t.classList.remove("edited"):t.classList.add("edited")};u.addEventListener("keydown",t=>{w()&&["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(t.key)&&t.preventDefault()});const p=t=>{m().classList.remove("selected");const e=(t+v+h.length)%h.length;v=isNaN(e)?0:e;const n=m();n.classList.add("selected"),n.scrollIntoView({behavior:"smooth",block:"nearest"})};document.addEventListener("keydown",t=>{w()&&(t.code==="ArrowDown"?p(1):t.code==="ArrowUp"&&p(-1),(t.code==="ArrowDown"||t.code==="ArrowUp"||t.code==="Enter"||t.code==="ArrowLeft"||t.code==="ArrowRight")&&S.levelSelect.play())});class C{element;#e;#t;#n;constructor(e,n){this.#e=e,this.#t=n,this.#n=s[e]}getConfigProperty(){return this.#e}getDefaultValue(){return this.#n}getProps(){return this.#t}insertHTML(e){u.insertAdjacentHTML("beforeend",e),this.element=u.lastElementChild,h.push(this.element),g(this.element,this.#e)}}class a extends C{getLightContent(e){return e===!0?"var(--main-color)":"transparent"}onChange=()=>{};constructor(e,n){super(e,n);const r=n.name,d=n.description;this.insertHTML(`
        <div id="${e}" class="setting boolean">
            <div class="light" style="--after-bg-color: ${this.getLightContent(this.getDefaultValue())}"></div>
            <div class="inner">
                <p class="name">${r}</p> 
                ${d?`
                <p class="description">${d}</p>
                `:""}
            </div>
        </div>`);const c=()=>{S.levelSelect.play(),this.setValue(!s[e])};this.element.addEventListener("click",()=>c()),document.addEventListener("keydown",o=>{m()!==this.element||!w()||(o.code==="ArrowLeft"||o.code==="ArrowRight"||o.code==="Enter")&&c()})}setValue(e){const n=this.getConfigProperty();s[n]=e;const r=s[n];this.element.querySelector(".light").style.setProperty("--after-bg-color",this.getLightContent(r)),g(this.element,n),f(s),this.onChange()}}class y extends C{constructor(e,n){super(e,n);const r=n.name,d=n.min,c=n.max,o=n.shift;this.insertHTML(`
            <div class="setting number" id=${e}>
                <p>${r}</p>
                <p class="value">${this.getDefaultValue()}</p>
                <div class="range-container">
                    <input type="range" min="${d}" max="${c}" step="${o}" value="${this.getDefaultValue()}">
                </div>
            </div>
        `);const L=this.element.querySelector('input[type="range"]'),E=this.element.querySelector(".value");L.addEventListener("input",l=>{const i=l.target.value;E.textContent=i,s[e]=Number(i),f(s),g(this.element,e)}),document.addEventListener("keydown",l=>{if(!(m()!==this.element||!w())&&(l.code==="ArrowLeft"||l.code==="ArrowRight")){let i;l.code==="ArrowLeft"?i=A(s[e]-o):l.code==="ArrowRight"&&(i=A(s[e]+o)),i=Math.max(d,Math.min(c,i)),s[e]=i,E.textContent=s[e].toString(),L.value=i,f(s),g(this.element,e)}})}}const b=t=>u.insertAdjacentHTML("beforeend",`
    <div class="category">
        <span></span>
        <h2>${t}</h2>
        <span></span>
    </div>`);b("Gameplay");new a("invincibleModeEnabled",{name:"Invincible mode",description:"Scores are invalidated when enabled"});new a("swapOnHold",{name:"Swap on Hold",description:"Instant swap on reload if button is hold"});new a("effect3dEnabled",{name:"3D effect",description:"Disable to improve performance"});b("Visuals");new y("playerTiltMult",{name:"Player tilt mult:",min:0,max:1.5,shift:.1});new a("swapHighlightEnabled",{name:"Swap Highlight"});new a("displayFpsEnabled",{name:"Display FPS"});new a("flashOnDeathEnabled",{name:"Flash Effect on death"});new a("swapParticlesEnabled",{name:"Swap Particles"});new a("funModeEnabled",{name:"How funny..."});b("Audio");const D=t=>({name:t,min:0,max:1,shift:.1});new y("musicVolume",D("Music Volume"));new y("soundsVolume",D("Sounds volume"));new a("deathSoundEnabled",{name:"Death sound"});p(0);
