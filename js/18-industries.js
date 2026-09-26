'use strict';
(function(){
  var IND=[
    ['Restaurants','i-fork','QR ordering, reservations and loyalty — without hiring another waiter.',['SCAN QR','ORDER','RECORDED','FEEDBACK','LOYALTY OFFER'],'A guest scans the table code, orders dessert, pays — and gets a personal reason to come back.'],
    ['Salons','i-cut','Booking, reminders and rebooking that keep the chair full.',['INSTAGRAM','WHATSAPP','BOOKED','REMINDER','REBOOKED'],'Six weeks after a haircut, the reminder arrives — not a blast, a nudge.'],
    ['Clinics','i-tooth','Enquiries answered at midnight; the calendar never sits empty.',['ENQUIRY 11:31 PM','AI ANSWERS','APPOINTMENT','REMINDER'],'Clinical questions go to humans. Scheduling does not need one.'],
    ['Gyms','i-dumbbell','Trials converted, memberships defended.',['TRIAL LEAD','QUALIFIED','TRIAL BOOKED','MEMBER','WIN-BACK'],'Attendance drops — the system notices before the cancellation does.'],
    ['Hotels','i-bed','From first enquiry to post-stay review — handled.',['ENQUIRY','AVAILABILITY','BOOKED','PRE-ARRIVAL','POST-STAY REVIEW'],'Guests arrive to "your room is ready" — and leave a review the same day.'],
    ['Car service','i-car','Every service quietly books its successor.',['WHATSAPP','SERVICE + VEHICLE','BOOKED','PAYMENT','NEXT SERVICE'],'The car forgets its oil change. PYRAXIS does not.'],
    ['Home services','i-wrench','"What do you need?" — then booked, dispatched, remembered.',['LEAD','AI QUALIFIES','TECHNICIAN','DONE','NEXT REMINDER'],'Every AC service schedules next season before the van leaves.'],
    ['Consultants','i-user','Qualified calls land on your calendar while you work.',['LEAD','QUALIFIED','CALL BOOKED','FOLLOW-UP','REFERRAL'],'Only serious leads reach your calendar. The rest are nurtured until they are.'],
    ['E-commerce','i-bag','The second purchase, engineered instead of hoped for.',['VISIT','CAPTURED','FIRST ORDER','DAY-10 FLOW','REPEAT PURCHASE'],'The second purchase is not luck. It is a message, ten days later.']
  ];
  var tabs=$('#indTabs'), panel=$('#indPanel'); if(!tabs||!panel) return;
  IND.forEach(function(x,i){
    var b=document.createElement('button'); b.type='button'; b.className='ind-tab';
    b.setAttribute('role','tab'); b.setAttribute('aria-selected','false');
    b.innerHTML='<svg class="ic"><use href="#'+x[1]+'"/></svg><span>'+x[0]+'</span><i></i>';
    b.addEventListener('click',function(){ select(i); });
    tabs.appendChild(b);
  });
  function select(i){
    $$('.ind-tab',tabs).forEach(function(t,j){
      t.classList.toggle('on',j===i); t.setAttribute('aria-selected',String(j===i));
    });
    var x=IND[i];
    panel.classList.remove('in');
    raf2(function(){
      panel.innerHTML='<p class="kicker" data-n="↳">Workflow, adapted</p><h3 class="ind-title">'+x[0]+'</h3>'+
        '<p class="ind-desc">'+x[2]+'</p>'+
        '<div class="ind-flow">'+x[3].map(function(f,k){
          return '<span class="fl-chip'+(k===x[3].length-1?' key':'')+'" style="--i:'+k+'">'+f+'</span>';
        }).join('<span class="fl-arr">→</span>')+'</div>'+
        '<p class="ind-sc">&quot;'+x[4]+'&quot;</p>';
      panel.classList.add('in');
    });
    if(REDUCED) panel.classList.add('in');
  }
  select(0);
})();

/* ---------- 12 · process rail: scroll-driven signal (ported from Next.js Process) ---------- */
