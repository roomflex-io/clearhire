const JOBS = [
  {id:1,title:"Product designer",company:"Northline",location:"Remote (UK)",remote:true,type:"Full-time",pay:"£72k–£88k",payMin:72,visa:true,junior:false,takehome:false,hours:2.5,replyDays:3,posted:"2d ago",manager:"Amina Cole, Head of Design",blurb:"Own checkout and billing for a B2B payments product.",tags:["designer","product","ux"],process:["20-min intro","Portfolio walkthrough","Paid exercise on the call","Founder chat"]},
  {id:2,title:"Junior frontend engineer",company:"Harbor Health",location:"Manchester / hybrid",remote:false,type:"Full-time",pay:"£38k–£46k",payMin:38,visa:false,junior:true,takehome:false,hours:2,replyDays:4,posted:"1d ago",manager:"Tom Rees, Eng manager",blurb:"React + TypeScript on a patient portal.",tags:["react","frontend","junior","engineer"],process:["Recruiter screen","Paired coding","Team meet"]},
  {id:3,title:"Staff backend engineer",company:"Kite Payments",location:"Remote (EU)",remote:true,type:"Full-time",pay:"€95k–€120k",payMin:95,visa:true,junior:false,takehome:true,hours:5,replyDays:6,posted:"5d ago",manager:"Leah Voss, VP Eng",blurb:"Scale ledger services.",tags:["backend","engineer","payments"],process:["Intro","Paid take-home","Systems design","Values"]},
  {id:4,title:"Community nurse — nights",company:"Riverway Trust",location:"Leeds",remote:false,type:"Part-time",pay:"£21–£24 / hour",payMin:36,visa:true,junior:true,takehome:false,hours:1.5,replyDays:2,posted:"Today",manager:"Priya Shah, Ward lead",blurb:"Nights on a community rotation.",tags:["nurse","healthcare"],process:["Phone screen","Meet the team"]},
  {id:5,title:"Data analyst",company:"Folio Retail",location:"London",remote:false,type:"Contract",pay:"£450–£500 / day",payMin:90,visa:false,junior:false,takehome:false,hours:2,replyDays:5,posted:"3d ago",manager:"Chris Adeyemi, Analytics lead",blurb:"SQL + Looker merchandising contract.",tags:["data","analyst","sql"],process:["Call","SQL pair","Hiring manager"]},
  {id:6,title:"Customer support specialist",company:"Lumen Mail",location:"Remote (worldwide)",remote:true,type:"Full-time",pay:"$48k–$58k",payMin:48,visa:false,junior:true,takehome:false,hours:1.5,replyDays:2,posted:"4d ago",manager:"Sofia Alvarez, Support lead",blurb:"Async-first inbox.",tags:["support","customer"],process:["Written intro","Live ticket shadow"]},
  {id:7,title:"iOS engineer",company:"Atlas Bank",location:"New York (hybrid)",remote:false,type:"Full-time",pay:"$165k–$190k + equity",payMin:165,visa:true,junior:false,takehome:true,hours:6,replyDays:8,posted:"1w ago",manager:"Ben Park, Mobile lead",blurb:"SwiftUI rebuild of the retail app.",tags:["ios","swift","engineer"],process:["Recruiter","Take-home","Onsite loop"]},
  {id:8,title:"Marketing lead",company:"Ovenbird Coffee",location:"Remote (UK)",remote:true,type:"Full-time",pay:"£55k–£65k",payMin:55,visa:false,junior:false,takehome:false,hours:3,replyDays:3,posted:"6d ago",manager:"Elle Grant, Founder",blurb:"Lifecycle and retail partnerships.",tags:["marketing","lead"],process:["Founder call","Channel teardown","Team coffee"]}
];
var extra = JSON.parse(localStorage.getItem("ch-extra") || "[]");
var jobs = extra.concat(JOBS);
function $(id){ return document.getElementById(id); }
function toast(msg){ var t=$("toast"); t.textContent=msg; t.hidden=false; clearTimeout(toast._t); toast._t=setTimeout(function(){ t.hidden=true; },2200); }
function profile(){
  return {
    role:($("pRole").value||"").trim().toLowerCase(),
    where:($("pWhere").value||"").trim().toLowerCase(),
    pay:Number($("pPay").value||0),
    hours:Number($("pHours").value||12),
    remote:$("pRemote").checked,
    visa:$("pVisa").checked,
    junior:$("pJunior").checked,
    noTH:$("pNoTH").checked
  };
}
function scoreJob(j,p){
  var score=40, why=[];
  var blob=(j.title+" "+j.tags.join(" ")+" "+j.blurb).toLowerCase();
  if(p.role){ if(blob.indexOf(p.role)!==-1){ score+=28; why.push("title/skill matches"); } else { score-=18; why.push("weak title match"); } }
  if(p.where){ var loc=j.location.toLowerCase(); if(loc.indexOf(p.where)!==-1 || (p.where.indexOf("remote")!==-1 && j.remote)){ score+=16; why.push("location fits"); } else { score-=10; why.push("different location"); } }
  if(p.remote){ if(j.remote){ score+=12; why.push("remote-first"); } else { score-=25; why.push("not remote"); } }
  if(p.pay){ if(j.payMin>=p.pay){ score+=14; why.push("pay meets your floor"); } else { score-=16; why.push("pay under floor"); } }
  if(p.visa){ if(j.visa){ score+=14; why.push("sponsors visas"); } else { score-=30; why.push("no sponsorship"); } }
  if(p.junior){ if(j.junior){ score+=12; why.push("open to juniors"); } else { score-=14; why.push("mid/senior only"); } }
  if(p.noTH && j.takehome){ score-=22; why.push("has a take-home"); }
  if(!j.takehome){ score+=6; why.push("no take-home"); }
  if(j.hours<=p.hours){ score+=10; why.push("short interview"); } else { score-=16; why.push("interview too long"); }
  if(j.replyDays<=4){ score+=6; why.push("fast reply"); }
  score=Math.max(0,Math.min(99,Math.round(score)));
  return {score:score, why:why.slice(0,3)};
}
function rankNow(){ applyFilters(); toast("Ranked by your profile — not by ads."); }
function resetProfile(){
  $("pRole").value=""; $("pWhere").value=""; $("pPay").value=40; $("pHours").value=3;
  $("pRemote").checked=false; $("pVisa").checked=false; $("pJunior").checked=true; $("pNoTH").checked=true;
  applyFilters();
}
function applyFilters(){
  var p=profile();
  var side={remote:$("fRemote").checked,visa:$("fVisa").checked,junior:$("fJunior").checked,noTH:$("fNoTH").checked,sort:$("sort").value};
  var rows=jobs.map(function(j){ var s=scoreJob(j,p); return Object.assign({},j,s); }).filter(function(j){
    if(j.score<28 && (p.role||p.visa||p.remote)) return false;
    if(side.remote && !j.remote) return false;
    if(side.visa && !j.visa) return false;
    if(side.junior && !j.junior) return false;
    if(side.noTH && j.takehome) return false;
    return true;
  });
  if(side.sort==="pay") rows.sort(function(a,b){ return b.payMin-a.payMin; });
  else if(side.sort==="fast") rows.sort(function(a,b){ return a.replyDays-b.replyDays; });
  else rows.sort(function(a,b){ return b.score-a.score; });
  $("bestScore").textContent=rows[0]?rows[0].score+"%":"—";
  render(rows);
}
function clearSide(){ $("fRemote").checked=$("fVisa").checked=$("fJunior").checked=$("fNoTH").checked=false; applyFilters(); }
function render(rows){
  $("count").textContent=rows.length+" ranked role"+(rows.length===1?"":"s");
  $("list").innerHTML=rows.map(function(j,i){
    return '<article class="card'+(i===0?' best':'')+'" onclick="openJob('+j.id+')">'+
      '<div class="card-top"><div><div class="company">'+j.company+' · '+j.posted+'</div><h3 style="margin:4px 0 0;font-size:26px">'+j.title+'</h3></div>'+
      '<div><div class="score">'+(i===0?'Best · ':'')+j.score+'% match</div><div class="pay">'+j.pay+'</div></div></div>'+
      '<div class="meta"><span class="tag">'+j.location+'</span><span class="tag">'+j.type+'</span>'+
      '<span class="tag '+(j.visa?'good':'')+'">'+(j.visa?'Visa ok':'No visa')+'</span>'+
      '<span class="tag '+(j.junior?'good':'')+'">'+(j.junior?'Juniors welcome':'Mid+')+'</span>'+
      '<span class="tag '+(j.takehome?'':'good')+'">'+(j.takehome?'Take-home':'No take-home')+'</span></div>'+
      '<p class="why">'+j.why.join(' · ')+'</p></article>';
  }).join('') || '<p class="why">No honest match for that profile.</p>';
}
function openJob(id){
  var p=profile(); var j=jobs.find(function(x){ return x.id===id; }); if(!j) return;
  var s=scoreJob(j,p); $("drawer").hidden=false;
  var steps=j.process.map(function(step,i){ return '<div class="step"><span class="dot"></span><span>'+(i+1)+'. '+step+'</span></div>'; }).join('');
  $("drawerCard").innerHTML='<button class="text" onclick="closeJob()">Close</button><p class="company" style="margin-top:16px">'+j.company+'</p><h2 style="margin:4px 0 8px;font-size:40px">'+j.title+'</h2><p class="pay">'+j.pay+' · '+s.score+'% match</p><p class="why">'+s.why.join(' · ')+'</p><p>'+j.blurb+'</p><p><strong>Hiring manager</strong><br>'+j.manager+'</p><div class="proc">'+steps+'</div><button class="solid" onclick="applyNow(\''+j.company+'\')">Apply with one page</button>';
}
function closeJob(){ $("drawer").hidden=true; }
function applyNow(c){ toast('Queued to '+c+' (demo).'); closeJob(); }
function openPost(){ $("postModal").hidden=false; }
function closePost(){ $("postModal").hidden=true; }
function submitPost(e){
  e.preventDefault(); var fd=new FormData(e.target);
  extra.unshift({id:Date.now(),title:fd.get('title'),company:fd.get('company'),location:fd.get('location'),remote:/remote/i.test(fd.get('location')),type:'Full-time',pay:fd.get('pay'),payMin:parseInt(String(fd.get('pay')).replace(/[^\d]/g,''),10)||40,visa:fd.get('visa')==='on',junior:fd.get('junior')==='on',takehome:fd.get('takehome')==='on',hours:Number(fd.get('hours')||2),replyDays:3,posted:'Just now',manager:'You (demo listing)',blurb:'Posted from ClearHire.',tags:String(fd.get('title')).toLowerCase().split(' '),process:['Intro call','Working session','Offer chat']});
  localStorage.setItem('ch-extra', JSON.stringify(extra)); jobs=extra.concat(JOBS); closePost(); applyFilters(); toast('Role published on this device.');
}
$('drawer').addEventListener('click', function(e){ if(e.target.id==='drawer') closeJob(); });
$('postModal').addEventListener('click', function(e){ if(e.target.id==='postModal') closePost(); });
['pRole','pWhere','pPay','pHours','pRemote','pVisa','pJunior','pNoTH','fRemote','fVisa','fJunior','fNoTH','sort'].forEach(function(id){ $(id).addEventListener('input', applyFilters); $(id).addEventListener('change', applyFilters); });
applyFilters();
