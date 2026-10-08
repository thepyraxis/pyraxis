'use strict';
(function(){
  var SIG='<svg viewBox="0 0 17 11" width="16" fill="currentColor" aria-hidden="true"><rect x="0" y="7.5" width="3" height="3.5" rx="1"/><rect x="4.5" y="5.5" width="3" height="5.5" rx="1"/><rect x="9" y="3" width="3" height="8" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1" opacity=".3"/></svg>'+
  '<svg viewBox="0 0 16 12" width="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M1.6 4.6a9.2 9.2 0 0 1 12.8 0M3.9 7a6 6 0 0 1 8.2 0M6.2 9.3a3 3 0 0 1 3.6 0"/></svg>'+
  '<svg viewBox="0 0 26 12" width="24" fill="none" aria-hidden="true"><rect x=".7" y="1.3" width="20.6" height="9.4" rx="2.7" stroke="currentColor" stroke-width="1.1" opacity=".4"/><rect x="2.3" y="2.9" width="14" height="6.2" rx="1.4" fill="currentColor"/><rect x="22.6" y="4.1" width="2.4" height="3.8" rx="1.2" fill="currentColor" opacity=".4"/></svg>';
  $$('.d-sig').forEach(function(s){ s.innerHTML=SIG; });

  var HDIC='<svg class="fic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h6A2.5 2.5 0 0 1 15 6.5v7a2.5 2.5 0 0 1-2.5 2.5h-6A2.5 2.5 0 0 1 4 13.5v-7zM15 9.2l4.6-2.9a.9.9 0 0 1 1.4.75v8.9a.9.9 0 0 1-1.4.74L15 13.8z"/></svg>'+
  '<svg class="fic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>'+
  '<svg class="fic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5.2" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="18.8" r="1.7"/></svg>';
  $$('.wa-hd').forEach(function(h){
    $$('.hdic',h).forEach(function(x){ x.remove(); });
    var id=h.querySelector('.wa-id'); if(id) id.insertAdjacentHTML('afterend',HDIC);
  });

  var FOOT='<svg class="fic stroke" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M8.5 14a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/></svg>'+
  '<div class="wa-field">Message</div>'+
  '<svg class="fic stroke" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.6 11.7l-6.8 6.8a4.3 4.3 0 0 1-6.1-6.1l7.7-7.7a2.9 2.9 0 0 1 4.1 4.1l-7.7 7.7a1.5 1.5 0 0 1-2.1-2.1l6.8-6.8"/></svg>'+
  '<svg class="fic stroke" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="7" width="17" height="12.5" rx="2.5"/><path d="M8.6 7L10 4.8h4L15.4 7"/><circle cx="12" cy="13.2" r="3.2"/></svg>'+
  '<span class="wa-mic" aria-hidden="true"><svg class="fic stroke" viewBox="0 0 24 24"><rect x="9.2" y="3.5" width="5.6" height="10.5" rx="2.8"/><path d="M5.8 11.5a6.2 6.2 0 0 0 12.4 0M12 17.7v2.8"/></svg></span>';
  $$('.wa-ft').forEach(function(f){ f.innerHTML=FOOT; });
})();

/* ---------- shared animation ticker (pauses off-screen) ---------- */
