
// Command Center 0.3: offline hunt analytics and safe account-integration preparation.
(function(){
  const more=document.createElement('style');
  more.textContent='.chart{height:220px;width:100%;display:block}.chart text{fill:#acc6d5;font:12px system-ui}.account-status{border-left:4px solid #e8c58b;padding:12px;background:#162c39} .wide{grid-column:1/-1}';
  document.head.append(more);
  const extra=document.createElement('section');extra.id='Analytics';
  extra.innerHTML='<h2>Hunt Analytics</h2><div class="card"><h3>Recorded hunt duration</h3><p class="muted">Uses only hunts you have entered in this browser. Lower times indicate faster finishes.</p><svg id="huntChart" class="chart" viewBox="0 0 720 220" role="img" aria-label="Bar chart of recorded hunt duration"></svg></div><div class="card"><h3>Personal bests</h3><div id="bests"></div></div>';
  document.querySelector('main').append(extra);tabs.push('Analytics');
  const conn=document.createElement('section');conn.id='Account';
  conn.innerHTML='<h2>Account Integration</h2><div class="card"><h3>Connection status: Not configured</h3><p>Dauntless Revived uses a personal server-issued account key. This static GitHub Pages site cannot securely store that key or independently authenticate to your game server.</p><p class="account-status">Do not paste your account key here. A future connection requires an authorized, dedicated backend with HTTPS and server-approved read-only account access.</p><h3>Available now</h3><p>You can track hunts and import or export your companion data without linking an account.</p></div>';
  document.querySelector('main').append(conn);tabs.push('Account');
  document.getElementById('nav').innerHTML=tabs.map(t=>{const b=document.createElement('button');b.textContent=t;b.onclick=()=>tab(t);return b.outerHTML.replace('<button','<button onclick="tab(\''+t+'\')"')}).join('');
  const oldRender=render;
  render=function(){oldRender();drawAnalytics()};
  function drawAnalytics(){
    const chart=document.getElementById('huntChart');if(!chart)return;
    const svgNS='http://www.w3.org/2000/svg';chart.replaceChildren();
    const hunts=(Array.isArray(data.hunts)?data.hunts:[]).filter(h=>Number.isFinite(Number(h.duration))&&Number(h.duration)>=0).slice(-10);
    const add=(tag,attrs,txt)=>{const e=document.createElementNS(svgNS,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(txt!==undefined)e.textContent=txt;chart.appendChild(e)};
    if(!hunts.length){add('text',{x:20,y:105},'Record a hunt to see your performance graph.');document.getElementById('bests').textContent='No hunts recorded yet.';return}
    const max=Math.max(1,...hunts.map(h=>Number(h.duration)));const step=670/hunts.length;
    hunts.forEach((h,i)=>{const height=145*Number(h.duration)/max;const x=25+i*step;add('rect',{x,y:175-height,width:Math.max(9,step-10),height,rx:4,fill:'#3ca9c2'});add('text',{x,y:193},String(i+1));add('text',{x,y:Math.max(14,166-height)},Math.round(Number(h.duration))+'s')});
    const best=new Map();hunts.concat((data.hunts||[]).slice(0,-10)).forEach(h=>{const n=String(h.behemoth||'Unknown');const d=Number(h.duration);if(Number.isFinite(d)&&d>=0&&(!best.has(n)||d<best.get(n)))best.set(n,d)});
    const target=document.getElementById('bests');target.replaceChildren(...[...best].sort((a,b)=>a[1]-b[1]).slice(0,15).map(([name,time])=>{let p=document.createElement('p');p.textContent=name+' — '+time+' seconds';return p}));
  }
  const originalTab=tab;
  tab=function(t){originalTab(t);if(t==='Analytics')drawAnalytics()};
  drawAnalytics();
})();