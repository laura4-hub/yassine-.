const $=id=>document.getElementById(id);
/* The 3 hidden words. The password for round 3 is these words together. */
const WORDS=["i'm","perfect","and","it's","not","a","compliment"],PASSWORD=WORDS.join(" ");
/* Edit this message: it appears under the cake at the very end. */
const FUNNY="Happy Birthday, Yassine! Another year unlocked. Your age just updated, but your maturity is still buffering. Enjoy the cake, legend! 🎂😎";
let player="";
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);
function show(id){flash();document.querySelectorAll('.screen').forEach(e=>e.classList.remove('on'));$(id).classList.add('on')}
// Two separate tracks: the game soundtrack and the final birthday song.
const aud=$('aud');
const birthdayAud=$('birthdayAud');
aud.src='./videoplayback.weba';
aud.volume=.65;
aud.loop=true;
birthdayAud.src='./birthday-song.mp3';
birthdayAud.volume=.75;
birthdayAud.loop=true;
let activeAudio=aud;

function musicToggle(){
  if(activeAudio.paused) activeAudio.play().catch(()=>{});
  else activeAudio.pause();
}
$('mbtn').onclick=musicToggle;

$('start').onclick=()=>{
  activeAudio=aud;
  aud.play().catch(()=>{});
  show('s2');
  $('name').focus();
};
$('name').oninput=e=>{$('next').disabled=!e.target.value.trim()};
$('name').onkeydown=e=>{if(e.key==='Enter'&&!$('next').disabled)$('next').click()};
$('next').onclick=()=>{player=$('name').value.trim();show('s5');round1()};
const st=$('st');let mi=0;
const mk=(t,f)=>{const b=document.createElement('button');b.className='btn';b.textContent=t;b.onclick=f;return b};
const say=t=>{$('msg').innerHTML=t};
function startStory(){mi=0;mission()}
function mission(){const m=M[mi];st.innerHTML=`<div class="sub">${m.t}</div><p class="tx">${m.i}</p>`;st.appendChild(mk('Begin',()=>{st.innerHTML=`<div class="sub">${m.t}</div><div id="arena"></div><p class="tx" id="msg">${m.h}</p>`;m.run($('arena'),win)}))}
function win(t){if($('nx'))return;say(t);burst(innerWidth/2,innerHeight/3,50);fan();const nb=mk(mi<M.length-1?'Next mission':'Take the key',()=>{mi++;mi<M.length?mission():ending()});nb.id='nx';st.appendChild(nb)}
const M=[
{t:"I · The Lost Patrol",i:"It is night. A team is lost outside the wall. Only the stars can help. Touch the stars from the biggest to the smallest.",h:"Hint: start with the biggest star. A letter will appear!",run:m1},
{t:"II · The Wounded General",i:"The general is hurt. Yassine must prepare the healing tools. Match the pairs of cards.",h:"Tap two cards. If they match, they stay open.",run:m3},
{t:"III · The Scared Crowd",i:"The people at the wall are scared. Yassine is good with people. Use kind and smart words to calm them down.",h:"Pick the kindest and smartest answer.",run:m4},
{t:"IV · The Giant with the Glowing Teeth",i:"The giant's teeth flash in a secret sequence. Watch carefully, then repeat it in the same order. Each round gets harder.",h:"Remember the glowing sequence. You have 4 hearts.",run:m5},
 {t:"V · The Sudoku Vault",i:"Solve the 4×4 Sudoku. Every row, column, and 2×2 box must contain 1, 2, 3, and 4 exactly once.",h:"Select an empty square, choose a number, then check your solution.",run:m6}
];
function m1(a,w){
 const P=[[55,25,11],[92,65,10],[135,105,9],[178,65,8],[215,25,7],[135,142,6],[135,175,5]];
 const PAR=[-1,0,1,2,3,2,5];let n=0;
 a.innerHTML=`<svg class="sk" viewBox="0 0 270 205" role="img" aria-label="Seven stars to collect in order">
 <g id="ln" stroke="#f3d98b" stroke-width="2"></g>
 ${P.map((p,k)=>`<g data-k="${k}" class="path-star" style="cursor:pointer">
 <circle cx="${p[0]}" cy="${p[1]}" r="19" fill="transparent" pointer-events="all"/>
 <circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="#f3d98b" style="filter:drop-shadow(0 0 6px #f3d98b);pointer-events:none"/>
 </g>`).join('')}</svg>`;
 a.querySelectorAll('.path-star').forEach(g=>g.addEventListener('click',()=>{
  const k=Number(g.dataset.k);
  if(k!==n){say("Not this one. Follow the stars from biggest to smallest.");return}
  if(PAR[k]>=0){const q=P[PAR[k]];$('ln').innerHTML+=`<line x1="${q[0]}" y1="${q[1]}" x2="${P[k][0]}" y2="${P[k][1]}"/>`}
  g.querySelectorAll('circle')[1].setAttribute('fill','#fff');g.style.pointerEvents='none';n++;
  if(n===P.length)w("You found the way! The stars make a big Y. The team follows it home.");
  else say(n+" / "+P.length+" stars collected");
 }));
}
function m3(a,w){
 const E=['🩹','💊','💧','🦷'];const D=[...E,...E].sort(()=>Math.random()-.5);let open=[],found=0,lock=false;
 a.innerHTML='<div class="mem"></div>';
 D.forEach(e=>{const c=document.createElement('button');c.className='mc';c.textContent='?';c.onclick=()=>{
  if(lock||c.classList.contains('on'))return;c.classList.add('on');c.textContent=e;open.push(c);
  if(open.length==2){const[x,y]=open;
   if(x.textContent==y.textContent){found++;open=[];say("Good! "+found+" / 4");if(found==4)w("All the tools are ready! The general is safe. Great job, Doctor Yassine!")}
   else{lock=true;setTimeout(()=>{x.classList.remove('on');y.classList.remove('on');x.textContent=y.textContent='?';open=[];lock=false},700)}}};
  a.firstChild.appendChild(c)});
}
function m4(a,w){
 const S=[{p:"👧",q:"A little girl is crying: “I cannot find my mom!”",o:[["Stop crying. It is not important.","She cries even more."],["I will help you find her. Stay with me.",1],["Ask someone else.","She feels alone and scared."]]},
 {p:"😠",q:"An angry man shouts: “The wall will fall! We will all die!”",o:[["Be quiet!","He shouts even louder."],["You are right to be scared. But the wall is strong, and we are ready.",1],["Maybe you are right…","Now everyone is afraid."]]},
 {p:"👵",q:"An old woman says: “I will not leave my house.”",o:[["You must go now!","She gets angry and sits down."],["Let us take your things together. I will carry your bag.",1],["Fine. Stay here and be in danger.","She feels hurt."]]}];
 let i=0;a.innerHTML='<div class="calm"><div id="cb"></div></div><div id="sc"></div>';
 const show=()=>{$('cb').style.width=(i/3*100)+'%';const s=S[i];$('sc').innerHTML=`<div style="font-size:3rem">${s.p}</div><p class="tx">${s.q}</p>`;
  s.o.slice().sort(()=>Math.random()-.5).forEach(o=>{const b=mk(o[0],()=>{
   if(o[1]===1){i++;if(i==3){$('cb').style.width='100%';$('sc').innerHTML='<div style="font-size:3rem">🙂</div>';w("The crowd is calm. Everyone follows Yassine to safety!")}else{say("Well said! They feel better.");show()}}
   else say(o[1]+" Try another answer.")});
   b.style.cssText='display:block;margin:8px auto;max-width:480px;text-transform:none;letter-spacing:.04em;font-size:.9rem';$('sc').appendChild(b)})};
 show();
}
function m5(a,w){
 const patterns=[[2,6,1],[2,6,1,5],[2,6,1,5,0]],names=["first","second","final"];
 let round=0,hearts=4,seq=[],step=0,phase="watch";
 a.innerHTML=`<p id="giantStatus"></p><div class="teeth">${Array.from({length:8},()=>'<button class="tooth"></button>').join('')}</div><p id="giantHint" class="tx"></p><button class="btn" id="giantAgain">Watch sequence</button>`;
 const T=[...a.querySelectorAll('.tooth')],hint=$('giantHint'),again=$('giantAgain');
 function update(){$('giantStatus').textContent="Giant: "+"♦".repeat(3-round)+"   Courage: "+"♥".repeat(hearts)+"   Round "+(round+1)+"/3"}
 function watch(){
  seq=patterns[round];step=0;phase="watch";T.forEach(t=>{t.disabled=true;t.classList.remove('glow')});again.disabled=true;hint.textContent="Memorize the glowing teeth...";
  let j=0;function flash(){T.forEach(t=>t.classList.remove('glow'));if(j===seq.length){phase="play";T.forEach(t=>t.disabled=false);again.disabled=false;hint.textContent="Your turn. Repeat the sequence!";return}
   T[seq[j]].classList.add('glow');setTimeout(()=>{T[seq[j]].classList.remove('glow');j++;setTimeout(flash,260)},650)}
  setTimeout(flash,400);
 }
 function wrong(){hearts--;update();phase="lost";T.forEach(t=>t.disabled=true);hint.textContent=hearts?"Wrong! The giant strikes. Watch and try this round again.":"The giant defeated you. Restart the challenge.";again.textContent=hearts?"Retry round":"Try again";again.disabled=false;again.onclick=()=>{if(!hearts){round=0;hearts=4;update()}again.textContent="Watch sequence";again.onclick=watch;watch()}}
 T.forEach((t,k)=>t.onclick=()=>{if(phase!=="play")return;if(k!==seq[step]){wrong();return}t.classList.add('glow');setTimeout(()=>t.classList.remove('glow'),180);step++;if(step===seq.length){round++;update();phase="won";T.forEach(x=>x.disabled=true);if(round===3){hint.textContent="The giant collapses! Your memory saved the day.";w("The giant falls! You defeated it with focus and memory.")}else{hint.textContent="Correct! The next sequence is longer.";again.textContent="Next round";again.disabled=false;again.onclick=()=>{again.textContent="Watch sequence";again.onclick=watch;watch()}}}else hint.textContent="Correct: "+step+" / "+seq.length});
 again.onclick=watch;update();watch();
}
function m6(a,w){
 const sol=[[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]],fixed=[[1,0,0,4],[0,4,1,0],[2,0,4,0],[0,3,0,1]],board=fixed.map(r=>r.slice());
 a.innerHTML=`<p class="tx">Fill the empty squares. Each row, column and 2×2 box needs 1–4.</p><div id="sudoku" style="display:grid;grid-template-columns:repeat(4,58px);gap:3px;justify-content:center;margin:18px"></div><div style="display:flex;gap:7px;justify-content:center;flex-wrap:wrap">${[1,2,3,4].map(n=>`<button class="pb" data-num="${n}">${n}</button>`).join('')}<button class="pb" data-num="0">Erase</button></div><p id="sudokuMsg" class="tx">Choose an empty square, then a number.</p><button class="btn" id="checkSudoku">Check solution</button>`;
 let selected=null;const grid=$('sudoku'),msg=$('sudokuMsg');
 function draw(){grid.innerHTML='';board.forEach((row,r)=>row.forEach((v,c)=>{const b=document.createElement('button');b.textContent=v||'·';b.className='pb';b.style.cssText=`width:58px;height:58px;padding:0;font-size:1.5rem;border-radius:0;${c===1?'border-right:3px solid #f3d98b;':''}${r===1?'border-bottom:3px solid #f3d98b;':''}${fixed[r][c]?'background:#49331b;color:#f3d98b;':''}${selected&&selected[0]===r&&selected[1]===c?'outline:3px solid white;':''}`;b.onclick=()=>{if(fixed[r][c]){msg.textContent="That number is locked. Choose an empty square.";return}selected=[r,c];draw()};grid.appendChild(b)}))}
 a.querySelectorAll('[data-num]').forEach(b=>b.onclick=()=>{if(!selected){msg.textContent="Select an empty square first.";return}board[selected[0]][selected[1]]=+b.dataset.num;draw()});
 $('checkSudoku').onclick=()=>{if(board.every((r,i)=>r.every((v,j)=>v===sol[i][j]))){msg.textContent="Solved! The vault opens.";w("Sudoku solved! The vault opens. Inside, there is a golden key!")}else msg.textContent="Not quite. Check every row, column and 2×2 box."};
 draw();
}
/* ===== SHARED ===== */
const scrollHTML=f=>`<div class="scroll"><div class="sub">Secret message</div><div class="words">${WORDS.map((w,i)=>f.includes(i)?`<span class="wd on">${w}</span>`:`<span class="wd">${'?'.repeat(w.length)}</span>`).join('')}</div></div>`;
const btn=(t,f)=>{const b=mk(t,f);b.style.margin='6px';return b};
function intro(n,title,text,go){st.innerHTML=`<div class="sub">Round ${n}</div><h2>${title}</h2><p class="tx">${text}</p>`;st.appendChild(btn('Begin',go))}

/* ===== ROUND 1 : the wall (5 missions, then the golden key) ===== */
function round1(){intro(1,"The Wall","Soldier "+esc(player)+", the giants are near. Yassine must protect the wall. Finish 5 missions to win the golden key.",startStory)}
function ending(){
 st.innerHTML=`<div class="sub">Round 1 complete</div><div class="key">🗝️</div><h2>You won a golden key!</h2><p class="tx">The key falls from the sky. A small scroll is tied to it. It holds a secret message with 7 hidden words.</p>${scrollHTML([])}<p class="tx">To read it, Yassine must go to round 2.</p>`;
 st.appendChild(btn('Go to round 2',round2));
}

/* ===== ROUND 2 : the red panda's secret-message adventure ===== */
function round2(){
 intro(2,"The Secret Message","A little red panda has to cross the sky-islands. Jump, collect all seven golden stars, and discover the secret message.",startPenguinGame);
}
function startPenguinGame(){
 const W=760,H=360,worldW=2420;
 const words=["i'm","perfect","and","it's","not","a","compliment"];
 const platforms=[{x:0,y:318,w:420},{x:470,y:278,w:210},{x:735,y:238,w:190},{x:980,y:285,w:220},{x:1250,y:245,w:200},{x:1510,y:205,w:210},{x:1780,y:260,w:220},{x:2050,y:220,w:370}];
 const stars=[{x:245,y:270},{x:555,y:232},{x:820,y:192},{x:1080,y:238},{x:1350,y:200},{x:1610,y:160},{x:1900,y:215}];
 let player={x:45,y:260,vx:0,vy:0,w:34,h:46,onGround:false},keys={},collected=0,camera=0,playing=true,last=0,raf=0;
 st.innerHTML=`<div class="sub">Round 2 · The red panda</div><p class="tx">Move with ← → or A / D. Press SPACE or ↑ to jump. On a phone, use the buttons below.</p><div class="penguin-hud"><span id="penguinCount">⭐ 0 / 7</span><span id="penguinWords">_ _ _ _ _ _ _</span></div><canvas id="penguinGame" width="${W}" height="${H}" aria-label="Red panda jumping game"></canvas><div class="penguin-controls"><button type="button" class="pb" id="pLeft">◀</button><button type="button" class="pb" id="pJump">JUMP</button><button type="button" class="pb" id="pRight">▶</button></div><p class="tx" id="penguinHint">Collect the first star!</p>`;
 const canvas=$('penguinGame'),ctx=canvas.getContext('2d'),count=$('penguinCount'),wordLine=$('penguinWords'),hint=$('penguinHint');
 const down=k=>keys[k]=true,up=k=>keys[k]=false;
 const keydown=e=>{if(["ArrowLeft","ArrowRight","ArrowUp"," "].includes(e.key))e.preventDefault();down(e.key.toLowerCase())},keyup=e=>up(e.key.toLowerCase());
 window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);
 const hold=(id,k)=>{const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();down(k);b.setPointerCapture(e.pointerId)});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,()=>up(k)))};
 hold('pLeft','arrowleft');hold('pRight','arrowright');hold('pJump',' ');
 function clean(){playing=false;cancelAnimationFrame(raf);window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup)}
 function redPanda(x,y){
  ctx.save();ctx.translate(x,y);
  // Big fluffy striped tail, drawn behind the little red panda.
  ctx.lineCap='round';ctx.lineWidth=13;ctx.strokeStyle='#b94724';ctx.beginPath();ctx.moveTo(27,35);ctx.quadraticCurveTo(48,42,43,25);ctx.stroke();
  ctx.lineWidth=7;ctx.strokeStyle='#f2d6b6';ctx.beginPath();ctx.moveTo(42,30);ctx.quadraticCurveTo(47,24,44,19);ctx.stroke();
  ctx.lineWidth=6;ctx.strokeStyle='#632a25';ctx.beginPath();ctx.moveTo(43,23);ctx.quadraticCurveTo(45,19,42,15);ctx.stroke();
  // Rounded red-orange body and cream belly.
  ctx.fillStyle='#9f3c24';ctx.beginPath();ctx.ellipse(18,31,17,18,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#d96b32';ctx.beginPath();ctx.ellipse(17,27,16,20,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#f7e5cf';ctx.beginPath();ctx.ellipse(17,32,10,13,0,0,Math.PI*2);ctx.fill();
  // Ears with pale inner fur.
  ctx.fillStyle='#b94c2b';ctx.beginPath();ctx.arc(6,7,7,0,Math.PI*2);ctx.arc(29,7,7,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#f2b7a0';ctx.beginPath();ctx.arc(6,7,3.4,0,Math.PI*2);ctx.arc(29,7,3.4,0,Math.PI*2);ctx.fill();
  // Head, white cheeks, and characteristic dark eye patches.
  ctx.fillStyle='#d96b32';ctx.beginPath();ctx.arc(17,13,15,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#f8ead9';ctx.beginPath();ctx.ellipse(8,20,8,6,0,0,Math.PI*2);ctx.ellipse(26,20,8,6,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#552d2a';ctx.beginPath();ctx.ellipse(10,12,5.2,6.2,-.25,0,Math.PI*2);ctx.ellipse(24,12,5.2,6.2,.25,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(11,11,2.1,0,Math.PI*2);ctx.arc(23,11,2.1,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#171014';ctx.beginPath();ctx.arc(11.5,11.5,1.1,0,Math.PI*2);ctx.arc(23.5,11.5,1.1,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#f6c6a9';ctx.beginPath();ctx.ellipse(17,20,5.2,3.5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#39201e';ctx.beginPath();ctx.arc(17,18.5,1.8,0,Math.PI*2);ctx.fill();
  // Tiny paws.
  ctx.fillStyle='#632a25';ctx.beginPath();ctx.ellipse(8,46,6,3,0,0,Math.PI*2);ctx.ellipse(25,46,6,3,0,0,Math.PI*2);ctx.fill();
  ctx.restore();
 }
 function draw(){
  const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#101c38');sky.addColorStop(1,'#34536a');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  for(let i=0;i<45;i++){const sx=((i*137-camera*.18)%W+W)%W;ctx.fillStyle='rgba(255,243,196,.7)';ctx.fillRect(sx,(i*53)%170,2,2)}
  ctx.save();ctx.translate(-camera,0);
  platforms.forEach(p=>{ctx.fillStyle='#173c35';ctx.fillRect(p.x,p.y,p.w,H-p.y);ctx.fillStyle='#d4a84b';ctx.fillRect(p.x,p.y,p.w,5)});
  stars.forEach((s,i)=>{
   if(s.got)return;
   const bob=Math.sin(performance.now()/220+i)*4;
   ctx.save();ctx.translate(s.x,s.y+bob);
   // The secret word is printed directly below its matching star.
   const word=words[i];ctx.font='bold 13px Georgia,serif';
   const labelW=Math.max(42,ctx.measureText(word).width+14);
   ctx.fillStyle='rgba(8,12,24,.9)';ctx.strokeStyle='#f3d98b';ctx.lineWidth=1.5;
   ctx.beginPath();ctx.roundRect(-labelW/2,19,labelW,22,6);ctx.fill();ctx.stroke();
   ctx.fillStyle='#fff0bd';ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.shadowColor='transparent';ctx.fillText(word,0,30);
   ctx.shadowColor='#ffe28a';ctx.shadowBlur=18;ctx.fillStyle='#ffe28a';
   ctx.beginPath();for(let j=0;j<10;j++){const r=j%2?7:15,a=-Math.PI/2+j*Math.PI/5;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}
   ctx.closePath();ctx.fill();ctx.restore();
  });
  redPanda(player.x,player.y);ctx.restore();
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(14,12,180,8);ctx.fillStyle='#f3d98b';ctx.fillRect(14,12,180*(collected/7),8);
 }
 function finish(){
   clean();burst(innerWidth/2,innerHeight/3,100);fan();
   st.innerHTML=`<div class="message-art" id="messageArt">
    <p class="secret-congrats">Congratulations! You found the secret 7 words message.</p>
    <img class="reveal-cat" src="./cat.jfif" alt="A silly cat making a funny face">
    <p class="final-message">i'm perfect and it's not a compliment</p>
   </div>`;
   setTimeout(()=>{ $('messageArt').querySelector('.reveal-cat').classList.add('pop'); burst(innerWidth/2,innerHeight/2,75); fan(); },180);
   st.appendChild(btn('Continue',()=>round3()));
 }
 function update(){
  player.vx=0;if(keys.arrowleft||keys.a)player.vx=-3.7;if(keys.arrowright||keys.d)player.vx=3.7;
  if((keys[' ']||keys.arrowup||keys.w)&&player.onGround){player.vy=-10.8;player.onGround=false}
  player.x=Math.max(0,Math.min(worldW-player.w,player.x+player.vx));
  const oldBottom=player.y+player.h;player.vy=Math.min(12,player.vy+.48);player.y+=player.vy;player.onGround=false;
  platforms.forEach(p=>{if(player.x+player.w>p.x&&player.x<p.x+p.w&&oldBottom<=p.y+8&&player.y+player.h>=p.y&&player.vy>=0){player.y=p.y-player.h;player.vy=0;player.onGround=true}});
  if(player.y>H+100){player.x=Math.max(20,player.x-120);player.y=170;player.vy=0}
  stars.forEach((s,i)=>{if(s.got)return;if(Math.hypot(player.x+player.w/2-s.x,player.y+player.h/2-s.y)<29){
   s.got=true;collected++;count.textContent=`⭐ ${collected} / 7`;wordLine.textContent='Words collected: '+words.slice(0,collected).join('  ')+'  '+Array(7-collected).fill('_').join(' ');
   hint.textContent=`You found: ${words[i]}! Keep jumping for the next star.`;tone(580+i*65,.22);burst(innerWidth/2,innerHeight/2,22);if(collected===7)setTimeout(finish,650);
  }});
  camera=Math.max(0,Math.min(worldW-W,player.x-W*.38));
 }
 function loop(){if(!playing)return;update();draw();raf=requestAnimationFrame(loop)}
 wordLine.textContent='Words collected: _ _ _ _ _ _ _';loop();
}

/* ===== FINAL ROUND : password unlocks the birthday gift ===== */
function round3(){intro(3,"The Final Gift","One last password stands between you and your birthday surprise. Enter the seven-word message you discovered.",password)}
function password(){
 st.innerHTML=`<div class="sub">Round 3 · The golden door</div><p class="tx">You need to write the secret message with your own hands so we can confirm that you know the truth.</p><input type="text" id="pw" placeholder="Write the secret message" autocomplete="off"><br><p class="tx" id="msg">It has 7 words.</p>`;
 const norm=s=>s.toLowerCase().replace(/[^a-z]/g,'');
 const go=()=>{
  if(norm($('pw').value)===norm(PASSWORD)){burst(innerWidth/2,innerHeight/3,75);fan();giftReveal()}
  else say("Wrong password. Read the secret message again.")};
 st.insertBefore(btn('Open the door',go),$('msg'));
 $('pw').onkeydown=e=>{if(e.key==='Enter')go()};$('pw').focus();
}
function giftReveal(){
 st.innerHTML=`<div class="sub">Password accepted · Surprise unlocked</div><h1 class="gift-heading">You did it!</h1><p class="tx">A very important delivery has arrived for one very special birthday boy.</p><button class="big-gift" id="bigGift" aria-label="Open your birthday gift"><span class="gift-sparkle">✦</span><span class="gift-emoji">🎁</span><span class="gift-ribbon"></span><span class="gift-caption">TAP TO OPEN</span><span class="gift-sparkle two">✧</span></button><p class="tx gift-note">Warning: contents may cause excessive smiling.</p>`;
 const g=$('bigGift');g.onclick=()=>{g.disabled=true;g.classList.add('gift-open');burst(innerWidth/2,innerHeight/2,100);fan();setTimeout(surprise,650)};
 confetti(110);
}
function forestSVG(){
 const tree=(x,y,s,c)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="0" width="8" height="26" fill="#1a1008"/><g fill="${c}"><polygon points="0,-62 -24,-18 24,-18"/><polygon points="0,-42 -30,2 30,2"/><polygon points="0,-20 -36,24 36,24"/></g></g>`;
 let sky='';for(let i=0;i<28;i++)sky+=`<circle cx="${Math.random()*400}" cy="${Math.random()*110}" r="${Math.random()*1.1+.4}" fill="#fff" class="tw" style="animation-delay:${Math.random()*3}s"/>`;
 const back=[20,70,120,175,225,280,330,380].map((x,i)=>tree(x,150+(i%2)*8,.9,'#12331f')).join('');
 const front=[-5,48,352,405].map((x,i)=>tree(x,218,1.3+(i%2)*.15,'#0a1d14')).join('');
 return `<svg class="forest" viewBox="0 0 400 260"><defs><linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050c16"/><stop offset="1" stop-color="#1b3b2a"/></linearGradient><radialGradient id="fglow"><stop offset="0" stop-color="#f3d98b" stop-opacity=".8"/><stop offset="1" stop-color="#f3d98b" stop-opacity="0"/></radialGradient></defs>
 <rect width="400" height="260" fill="url(#fsky)"/>${sky}<circle cx="335" cy="40" r="34" fill="#f6ead0" opacity=".1"/><circle cx="335" cy="40" r="15" fill="#f6ead0"/>${back}
 <rect y="205" width="400" height="55" fill="#0c1a0f"/><ellipse cx="200" cy="212" rx="150" ry="10" fill="#142616"/><ellipse cx="200" cy="210" rx="62" ry="8" fill="#000" opacity=".5"/>
 <g class="mon" id="mon" stroke="#1a0b12" stroke-width="1.5">
  <rect x="165" y="170" width="22" height="40" rx="8" fill="#2b1620"/><rect x="213" y="170" width="22" height="40" rx="8" fill="#2b1620"/>
  <ellipse cx="200" cy="140" rx="62" ry="58" fill="#43202e"/><ellipse cx="200" cy="155" rx="38" ry="36" fill="#5a2c3c"/>
  <ellipse cx="138" cy="145" rx="14" ry="32" fill="#43202e" transform="rotate(20 138 145)"/><ellipse cx="262" cy="145" rx="14" ry="32" fill="#43202e" transform="rotate(-20 262 145)"/>
  <polygon points="124,172 131,188 138,172" fill="#e9d8ae"/><polygon points="262,172 269,188 276,172" fill="#e9d8ae"/>
  <ellipse cx="200" cy="100" rx="46" ry="40" fill="#4c2434"/>
  <polygon points="152,82 138,38 174,68" fill="#e9d8ae"/><polygon points="248,82 262,38 226,68" fill="#e9d8ae"/>
  <ellipse cx="182" cy="95" rx="9" ry="7" fill="#ff5a3a"/><ellipse cx="218" cy="95" rx="9" ry="7" fill="#ff5a3a"/>
  <ellipse cx="182" cy="95" rx="3" ry="5" fill="#000"/><ellipse cx="218" cy="95" rx="3" ry="5" fill="#000"/>
  <path d="M170 84L192 90M230 84L208 90" stroke="#1a0b12" stroke-width="3" stroke-linecap="round"/>
  <path d="M168 117Q200 140 232 117Q200 126 168 117Z" fill="#1a0508"/>
  <g fill="#fff3c4" stroke="none"><polygon points="175,120 180,130 185,122"/><polygon points="188,124 194,135 200,126"/><polygon points="200,126 206,135 212,124"/><polygon points="215,122 220,130 225,120"/></g>
 </g>
 ${front}
 <g id="hero"><path d="M48 214L60 170L72 214Z" fill="#243a52" stroke="#1a0f08"/><circle cx="60" cy="162" r="9" fill="#d3a07a" stroke="#1a0f08"/><path d="M51 160Q55 148 60 150Q66 147 69 160Q60 154 51 160Z" fill="#1b120c"/><line x1="72" y1="192" x2="94" y2="164" stroke="#e8e0cc" stroke-width="3" stroke-linecap="round"/></g>
 <g id="stars"></g>
 <g class="gift" id="gift" style="display:none"><circle cx="200" cy="195" r="62" fill="url(#fglow)"/><rect x="164" y="150" width="72" height="72" fill="transparent"/><rect x="178" y="180" width="44" height="34" fill="#c0392b" stroke="#1a0f08"/><rect x="174" y="172" width="52" height="12" fill="#d64533" stroke="#1a0f08"/><rect x="196" y="172" width="8" height="42" fill="#f3d98b"/><rect x="178" y="192" width="44" height="7" fill="#f3d98b"/><ellipse cx="191" cy="166" rx="8" ry="5" fill="none" stroke="#f3d98b" stroke-width="2.5"/><ellipse cx="209" cy="166" rx="8" ry="5" fill="none" stroke="#f3d98b" stroke-width="2.5"/><circle cx="200" cy="168" r="3" fill="#f3d98b"/></g>
 </svg>`;
}
function forest(){
 let hp=5,hearts=5,run=true,dir=1,pos=0,zl=30,got=0,phase='fight';const zw=24;
 st.innerHTML=`<div class="sub">Round 3 · The Dark Forest</div>${forestSVG()}<p class="tx" id="hud"></p><div class="bar" id="bar"><div class="zn" id="zn"></div><div class="nd" id="nd"></div></div><div id="act"></div><p class="tx" id="msg">A monster blocks the way! Tap Strike when the needle is in the green zone.</p>`;
 const mon=$('mon');
 mon.addEventListener('animationend',()=>mon.classList.remove('hit'));
 const hud=()=>{$('hud').textContent=phase==='fight'?'Monster: '+'♦'.repeat(hp)+'   Courage: '+'♥'.repeat(hearts):phase==='stars'?'Stars: '+got+' / 7':'Touch the gift!'};
 const newZone=()=>{zl=8+Math.random()*(84-zw);$('zn').style.left=zl+'%';$('zn').style.width=zw+'%'};
 let last=performance.now();
 const tick=t=>{if(!run||!$('nd'))return;const dt=Math.min(t-last,50);last=t;pos+=dir*dt*.06;if(pos>=99){pos=99;dir=-1}if(pos<=0){pos=0;dir=1}$('nd').style.left=pos+'%';requestAnimationFrame(tick)};
 function strike(){
  if(!run)return;
  if(pos>=zl-1&&pos<=zl+zw){
   hp--;mon.classList.remove('hit');requestAnimationFrame(()=>mon.classList.add('hit'));
   const r=mon.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/3,16);tone(300+hp*40,.15);
   if(hp<=0){run=false;defeat()}else{say("Great hit! The monster is angry!");newZone()}
  }else{
   hearts--;tone(120,.25);
   if(hearts<=0){hearts=5;hp=5;say("You fell down… but a hero always stands up. Try again!");newZone()}
   else say("Miss! The monster hits you.");
  }
  hud();
 }
 function defeat(){
  phase='stars';mon.classList.add('dead');fan();burst(innerWidth/2,innerHeight/3,60);
  $('bar').remove();$('act').remove();
  say("The monster falls! 7 stars drop from the sky. Tap them all!");
  hud();setTimeout(spawnStars,900);
 }
 function spawnStars(){
  const pts=[];while(pts.length<7){const p=[40+Math.random()*320,30+Math.random()*130];if(pts.every(q=>Math.hypot(q[0]-p[0],q[1]-p[1])>48))pts.push(p)}
  $('stars').innerHTML=pts.map(p=>`<g class="fs" transform="translate(${p[0]} ${p[1]})" style="cursor:pointer"><circle r="32" fill="transparent" pointer-events="all"/><g class="fstar"><circle r="20" fill="url(#fglow)"/><polygon points="0,-11 3,-4 10.5,-3.4 4.8,1.6 6.5,9 0,5 -6.5,9 -4.8,1.6 -10.5,-3.4 -3,-4" fill="#f3d98b" stroke="#fff3c4" stroke-width=".8"/></g></g>`).join('');
  $('stars').querySelectorAll('.fs').forEach(s=>s.onclick=()=>{
   if(s.dataset.got)return;s.dataset.got=1;s.firstChild.classList.add('got');got++;tone(500+got*70,.2);
   const r=s.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,14);hud();
   if(got===7){say("All 7 stars are yours! A golden light shines between the trees…");setTimeout(showGift,700)}
   else say("Star "+got+" of 7!");
  });
 }
 function showGift(){
  const g=$('gift');g.style.display='';phase='gift';hud();say("A gift appears! Touch it!");
  g.onclick=()=>{g.onclick=null;surprise()};
 }
 newZone();hud();$('act').appendChild(btn('Strike!',strike));requestAnimationFrame(tick);
}

/* musicToggle is defined near the audio setup above. */
function confetti(n=90){
 const C=['#f3d98b','#d4a84b','#e04a3a','#4aa3df','#7bd88f','#ffffff'];
 for(let i=0;i<n;i++){const p=document.createElement('i');p.className='cf';p.style.left=Math.random()*innerWidth+'px';p.style.background=C[i%C.length];document.body.append(p);
  p.animate([{transform:'translate(0,0) rotate(0deg)',opacity:1},{transform:`translate(${(Math.random()-.5)*180}px,${innerHeight+60}px) rotate(${Math.random()*720}deg)`,opacity:.9}],{duration:2800+Math.random()*2400,delay:Math.random()*1200,easing:'ease-in',fill:'backwards'}).onfinish=()=>p.remove()}
}

/* ===== SURPRISE PAGE ===== */
function cakeSVG(){
 const drip=(x0,x1,y,n)=>{const w=(x1-x0)/n;let d=`M${x0} ${y}`;for(let i=0;i<n;i++)d+=` q${w/2} ${12+(i%2)*9} ${w} 0`;return `<path d="${d} L${x1} ${y-12} L${x0} ${y-12}Z" fill="#f6ead0" stroke="#d9c79a" stroke-width="1"/>`};
 const xs=[95,122,150,178,205],cols=['#d4a84b','#e9d8ae','#d4a84b','#e9d8ae','#d4a84b'];
 const candles=xs.map((x,i)=>`<rect x="${x-4}" y="70" width="8" height="30" rx="2" fill="${cols[i]}" stroke="#1a0f08"/><g class="fl" transform="translate(${x} 60)" style="cursor:pointer"><rect x="-14" y="-18" width="28" height="30" fill="transparent"/><g class="fm"><circle r="13" fill="url(#cg)"/><path d="M0 -12Q-7 0 0 7Q7 0 0 -12Z" fill="#ffb347"/><path d="M0 -6Q-3 1 0 5Q3 1 0 -6Z" fill="#fff3c4"/></g></g>`).join('');
 return `<svg id="cake" viewBox="0 0 300 250"><defs><radialGradient id="cg"><stop offset="0" stop-color="#ffcf6a" stop-opacity=".55"/><stop offset="1" stop-color="#ffcf6a" stop-opacity="0"/></radialGradient></defs>
 <ellipse cx="150" cy="228" rx="142" ry="15" fill="#8a6420" stroke="#f3d98b"/>
 <rect x="40" y="150" width="220" height="76" rx="8" fill="#5a2c1c" stroke="#1a0f08" stroke-width="2"/><rect x="40" y="212" width="220" height="7" fill="#d4a84b"/>${drip(40,260,150,11)}
 <rect x="75" y="100" width="150" height="52" rx="8" fill="#6b3424" stroke="#1a0f08" stroke-width="2"/>${drip(75,225,100,8)}
 <text x="150" y="197" text-anchor="middle" font-family="'Cinzel Decorative','Cinzel',serif" font-weight="700" font-size="19" fill="#f3d98b" textLength="190" lengthAdjust="spacingAndGlyphs">HAPPY BIRTHDAY</text>
 <text x="150" y="141" text-anchor="middle" font-family="'Cinzel',Georgia,serif" font-weight="600" font-size="15" fill="#f6ead0" textLength="90" lengthAdjust="spacingAndGlyphs">YASSINE</text>
 ${candles}</svg>`;
}
function surprise(){
 show('s6');
  aud.pause();
  aud.currentTime=0;
  activeAudio=birthdayAud;
  birthdayAud.currentTime=0;
  birthdayAud.play().catch(()=>{});
 $('sur').innerHTML=`<div class="sub">Round 3 complete</div><h1>Surprise!</h1><div class="cakewrap">${cakeSVG()}</div><p class="tx" id="wish">Tap the flames to blow out the candles.</p><div class="funny" id="fn"></div><div id="sb"></div>`;
 let blown=false;
 const finale=()=>{if(blown)return;blown=true;$('wish').textContent='Make a wish! ✨ Happy Birthday!';confetti(130);const r=$('cake').getBoundingClientRect();burst(r.left+r.width/2,r.top+40,60);fan()};
 document.querySelectorAll('#sur .fl').forEach(f=>f.onclick=()=>{f.querySelector('.fm').classList.add('off');tone(300,.2);if(!document.querySelector('#sur .fm:not(.off)'))finale()});
 $('sb').append(btn('Blow the candles',()=>{document.querySelectorAll('#sur .fm').forEach(f=>f.classList.add('off'));finale()}),btn('Music on / off',musicToggle),btn('Play again',()=>location.reload()));
 confetti(100);
 setTimeout(()=>{const el=$('fn');let i=0;(function f(){el.textContent=FUNNY.slice(0,++i);if(i<FUNNY.length)setTimeout(f,32)})()},1500);
}
/* ===== EFFECTS ===== */
const cv=document.createElement('canvas');cv.id='bg';document.body.prepend(cv);const cx=cv.getContext('2d');let W,H;
function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight}rs();addEventListener('resize',rs);
const SS=[...Array(130)].map(()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.4+.3,p:Math.random()*6}));
const EM=[...Array(38)].map(()=>({x:Math.random()*W,y:Math.random()*H,v:.2+Math.random()*.5,r:1+Math.random()*2,d:Math.random()*6}));
let SH=[];
(function f(t){cx.clearRect(0,0,W,H);
 SS.forEach(s=>{cx.globalAlpha=.3+.7*Math.abs(Math.sin(t/900+s.p));cx.fillStyle='#fff3c4';cx.beginPath();cx.arc(s.x*W,s.y*H,s.r,0,7);cx.fill()});
 cx.shadowBlur=10;cx.shadowColor='#f3b04a';cx.fillStyle='#f0a63c';
 EM.forEach(e=>{e.y-=e.v;e.x+=Math.sin(t/1000+e.d)*.4;if(e.y<-5){e.y=H+5;e.x=Math.random()*W}cx.globalAlpha=.35+.3*Math.sin(t/500+e.d);cx.beginPath();cx.arc(e.x,e.y,e.r,0,7);cx.fill()});
 cx.shadowBlur=0;
 if(Math.random()<.006&&SH.length<2)SH.push({x:Math.random()*W*.8,y:Math.random()*H*.35,l:0});
 SH=SH.filter(s=>{s.x+=10;s.y+=4.5;s.l++;const g=cx.createLinearGradient(s.x,s.y,s.x-110,s.y-50);g.addColorStop(0,'#fff');g.addColorStop(1,'rgba(255,243,196,0)');cx.globalAlpha=1-s.l/60;cx.strokeStyle=g;cx.lineWidth=2;cx.beginPath();cx.moveTo(s.x,s.y);cx.lineTo(s.x-110,s.y-50);cx.stroke();return s.l<60});
 requestAnimationFrame(f)})(0);
['fog','fog f2','wall'].forEach(c=>{const d=document.createElement('div');d.className=c.split(' ')[0]==='wall'?'wall':c;d.id=c.split(' ')[0]+(c.includes('f2')?'2':'');document.body.append(d)});
const zoo=document.createElement('div');zoo.id='zoo';document.body.append(zoo);
const WK=['🐎','🐺','🦌','🐗','🐕'],FL=['🦅','🦇','🕊️','🦉'];
function spawn(){if(document.hidden)return;const fly=Math.random()<.4,a=document.createElement('div'),sp=document.createElement('span');
 sp.textContent=(fly?FL:WK)[Math.floor(Math.random()*(fly?FL:WK).length)];sp.className=fly?'fl':'wk';a.className='an';a.appendChild(sp);
 const sz=fly?26+Math.random()*16:34+Math.random()*18;a.style.fontSize=sz+'px';a.style[fly?'top':'bottom']=fly?(8+Math.random()*35)+'%':(30+Math.random()*14)+'px';zoo.appendChild(a);
 const r=Math.random()<.5,fl=r?-1:1,A=r?-80:innerWidth+80,B=r?innerWidth+80:-80;
 a.animate([{transform:`translateX(${A}px) scaleX(${fl})`},{transform:`translateX(${B}px) scaleX(${fl})`}],{duration:(fly?9000:16000)+Math.random()*7000,easing:'linear'}).onfinish=()=>a.remove()}

function burst(x,y,n=12){for(let i=0;i<n;i++){const p=document.createElement('i'),a=Math.random()*6.28,d=30+Math.random()*(n>20?160:60);p.className='sp';p.style.cssText=`left:${x}px;top:${y}px;width:${3+Math.random()*5}px;height:${3+Math.random()*5}px`;document.body.append(p);
 p.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${Math.cos(a)*d}px,${Math.sin(a)*d+20}px) scale(0)`,opacity:0}],{duration:600+Math.random()*600,easing:'ease-out'}).onfinish=()=>p.remove()}}
let ac;function tone(f,d,t=0,v=.07){try{ac=ac||new(window.AudioContext||webkitAudioContext)();if(ac.state==='suspended')ac.resume();const o=ac.createOscillator(),g=ac.createGain(),T=ac.currentTime+t;o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(v,T);g.gain.exponentialRampToValueAtTime(.001,T+d);o.connect(g);g.connect(ac.destination);o.start(T);o.stop(T+d)}catch(e){}}
function fan(){[523,659,784,1047].forEach((f,i)=>tone(f,.35,i*.14))}
function flash(){const d=document.createElement('div');d.className='fl2';document.body.append(d);d.animate([{opacity:.55},{opacity:0}],{duration:700}).onfinish=()=>d.remove()}
document.addEventListener('pointerdown',e=>{burst(e.clientX,e.clientY,12);if(e.target.closest('button,.card,circle'))tone(520+Math.random()*200,.12)});
document.addEventListener('pointermove',e=>{const f=document.querySelector('.screen.on .frame');if(f)f.style.transform=`perspective(900px) rotateY(${(e.clientX/innerWidth-.5)*6}deg) rotateX(${(e.clientY/innerHeight-.5)*-6}deg)`});
