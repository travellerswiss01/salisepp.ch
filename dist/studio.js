const menu=document.querySelector('#menu'),nav=document.querySelector('#nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
const contactForm=document.querySelector('#contact-form');
contactForm.addEventListener('submit',async event=>{
 event.preventDefault();
 const button=contactForm.querySelector('[type="submit"]'),status=document.querySelector('#status');
 if(button.disabled||!contactForm.reportValidity())return;
 const values=new FormData(contactForm);
 if(String(values.get('_honey')||'').trim())return;
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
 button.disabled=true;button.textContent='Wird gesendet …';contactForm.setAttribute('aria-busy','true');
 status.textContent='Deine Anfrage wird übermittelt …';
 try{
  const response=await fetch('https://formsubmit.co/ajax/sepp@salisepp.ch',{
   method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},signal:controller.signal,
   body:JSON.stringify({name:values.get('name'),email:values.get('email'),Vorhaben:values.get('project'),Paket:values.get('package'),Website:values.get('website')||'Keine angegeben',Nachricht:values.get('message'),_subject:'Neue Website-Anfrage über salisepp.ch',_template:'table',_honey:''})
  });
  const result=await response.json();
  if(!response.ok||!(result.success===true||result.success==='true'))throw new Error('Versand nicht bestätigt');
  status.textContent='Danke! Deine Anfrage wurde übermittelt. Ich melde mich bei dir.';
  button.textContent='Anfrage gesendet ✓';contactForm.reset();
 }catch(error){
  status.textContent='Der Versand konnte nicht bestätigt werden. Deine Eingaben bleiben erhalten. Bitte versuche es später erneut oder schreibe direkt an sepp@salisepp.ch.';
  button.disabled=false;button.textContent='Anfrage senden ↗';
 }finally{clearTimeout(timer);contactForm.removeAttribute('aria-busy');}
});


const packageField=document.querySelector('#selected-package'),summary=document.querySelector('#selection-summary');
const updateSelection=()=>{summary.hidden=packageField.value==='Noch nicht gewählt';document.querySelector('#selection-text').textContent=packageField.value;};
document.querySelectorAll('.package-select').forEach(a=>a.addEventListener('click',()=>{packageField.value=a.dataset.package;updateSelection();document.querySelector('#request-details').open=true;}));
document.querySelector('#clear-selection').addEventListener('click',()=>{packageField.value='Noch nicht gewählt';updateSelection()});
contactForm.addEventListener('reset',()=>requestAnimationFrame(updateSelection));
document.querySelectorAll('a[href="#kennenlernen"]').forEach(a=>a.addEventListener('click',()=>document.querySelector('.booking-details').open=true));
const calendarButton=document.querySelector('#load-calendar'),calendarHost=document.querySelector('#calendly-embed'),bookingStatus=document.querySelector('#booking-status');
calendarButton.addEventListener('click',()=>{
 calendarButton.disabled=true;bookingStatus.textContent='Kalender wird geladen …';
 const showCalendar=()=>{
  document.querySelector('#booking-start').hidden=true;calendarHost.hidden=false;calendarButton.setAttribute('aria-expanded','true');
  window.Calendly.initInlineWidget({url:'https://calendly.com/sepp-salisepp/30min?hide_event_type_details=1',parentElement:calendarHost,resize:true});
  const frame=calendarHost.querySelector('iframe');if(frame)frame.title='Kostenloses Kennenlerngespräch mit Sepp buchen';
  bookingStatus.textContent='Falls der Kalender nicht erscheint, öffne ihn über den Link unten.';
 };
 if(window.Calendly){showCalendar();return;}
 const script=document.createElement('script');script.src='https://assets.calendly.com/assets/external/widget.js';script.async=true;
 script.onload=showCalendar;script.onerror=()=>{bookingStatus.textContent='Der Kalender konnte hier nicht geladen werden. Bitte nutze den direkten Buchungslink unten.';calendarButton.disabled=false;script.remove();};document.head.appendChild(script);
});
