(() => {
 const names={JP1:'Junction Point 1',JP2:'Junction Point 2',NR1:'Northridge 1',NR4:'Northridge 4',C101:'Grande Central 101',C103:'Grande Central 103'};
 const slug=s=>names[s.id].toLowerCase().replaceAll(' ','-');
 const dev=DEVELOPMENTS.find(d=>d.slug===document.body.dataset.development);
 if(!dev)return;
 const signs=dev.signs.map(id=>SIGN_DATA.find(s=>s.id===id));
 const params=new URLSearchParams(location.search);
 function email(sign,panel){
  const place=sign?`${names[sign.id]}, ${sign.address}`:dev.name;
  const subject=`Sign space inquiry — ${place}${panel?' — panel '+panel.position:''}`;
  const body=`Hello Plyon Sign Company,\n\nI’m interested in ${panel?'panel '+panel.position:'sign space'} at ${place}${sign?', '+dev.name:''}, Grande Prairie.\n\nBusiness name: \nPreferred start date: \nPhone number: \n\nPlease let me know about availability, pricing, artwork, and installation.\n`;
  return `mailto:info@plyonsigncompany.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
 }
 function select(sign,panel,focus=false){
  document.getElementById('selection').hidden=false;
  document.querySelector('#selection .eyebrow').textContent=sign?'Your selected spot':'Find your spot';
  document.getElementById('selected-name').textContent=sign?names[sign.id]:dev.name;
  document.getElementById('selected-address').textContent=sign?`${sign.address} · Grande Prairie`:'Two pylon signs · Grande Prairie';
  document.getElementById('selected-panel').textContent=panel?`You’re exploring panel ${panel.position}. Ask us about this spot or explore the other sign above.`:'For businesses in this development: view both signs above and ask about space at your property.';
  document.querySelectorAll('.inquiry').forEach(a=>a.href=email(sign,panel));
  document.querySelectorAll('[data-select-panel]').forEach(b=>b.setAttribute('aria-pressed',String(!!panel&&b.dataset.sign===sign.id&&b.dataset.selectPanel===String(panel.position))));
  if(focus){
   const next=new URLSearchParams({sign:slug(sign),panel:String(panel.position)});history.replaceState(null,'','?'+next.toString());
   document.getElementById('selection').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
   const button=document.querySelector('.sales-hero .inquiry');button.focus({preventScroll:true});
  }
 }
 const host=document.getElementById('development-sign-list');
 signs.forEach(sign=>{
  const card=document.createElement('article');card.className='development-sign';card.id='sign-'+slug(sign);
  card.innerHTML=`<img class="development-photo" src="${sign.image}" alt="${names[sign.id]} pylon sign at ${sign.address}" width="600" height="750" loading="lazy"><div class="development-sign-content"><h2>${names[sign.id]}</h2><p class="sign-address">${sign.address}</p><p class="stack-label">Panel positions · both sides · top to bottom</p><div class="panel-stack">${sign.panels.map(p=>['Vacant','Missing'].includes(p.status)?`<div class="panel-slot vacant"><span>${p.position}</span><span class="panel-rate"><strong>YOUR BUSINESS HERE</strong></span></div>`:`<div class="panel-slot"><span>${p.position}</span><span>${p.status==='Ad'?'Other signage':'Occupied'}</span></div>`).join('')}</div>${sign.panels.some(p=>['Vacant','Missing'].includes(p.status))?'':'<p class="fine">No vacant panels shown. Ask us about upcoming space.</p>'}<a class="button sign-inquiry" href="${email(sign)}">Ask about this sign</a><a class="sign-directions" href="https://www.google.com/maps/search/?api=1&query=${sign.coords.join(',')}" target="_blank" rel="noopener">Directions</a></div>`;
  host.appendChild(card);
 });
 host.querySelectorAll('[data-select-panel]').forEach(b=>b.addEventListener('click',()=>{const sign=signs.find(s=>s.id===b.dataset.sign);select(sign,sign.panels.find(p=>String(p.position)===b.dataset.selectPanel),true);}));
 const initial=signs.find(s=>slug(s)===params.get('sign'));
 const panel=initial?.panels.find(p=>String(p.position)===params.get('panel')&&['Vacant','Missing'].includes(p.status));
 select(initial,panel);
})();
