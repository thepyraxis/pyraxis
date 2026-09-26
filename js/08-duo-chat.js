'use strict';
(function(){
  var body=$('#duoBody'); if(!body) return;
  var BTN='<div class="wa-btns"><button class="wa-btn" type="button">Tomorrow 10:30</button>'+
    '<button class="wa-btn" type="button">Tomorrow 16:00</button></div>';
  var APPT='<div class="wa-bk"><h5>APPOINTMENT CONFIRMED</h5><dl>'+
    '<dt>SERVICE</dt><dd>TEETH CLEANING</dd><dt>DENTIST</dt><dd>DR. AMARA</dd>'+
    '<dt>DAY</dt><dd>TOMORROW</dd><dt>TIME</dt><dd>10:30</dd></dl>'+
    '<span class="ok"><svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 6"/></svg>BOOKED</span>'+
    '<p class="sub">Reminder at 08:00 · follow-up after the visit</p></div>';
  var picked={slot:'10:30'};
  var chat=makeWA({
    body: body,
    log: $('#duoLog'),
    clock: $('#duoClock'),
    date: '23:31',
    picked: picked,
    confirm: function(time){
      var p=(this&&this.picked&&this.picked.slot)||'10:30';
      return APPT.split('10:30').join(p);
    },
    steps: [
      {t:500,  m:['in','Hi — do you do teeth cleaning? Anything this week?','23:31']},
      {t:1000, ai:'Hello! Yes, Dr. Amara does cleanings. Shall I book you in?', typing:900, time:'23:31'},
      {t:1100, card:BTN, time:'23:31'},
      {t:600,  waitPick:true, time:'23:32'},
      {t:700,  ev:'LEAD CAPTURED · WHATSAPP'},
      {t:600,  ai:function(){return 'Done — see you tomorrow at '+picked.slot+'.';}, typing:700, time:'23:32'},
      {t:600,  confirm:true, time:'23:32'},
      {t:700,  ev:function(){return 'APPOINTMENT BOOKED · TOMORROW '+picked.slot;}},
      {t:400,  ev:'REMINDER SCHEDULED · 08:00'},
      {t:400,  done:true}
    ],
    onDone: function(){
      var r=$('#duoReplay'); if(r) r.classList.add('show');
    }
  });
  startOnSeen(body, chat.play);
  var btn=$('#duoBtn'); if(btn) btn.addEventListener('click', chat.play);
})();


/* ---------- 03b · growth system node row (ported from Next.js GrowthSystem) ---------- */
