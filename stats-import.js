/* v0.4 local-only Companion stats. Not an official game export or live API client. */
(() => {
"use strict";
const key="drcc-companion-stats-v1", fmt="dauntless-command-center-stats-v1";
const example={format:fmt,profile:{displayName:"Example Slayer",slayerLevel:8,huntPassLevel:4},mastery:[{name:"Sword",rank:6}],currencies:[{name:"Rams",amount:2500}],inventory:[{name:"Example material",type:"Material",quantity:12}],loadouts:[{name:"Example loadout",weapon:"Sword",armor:"Custom set"}]};
const style=document.createElement("style");
style.textContent=".stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px}.stat-notice{border-left:3px solid #dab36e;padding:12px;background:#162e3b}.stat-actions{display:flex;flex-wrap:wrap;gap:8px}";
document.head.append(style);
const section=document.createElement("section");section.id="GameStats";
section.innerHTML='<h2>Slayer Statistics</h2><div class="card"><h3>Import local stats</h3><p class="stat-notice">This feature does not connect to the game. Only import a non-secret Command Center stats file. Never include your account key or player token.</p><p class="muted">The downloadable example is our own format, not an official Dauntless Revived export.</p><div class="stat-actions"><button id="statsTemplate">Download example</button><button id="statsClear">Remove imported stats</button></div><label for="statsFile">Select JSON file (maximum 500 KB)</label><input id="statsFile" type="file" accept=".json,application/json"><p id="statsStatus" role="status">No stats imported.</p></div><div class="grid" id="statsSummary"></div><div class="stat-grid"><div class="card"><h3>Mastery</h3><div id="statsMastery"></div></div><div class="card"><h3>Currencies</h3><div id="statsCurrencies"></div></div><div class="card"><h3>Loadouts</h3><div id="statsLoadouts"></div></div><div class="card"><h3>Inventory</h3><label for="statsSearch">Filter inventory</label><input id="statsSearch" placeholder="Search item names"><div id="statsInventory"></div></div></div>';
document.querySelector("main").append(section);
const navBtn=document.createElement("button");navBtn.textContent="Slayer Stats";navBtn.onclick=()=>tab("GameStats");document.getElementById("nav").append(navBtn);
const el=id=>document.getElementById(id), clean=v=>typeof v==="string"?v.trim().slice(0,120):"", num=v=>Number.isFinite(Number(v))?Math.max(0,Math.min(1e9,Number(v))):0;
function secret(o,depth=0){if(depth>9)return true;if(typeof o==="string")return /UUK_[a-f0-9]{20,}|bearer\s+[a-z0-9._-]+/i.test(o);if(!o||typeof o!=="object")return false;return Object.entries(o).some(([k,v])=>/^(password|secret|apikey|api_key|accountkey|account_key|access_token|refresh_token|authorization)$/i.test(k)||secret(v,depth+1))}
function normalize(o){
 if(!o||o.format!==fmt||secret(o)||!o.profile||typeof o.profile!=="object"||Array.isArray(o.profile))throw Error("Use the example format and exclude credentials.");
 const list=(name,fn)=>{if(o[name]!==undefined&&!Array.isArray(o[name]))throw Error(name+" must be a list.");return (o[name]||[]).slice(0,300).map(x=>fn(x||{}))};
 return {format:fmt,importedAt:new Date().toISOString(),profile:{displayName:clean(o.profile.displayName)||"Imported Slayer",slayerLevel:num(o.profile.slayerLevel),huntPassLevel:num(o.profile.huntPassLevel)},mastery:list("mastery",x=>({name:clean(x.name),rank:num(x.rank)})),currencies:list("currencies",x=>({name:clean(x.name),amount:num(x.amount)})),inventory:list("inventory",x=>({name:clean(x.name),type:clean(x.type),quantity:num(x.quantity)})),loadouts:list("loadouts",x=>({name:clean(x.name),weapon:clean(x.weapon),armor:clean(x.armor)}))};
}
let stats=null;try{const saved=localStorage.getItem(key);if(saved)stats=normalize(JSON.parse(saved))}catch{localStorage.removeItem(key)}
function textNode(parent,tag,value,cls){const n=document.createElement(tag);n.textContent=String(value);if(cls)n.className=cls;parent.append(n)}
function list(id,values,format){const root=el(id);root.replaceChildren();if(!values.length){textNode(root,"p","No data.","muted");return}values.forEach(v=>textNode(root,"p",format(v)))}
function render(){
 el("statsSummary").replaceChildren();
 if(!stats){el("statsStatus").textContent="No imported account data. Live linking is not available.";["statsMastery","statsCurrencies","statsInventory","statsLoadouts"].forEach(id=>el(id).replaceChildren());return}
 el("statsStatus").textContent="Imported locally (not live or verified against the server).";
 [["Slayer",stats.profile.displayName],["Slayer Level",stats.profile.slayerLevel],["Hunt Pass",stats.profile.huntPassLevel],["Items",stats.inventory.length]].forEach(([label,value])=>{const c=document.createElement("div");c.className="card";textNode(c,"small",label);textNode(c,"p",value,"value");el("statsSummary").append(c)});
 list("statsMastery",stats.mastery,x=>x.name+" — rank "+x.rank);
 list("statsCurrencies",stats.currencies,x=>x.name+" — "+x.amount.toLocaleString());
 list("statsLoadouts",stats.loadouts,x=>x.name+": "+x.weapon+" / "+x.armor);
 const term=el("statsSearch").value.toLowerCase();
 list("statsInventory",stats.inventory.filter(x=>(x.name+" "+x.type).toLowerCase().includes(term)),x=>x.name+" ("+x.type+") × "+x.quantity);
}
el("statsTemplate").onclick=()=>{const u=URL.createObjectURL(new Blob([JSON.stringify(example,null,2)],{type:"application/json"}));const a=document.createElement("a");a.href=u;a.download="example-command-center-stats.json";a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};
el("statsClear").onclick=()=>{if(confirm("Remove your imported stats from this browser?")){stats=null;localStorage.removeItem(key);render()}};
el("statsSearch").oninput=render;
el("statsFile").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>500000)throw Error("Maximum file size is 500 KB.");const fresh=normalize(JSON.parse(await f.text()));localStorage.setItem(key,JSON.stringify(fresh));stats=fresh;render()}catch(err){el("statsStatus").textContent="Import rejected: "+err.message}finally{e.target.value=""}};
render();
})();