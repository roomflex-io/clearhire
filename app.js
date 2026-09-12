const JOBS = [
  {id:1,title:"Product designer",company:"Northline",location:"Remote (UK)",remote:true,type:"Full-time",pay:"£72k–£88k",payMin:72,visa:true,junior:false,takehome:false,hours:2.5,replyDays:3,posted:"2d ago",manager:"Amina Cole, Head of Design",blurb:"Own checkout and billing flows for a B2B payments product. Strong systems thinking beats flashy portfolios.",process:["20-min intro","Portfolio walkthrough (45m)","Paid design exercise on the call","Founder chat"]},
  {id:2,title:"Junior frontend engineer",company:"Harbor Health",location:"Manchester / hybrid",remote:false,type:"Full-time",pay:"£38k–£46k",payMin:38,visa:false,junior:true,takehome:false,hours:2,replyDays:4,posted:"1d ago",manager:"Tom Rees, Eng manager",blurb:"React + TypeScript on a patient portal. We hire for curiosity and clear PRs, not LeetCode theatre.",process:["Recruiter screen","Paired coding on our codebase","Team meet"]},
  {id:3,title:"Staff backend engineer",company:"Kite Payments",location:"Remote (EU)",remote:true,type:"Full-time",pay:"€95k–€120k",payMin:95,visa:true,junior:false,takehome:true,hours:5,replyDays:6,posted:"5d ago",manager:"Leah Voss, VP Eng",blurb:"Scale ledger services. Take-home is capped at 3 hours and paid £250.",process:["Intro","Paid take-home (3h)","Systems design","Values"]},
  {id:4,title:"Community nurse — nights",company:"Riverway Trust",location:"Leeds",remote:false,type:"Part-time",pay:"£21–£24 / hour",payMin:36,visa:true,junior:true,takehome:false,hours:1.5,replyDays:2,posted:"Today",manager:"Priya Shah, Ward lead",blurb:"Nights on a community rotation. Parking paid. Guaranteed reply within two working days.",process:["Phone screen","In-person meet the team"]},
  {id:5,title:"Data analyst",company:"Folio Retail",location:"London",remote:false,type:"Contract",pay:"£450–£500 / day",payMin:90,visa:false,junior:false,takehome:false,hours:2,replyDays:5,posted:"3d ago",manager:"Chris Adeyemi, Analytics lead",blurb:"6-month contract cleaning merchandising data. SQL + Looker. No case-study weekend.",process:["Call","SQL pair","Hiring manager"]},
  {id:6,title:"Customer support specialist",company:"Lumen Mail",location:"Remote (worldwide)",remote:true,type:"Full-time",pay:"$48k–$58k",payMin:48,visa:false,junior:true,takehome:false,hours:1.5,replyDays:2,posted:"4d ago",manager:"Sofia Alvarez, Support lead",blurb:"Async-first inbox. We publish first-response SLAs internally and to candidates.",process:["Written intro","Live ticket shadow"]},
  {id:7,title:"iOS engineer",company:"Atlas Bank",location:"New York (hybrid)",remote:false,type:"Full-time",pay:"$165k–$190k + equity",payMin:165,visa:true,junior:false,takehome:true,hours:6,replyDays:8,posted:"1w ago",manager:"Ben Park, Mobile lead",blurb:"SwiftUI rebuild of the retail app. Take-home exists — filter it off if you do not want that.",process:["Recruiter","Take-home","Onsite loop"]},
  {id:8,title:"Marketing lead",company:"Ovenbird Coffee",location:"Remote (UK)",remote:true,type:"Full-time",pay:"£55k–£65k",payMin:55,visa:false,junior:false,takehome:false,hours:3,replyDays:3,posted:"6d ago",manager:"Elle Grant, Founder",blurb:"Own lifecycle and retail partnerships for a growing roastery. Show us work, not a 12-page strategy deck.",process:["Founder call","Channel teardown together","Team coffee"]}
];
const extra = JSON.parse(localStorage.getItem("ch-extra") || "[]");
let jobs = [...extra, ...JOBS];
const $ = (id) => document.getElementById(id);
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => (t.hidden = true), 2400);
}
function currentFilters() {
  return {
    q: $("q").value.trim().toLowerCase(),
    where: $("where").value.trim().toLowerCase(),
    remote: $("fRemote").checked,
    visa: $("fVisa").checked,
    junior: $("fJunior").checked,
    noTH: $("fNoTH").checked,
    reply: $("fReply").checked,
    pay: Number($("fPay").value),
    type: $("fType").value,
    sort: $("sort").value
  };
}
function applyFilters() {
  const f = currentFilters();
  $("payLab").textContent = f.pay ? (f.pay + "k+ equiv.") : "Any";
  let rows = jobs.filter((j) => {
    const blob = (j.title + " " + j.company + " " + j.blurb).toLowerCase();
    if (f.q && !blob.includes(f.q)) return false;
    if (f.where && !j.location.toLowerCase().includes(f.where) && !(f.where.includes("remote") && j.remote)) return false;
    if (f.remote && !j.remote) return false;
    if (f.visa && !j.visa) return false;
    if (f.junior && !j.junior) return false;
    if (f.noTH && j.takehome) return false;
    if (f.reply && j.replyDays > 5) return false;
    if (f.pay && j.payMin < f.pay) return false;
    if (f.type && j.type !== f.type) return false;
    return true;
  });
  if (f.sort === "pay") rows = rows.slice().sort((a, b) => b.payMin - a.payMin);
  if (f.sort === "fast") rows = rows.slice().sort((a, b) => a.replyDays - b.replyDays);
  render(rows);
}
function resetFilters() {
  $("q").value = "";
  $("where").value = "";
  $("fRemote").checked = $("fVisa").checked = $("fJunior").checked = $("fNoTH").checked = $("fReply").checked = false;
  $("fPay").value = 0;
  $("fType").value = "";
  $("sort").value = "new";
  document.querySelectorAll("#quickPills button").forEach((b) => b.classList.remove("on"));
  applyFilters();
}
function render(rows) {
  $("count").textContent = rows.length + " role" + (rows.length === 1 ? "" : "s") + " that pass the bar";
  $("list").innerHTML = rows.map((j) => {
    return '<article class="card" onclick="openJob(' + j.id + ')">' +
      '<div class="card-top"><div><div class="company">' + j.company + ' · ' + j.posted + '</div>' +
      '<h3 style="margin:4px 0 0;font-size:26px">' + j.title + '</h3></div>' +
      '<div class="pay">' + j.pay + '</div></div>' +
      '<div class="meta">' +
      '<span class="tag">' + j.location + '</span>' +
      '<span class="tag">' + j.type + '</span>' +
      '<span class="tag ' + (j.visa ? 'good' : '') + '">' + (j.visa ? 'Visa ok' : 'No visa') + '</span>' +
      '<span class="tag ' + (j.junior ? 'good' : '') + '">' + (j.junior ? 'Juniors welcome' : 'Mid+') + '</span>' +
      '<span class="tag ' + (j.takehome ? '' : 'good') + '">' + (j.takehome ? 'Take-home' : 'No take-home') + '</span>' +
      '<span class="tag">Interview ~' + j.hours + 'h</span>' +
      '<span class="tag">Replies in ' + j.replyDays + 'd</span></div>' +
      '<p style="margin:6px 0 0;color:var(--mute)">' + j.blurb + '</p></article>';
  }).join('') || '<p style="color:var(--mute)">Nothing matches. Loosen a filter.</p>';
}
function openJob(id) {
  const j = jobs.find((x) => x.id === id);
  if (!j) return;
  $("drawer").hidden = false;
  const steps = j.process.map((s, i) => '<div class="step"><span class="dot"></span><span>' + (i + 1) + '. ' + s + '</span></div>').join('');
  $("drawerCard").innerHTML =
    '<button class="text" onclick="closeJob()">Close</button>' +
    '<p class="company" style="margin-top:16px">' + j.company + '</p>' +
    '<h2 style="margin:4px 0 8px;font-size:40px">' + j.title + '</h2>' +
    '<p class="pay">' + j.pay + '</p>' +
    '<p style="color:var(--mute)">' + j.location + ' · ' + j.type + '</p>' +
    '<p>' + j.blurb + '</p>' +
    '<p><strong>Hiring manager</strong><br>' + j.manager + '</p>' +
    '<div class="proc">' + steps + '</div>' +
    '<p style="color:var(--mute)">Total interview time about ' + j.hours + ' hours. First reply target: ' + j.replyDays + ' days.</p>' +
    '<button class="solid" onclick="applyNow(\'' + j.company + '\')">Apply with one page</button>' +
    '<p class="fine">We send your profile once. If they ghost past the SLA, we flag the listing.</p>';
}
function closeJob() { $("drawer").hidden = true; }
function applyNow(company) {
  toast('Application queued to ' + company + '. Demo only.');
  closeJob();
}
function openPost() { $("postModal").hidden = false; }
function closePost() { $("postModal").hidden = true; }
function submitPost(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const job = {
    id: Date.now(),
    title: fd.get('title'),
    company: fd.get('company'),
    location: fd.get('location'),
    remote: /remote/i.test(fd.get('location')),
    type: 'Full-time',
    pay: fd.get('pay'),
    payMin: parseInt(String(fd.get('pay')).replace(/[^\d]/g, ''), 10) || 40,
    visa: fd.get('visa') === 'on',
    junior: fd.get('junior') === 'on',
    takehome: fd.get('takehome') === 'on',
    hours: Number(fd.get('hours') || 2),
    replyDays: 3,
    posted: 'Just now',
    manager: 'You (demo listing)',
    blurb: 'Posted from the ClearHire demo form.',
    process: ['Intro call', 'Working session', 'Offer chat']
  };
  extra.unshift(job);
  localStorage.setItem('ch-extra', JSON.stringify(extra));
  jobs = extra.concat(JOBS);
  closePost();
  applyFilters();
  toast('Role published locally.');
}
$('drawer').addEventListener('click', function(e) { if (e.target.id === 'drawer') closeJob(); });
$('postModal').addEventListener('click', function(e) { if (e.target.id === 'postModal') closePost(); });
['q','where','fRemote','fVisa','fJunior','fNoTH','fReply','fPay','fType','sort'].forEach(function(id) {
  $(id).addEventListener('input', applyFilters);
  $(id).addEventListener('change', applyFilters);
});
document.querySelectorAll('#quickPills button').forEach(function(btn) {
  btn.addEventListener('click', function() {
    btn.classList.toggle('on');
    var on = btn.classList.contains('on');
    var p = btn.dataset.preset;
    if (p === 'remote') $('fRemote').checked = on;
    if (p === 'visa') $('fVisa').checked = on;
    if (p === 'junior') $('fJunior').checked = on;
    if (p === 'notakehome') $('fNoTH').checked = on;
    if (p === 'salary') $('fPay').value = on ? 50 : 0;
    if (p === 'short') $('fNoTH').checked = on;
    applyFilters();
  });
});
applyFilters();
