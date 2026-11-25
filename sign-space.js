(() => {
 const p=new URLSearchParams(location.search);
 const routes={'junction-point-1':'junction-point-village','junction-point-2':'junction-point-village','northridge-1':'northridge-business-center','northridge-4':'northridge-business-center','grande-central-101':'grande-central-station','grande-central-103':'grande-central-station'};
 const sign=p.get('location');
 if(!routes[sign])return;
 const next=new URLSearchParams({sign});
 if(p.has('panel'))next.set('panel',p.get('panel'));
 location.replace(routes[sign]+'.html?'+next.toString());
})();
