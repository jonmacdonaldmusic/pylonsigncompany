(() => {
  const detail = document.getElementById('sign-detail');
  const markers = new Map();
  let map, selected = SIGN_DATA[0].id;
  const vacant = sign => sign.panels.filter(p => ['Vacant','Missing'].includes(p.status));
  const publicName = sign => ({JP1:'Junction Point 1',JP2:'Junction Point 2',NR1:'Northridge 1',NR4:'Northridge 4',C101:'Grande Central 101',C103:'Grande Central 103'}[sign.id]);
  function mail(sign, panel) {
    const subject = `Sign space inquiry — ${publicName(sign)}${panel ? ' — panel '+panel.position : ''} — ${sign.address}`;
    const body = `Hello Plyon Sign Company,\n\nI’m interested in ${panel ? 'panel '+panel.position : 'sign space'} at ${publicName(sign)} (${sign.name}), ${sign.address}, Grande Prairie.\n\nBusiness name: \nPreferred start date: \nPhone number: \n\nPlease confirm availability and pricing.\n`;
    return `mailto:info@plyonsigncompany.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  function selectSign(sign, fromMap = false) {
    selected = sign.id;
    markers.forEach((marker, id) => { marker.setIcon(icon(SIGN_DATA.find(s=>s.id===id), id===selected)); marker.setZIndexOffset(id===selected ? 1000 : 0); });
    const available = vacant(sign);
    const development = ({JP1:'junction-point-village',JP2:'junction-point-village',NR1:'northridge-business-center',NR4:'northridge-business-center',C101:'grande-central-station',C103:'grande-central-station'})[sign.id];
    const landing = p => `${development}.html?sign=${publicName(sign).toLowerCase().replaceAll(' ','-')}${p ? '&panel='+p.position : ''}`;
    detail.innerHTML = `<p class="eyebrow">${publicName(sign)} · Explore this sign</p><h3>${sign.name}</h3><p class="detail-address">${sign.address} · Grande Prairie</p><div class="sign-overview"><img class="sign-photo" src="${sign.image}" alt="${sign.name} pylon sign at ${sign.address}" width="300" height="400"><div><p class="stack-label">Panel positions · both sides · top to bottom</p><div class="panel-stack">${sign.panels.map(p=>['Vacant','Missing'].includes(p.status) ? `<div class="panel-slot vacant"><span>${p.position}</span><span class="panel-rate"><strong>YOUR BUSINESS HERE</strong></span></div>` : `<div class="panel-slot"><span>${p.position}</span><span>${p.status==='Ad'?'Other signage':'Occupied'}</span></div>`).join('')}</div></div></div>${available.length ? '' : '<p class="full-message">No vacant panels shown in our October 2026 photos. Businesses in this development can ask us about upcoming space on its signs.</p>'}<p class="detail-footer"><a class="button sign-inquiry" href="${mail(sign)}">Ask about this sign</a><a href="${landing()}">Explore sign space</a><a href="https://www.google.com/maps/search/?api=1&query=${sign.coords.join(',')}" target="_blank" rel="noopener">Directions</a></p>`;
    if (fromMap && matchMedia('(max-width:850px)').matches) detail.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  }
  const group = sign => sign.id.startsWith('JP')?'junction':sign.id.startsWith('NR')?'northridge':'central';
  function icon(sign, active) {
    const offsets={JP1:[45,-24],JP2:[45,25],NR1:[-35,-25],NR4:[35,25],C101:[-12,30],C103:[-35,-15]};
    const [dx,dy]=offsets[sign.id];
    return L.divIcon({className:`sign-pin group-${group(sign)} ${active?'selected':''} ${vacant(sign).length?'':'pin-full'}`,html:`<svg class="pin-leader" aria-hidden="true"><path d="M22 16 L${22+dx} ${16+dy}"/></svg><span class="pin-dot" aria-hidden="true"></span><span class="pin-label" style="transform:translate(${dx}px,${dy}px)">${publicName(sign)}</span>`,iconSize:[44,32],iconAnchor:[22,16]});
  }
  if (window.L) {
    map=L.map('sign-map',{scrollWheelZoom:false}).fitBounds(SIGN_DATA.map(s=>s.coords),{padding:[40,40],maxZoom:15});
    const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
    let tileLoaded=false;
    tiles.on('tileload',()=>{tileLoaded=true;document.getElementById('map-help').textContent='Select a pin to view the sign and its vacant panels.';});
    tiles.on('tileerror',()=>{if(!tileLoaded)document.getElementById('map-help').textContent='Map background unavailable. Select a sign pin, or open your development using the links above.';});
    SIGN_DATA.forEach(sign=>{const marker=L.marker(sign.coords,{icon:icon(sign,false),title:`${publicName(sign)} — ${sign.address}`,alt:`${publicName(sign)}: ${vacant(sign).length} vacant panels`,keyboard:true}).addTo(map).bindTooltip(`${publicName(sign)} · ${vacant(sign).length} vacant`);marker.on('click',()=>selectSign(sign,true));markers.set(sign.id,marker);});
    const reset=L.control({position:'topright'});reset.onAdd=function(){const b=L.DomUtil.create('button');b.type='button';b.textContent='All signs';b.style.cssText='background:white;border:1px solid #bbc4b8;border-radius:4px;padding:8px 12px;color:#173c31;cursor:pointer';L.DomEvent.disableClickPropagation(b);b.onclick=()=>map.fitBounds(SIGN_DATA.map(s=>s.coords),{padding:[40,40]});return b;};reset.addTo(map);
  } else {
    document.getElementById('sign-map').hidden=true;document.getElementById('map-help').textContent='Open your development using the links above to see its signs and vacant panels.';
  }
  document.querySelectorAll('[data-explore-sign]').forEach(link=>link.addEventListener('click',()=>{const sign=SIGN_DATA.find(s=>s.id===link.dataset.exploreSign);selectSign(sign);if(map)map.panTo(sign.coords);}));
  selectSign(SIGN_DATA[0]);
})();
