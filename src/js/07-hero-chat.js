'use strict';
(function(){
  var body=$('#heroBody'); if(!body) return;
  var RES='<div class="wa-bk"><h5>RESERVATION CONFIRMED</h5><dl>'+
    '<dt>GUEST</dt><dd>SARA</dd><dt>GUESTS</dt><dd>2</dd>'+
    '<dt>SEATING</dt><dd>GARDEN</dd><dt>DAY</dt><dd>SATURDAY</dd><dt>TIME</dt><dd>19:30</dd></dl>'+
    '<span class="ok"><svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 6"/></svg>BOOKED</span>'+
    '<p class="sub">Confirmation sent · reminder Sat 15:00 · follow-up after dinner</p></div>';
  var chat=makeWA({
    body: body,
    log: $('#heroLog'),
    clock: $('#heroClock'),
    date: '19:42',
    steps: [
      {t:500,  m:['in','Hi! Do you have a table for two this Saturday?','19:42']},
      {t:900,  ai:'Hello! Yes we do — the garden or indoors?', typing:800, time:'19:42'},
      {t:1400, m:['in','The garden, please.','19:43']},
      {t:900,  ai:'Lovely at dusk. I can hold 19:00 or 19:30 — which suits?', typing:700, time:'19:43'},
      {t:1500, m:['in','19:30.','19:43']},
      {t:900,  card:RES, time:'19:43'},
      {t:800,  ev:'RESERVATION CONFIRMED · SAT 19:30'},
      {t:400,  ev:'REMINDER SCHEDULED · SAT 15:00'},
      {t:400,  ev:'FEEDBACK REQUEST QUEUED · AFTER DINNER'}
    ]
  });
  startOnSeen(body, chat.play);
})();

/* ---------- 11:31 PM chat ---------- */
