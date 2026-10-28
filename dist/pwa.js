(()=>{
  const status=document.getElementById('networkStatus'),install=document.getElementById('installApp'),update=document.getElementById('updateApp');
  let offlineReady=false,prompt,updateRequested=false;
  function connection(){status.textContent=navigator.onLine?(offlineReady?'Available offline · designs stay on this device':'Preparing offline access…'):(offlineReady?'Offline · you can keep designing':'Offline · open online once to enable offline access')}
  window.addEventListener('online',connection);window.addEventListener('offline',connection);connection();
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();prompt=event;install.hidden=false});
  install.onclick=async()=>{if(!prompt)return;await prompt.prompt();await prompt.userChoice;prompt=null;install.hidden=true};
  window.addEventListener('appinstalled',()=>{install.hidden=true});
  if('serviceWorker' in navigator&&window.isSecureContext){
    navigator.serviceWorker.register('sw.js').then(registration=>{
      navigator.serviceWorker.ready.then(()=>{offlineReady=true;connection()});
      function offer(){if(registration.waiting){update.hidden=false;update.onclick=()=>{if(!confirm('Update the app now? Your current design will be saved first.'))return;flushSave();updateRequested=true;registration.waiting.postMessage('ACTIVATE_UPDATE')}}}
      offer();registration.addEventListener('updatefound',()=>registration.installing?.addEventListener('statechange',offer));
      navigator.serviceWorker.addEventListener('controllerchange',()=>{if(updateRequested)location.reload()});
    }).catch(()=>{status.textContent='Offline setup failed. You can still design and save JSON.'});
  }else status.textContent='Use HTTPS to enable installation and offline access';
})();
