(function(){
  "use strict";

  /* ── rack tabs ────────────────────────────────────────────────────────── */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.rack-index button'));
  tabs.forEach(function(tab, i){
    tab.addEventListener('click', function(){ select(i); });
    tab.addEventListener('keydown', function(e){
      var d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1
            : e.key === 'ArrowUp'   || e.key === 'ArrowLeft'  ? -1 : 0;
      if(!d) return;
      e.preventDefault();
      var n = (i + d + tabs.length) % tabs.length;
      select(n); tabs[n].focus();
    });
  });
  function select(i){
    tabs.forEach(function(t, n){
      t.setAttribute('aria-selected', n === i ? 'true' : 'false');
      document.getElementById(t.getAttribute('aria-controls'))
              .setAttribute('data-open', n === i ? 'true' : 'false');
    });
  }

  /* ── demo 1 · daily menu ──────────────────────────────────────────────── */
  var DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MENUS = {
    0:[['09:00','Sunday reset','Close the week. One line on what worked.'],
       ['13:00','The long read','One piece worth your coffee, picked by a member.'],
       ['16:00','Open room','No agenda. Whoever shows up, shows up.']],
    1:[['08:00','Monday intention','One sentence: what are you building this week?'],
       ['12:30','Member spotlight','This week it is someone new. Go say hello.'],
       ['19:00','Live build session','Bring the thing that is stuck.']],
    2:[['09:00','Ask me anything','The thread is open until 5pm.'],
       ['14:00','Lesson 3 unlocks','Onboarding that members finish.']],
    3:[['08:30','Midweek check-in','Halfway. What moved, what did not?'],
       ['18:00','Workshop','Ninety minutes, cameras optional.']],
    4:[['09:00','Wins thread','Small counts. Post it anyway.'],
       ['15:00','Office hours','Fifteen minute slots, first come.']],
    5:[['08:00','Friday round-up','Everything that happened, in one card.'],
       ['13:00','Weekend challenge','Optional. Slightly addictive.']],
    6:[['10:00','Saturday deep dive','One long read, one long conversation.'],
       ['14:00','Show your work','Post the half-finished thing. That is the point.'],
       ['17:00','Slow thread','No pressure to reply today. It will still be here Monday.']]
  };
  var today = new Date();
  var dow = today.getDay();
  var dayEl = document.getElementById('menuDay');
  var dateEl = document.getElementById('menuDate');
  var listEl = document.getElementById('menuList');
  if(dayEl){
    dayEl.textContent = DAYS[dow];
    dateEl.textContent = today.toLocaleDateString('en-GB',{day:'numeric',month:'long'});
    MENUS[dow].forEach(function(item){
      var row = document.createElement('div');
      row.className = 'menu-item';
      row.innerHTML =
        '<span class="menu-time">' + item[0] + '</span>' +
        '<span><h4>' + item[1] + '</h4><p>' + item[2] + '</p></span>';
      var btn = document.createElement('button');
      btn.className = 'menu-go'; btn.type = 'button'; btn.textContent = 'Mark done';
      btn.addEventListener('click', function(){
        var on = btn.getAttribute('data-done') === 'true';
        btn.setAttribute('data-done', on ? 'false' : 'true');
        btn.textContent = on ? 'Mark done' : 'Done';
      });
      row.appendChild(btn);
      listEl.appendChild(row);
    });
  }

  /* ── demo 2 · quiz ────────────────────────────────────────────────────── */
  var QUIZ = [
    {q:'When your community goes quiet for a week, what is your first move?',
     a:[['I post more. Something has to break the silence.','host'],
        ['I go find the three people who always reply and ask them what is off.','gardener'],
        ['I look at the numbers and work out where people dropped off.','architect']]},
    {q:'A new member joins today. What do they get?',
     a:[['A personal welcome from me, written fresh.','host'],
        ['A warm hello in the thread, and someone assigned to look after them.','gardener'],
        ['An onboarding flow that runs whether I am there or not.','architect']]},
    {q:'What would you rather be told about your community?',
     a:[['That it feels like the person running it genuinely cares.','host'],
        ['That members look after each other without being asked.','gardener'],
        ['That everything just works and nothing gets lost.','architect']]}
  ];
  var RESULTS = {
    host:{t:'The Host',
      d:'You carry the warmth of the room personally, and it shows. It also means the room dims when you step away. The thing to build first is anything that keeps your voice present when you are not: an automated welcome sequence that actually sounds like you.'},
    gardener:{t:'The Gardener',
      d:'You grow connection between members rather than to yourself, which is the harder and better instinct. Build the thing that helps members find each other on purpose: a member directory, matching, a spotlight that runs itself.'},
    architect:{t:'The Architect',
      d:'You think in systems, and your community will scale further than most because of it. Build the layer that makes the structure visible to members: a roadmap, a dashboard, progress they can see.'}
  };
  var quizBody = document.getElementById('quizBody');
  var qIndex = 0, tally = {host:0,gardener:0,architect:0};
  function renderQuiz(){
    if(!quizBody) return;
    if(qIndex >= QUIZ.length){
      var top = Object.keys(tally).sort(function(a,b){ return tally[b]-tally[a]; })[0];
      var r = RESULTS[top];
      quizBody.innerHTML =
        '<div class="quiz-result"><span class="badge">Your result</span>' +
        '<h4>' + r.t + '</h4><p>' + r.d + '</p>' +
        '<button class="link-btn" type="button" id="quizAgain">Take it again</button></div>';
      document.getElementById('quizAgain').addEventListener('click', function(){
        qIndex = 0; tally = {host:0,gardener:0,architect:0}; renderQuiz();
      });
      return;
    }
    var item = QUIZ[qIndex];
    var bars = QUIZ.map(function(_, n){
      return '<i data-on="' + (n <= qIndex ? 'true' : 'false') + '"></i>';
    }).join('');
    quizBody.innerHTML =
      '<div class="quiz-prog">' + bars + '</div>' +
      '<div class="quiz-q">' + item.q + '</div>' +
      '<div class="quiz-opts"></div>';
    var opts = quizBody.querySelector('.quiz-opts');
    item.a.forEach(function(pair){
      var b = document.createElement('button');
      b.className = 'quiz-opt'; b.type = 'button'; b.textContent = pair[0];
      b.addEventListener('click', function(){ tally[pair[1]]++; qIndex++; renderQuiz(); });
      opts.appendChild(b);
    });
  }
  renderQuiz();

  /* ── demo 3 · roadmap ─────────────────────────────────────────────────── */
  var ROAD = [
    ['Land well','You know where you are and what this place is for.'],
    ['Meet three people','Not a directory. Three actual humans who know your name.'],
    ['Finish the starter course','The one thing that makes everything after it easier.'],
    ['Bring something','Ask a question, answer one, post the thing you made.'],
    ['Take a room','Host a thread, run a session, look after the new ones.']
  ];
  var roadList = document.getElementById('roadList');
  var roadPct = document.getElementById('roadPct');
  var roadNext = document.getElementById('roadNext');
  var roadAt = 1;
  function renderRoad(){
    if(!roadList) return;
    roadList.innerHTML = '';
    ROAD.forEach(function(s, i){
      var el = document.createElement('div');
      el.className = 'road-stage';
      el.setAttribute('data-done', i < roadAt ? 'true' : 'false');
      el.setAttribute('data-current', i === roadAt ? 'true' : 'false');
      el.innerHTML = '<span class="road-rail"></span><span><h4>' + s[0] + '</h4><p>' + s[1] + '</p></span>';
      el.style.cursor = 'pointer';
      el.addEventListener('click', function(){ roadAt = i + 1; renderRoad(); });
      roadList.appendChild(el);
    });
    var pct = Math.round(roadAt / ROAD.length * 100);
    roadPct.textContent = pct + '%';
    roadNext.textContent = roadAt >= ROAD.length
      ? 'Every stage cleared. This member is now one of the people who runs the place.'
      : 'Next up: ' + ROAD[roadAt][0];
  }
  renderRoad();
  var roadReset = document.getElementById('roadReset');
  if(roadReset) roadReset.addEventListener('click', function(){ roadAt = 1; renderRoad(); });

  /* ── demo 4 · lessons ─────────────────────────────────────────────────── */
  var LESSONS = [
    ['Why most communities go quiet','8 min'],
    ['The first seven days','12 min'],
    ['Rhythm beats effort','9 min'],
    ['Handing the room over','14 min']
  ];
  var lesDone = 1;
  var lesList = document.getElementById('lesList');
  function renderLessons(){
    if(!lesList) return;
    lesList.innerHTML = '';
    LESSONS.forEach(function(l, i){
      var state = i < lesDone ? 'done' : (i === lesDone ? 'open' : 'locked');
      var row = document.createElement('div');
      row.className = 'les-row';
      row.setAttribute('data-state', state);
      row.innerHTML =
        '<span class="les-n">' + (state === 'done' ? '&check;' : (i+1)) + '</span>' +
        '<span><h4>' + l[0] + '</h4><span class="les-meta">' +
          (state === 'done' ? 'Complete' : state === 'open' ? 'Video · ' + l[1] : 'Unlocks when you finish the one above') +
        '</span></span>';
      if(state !== 'locked'){
        var b = document.createElement('button');
        b.className = 'les-act'; b.type = 'button';
        b.textContent = state === 'done' ? 'Rewatch' : 'Watch';
        b.addEventListener('click', function(){
          if(state === 'open'){ lesDone = i + 1; renderLessons(); }
        });
        row.appendChild(b);
      }
      lesList.appendChild(row);
    });
    var pct = Math.round(lesDone / LESSONS.length * 100);
    document.getElementById('lesPct').textContent = pct + '%';
    document.getElementById('lesCount').textContent = lesDone + ' of ' + LESSONS.length + ' complete';
  }
  renderLessons();

  /* ── demo 5 · checklist ───────────────────────────────────────────────── */
  var CHECKS = [
    'Say hello in the welcome thread',
    'Add a photo and one line about what you are building',
    'Watch the 4 minute orientation',
    'Reply to one other member',
    'Pick your first course',
    'Put the live session in your calendar'
  ];
  var checkList = document.getElementById('checkList');
  var checkFill = document.getElementById('checkFill');
  var checkDone = document.getElementById('checkDone');
  if(checkList){
    CHECKS.forEach(function(text){
      var row = document.createElement('div');
      row.className = 'check-row';
      row.setAttribute('role','checkbox');
      row.setAttribute('aria-checked','false');
      row.setAttribute('tabindex','0');
      row.innerHTML = '<span class="check-box">&check;</span><span class="check-label">' + text + '</span>';
      function toggle(){
        var on = row.getAttribute('data-on') === 'true';
        row.setAttribute('data-on', on ? 'false' : 'true');
        row.setAttribute('aria-checked', on ? 'false' : 'true');
        tallyChecks();
      }
      row.addEventListener('click', toggle);
      row.addEventListener('keydown', function(e){
        if(e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); toggle(); }
      });
      checkList.appendChild(row);
    });
  }
  function tallyChecks(){
    var rows = checkList.querySelectorAll('.check-row');
    var on = checkList.querySelectorAll('.check-row[data-on="true"]').length;
    checkFill.style.width = (on / rows.length * 100) + '%';
    checkDone.setAttribute('data-show', on === rows.length ? 'true' : 'false');
  }

  /* ── demo 6 · bot ─────────────────────────────────────────────────────── */
  var BOT = [
    {k:['quiet','dead','crickets','engagement','engage'],
     a:'Quiet usually is not an effort problem, it is a rhythm problem. In your book you call it "the empty room test": if a member arrives on a random Tuesday, is there something obviously for them to do? Start there before you post more.'},
    {k:['onboard','new member','welcome','first week','start'],
     a:'Your first seven days framework: land well, meet three people, finish one small thing. Chapter 4 has the version you teach, and there is a checklist template in the resources space.'},
    {k:['price','pricing','charge','cost','money'],
     a:'You cover this in the pricing talk: charge for the transformation, not the hours. The worked example with the three tiers is at 22 minutes into the recording.'},
    {k:['burn','tired','exhausted','alone','overwhelm'],
     a:'You have written about this more than anything else. The line was: "if the room needs you to be there for it to be alive, you have built a stage, not a home." The handover chapter is the practical version.'},
    {k:['retention','churn','leave','renew'],
     a:'Retention in your material is downstream of belonging, not features. The three signals you track are: did they speak in week one, do they know anyone by name, and can they see progress.'}
  ];
  var botLog = document.getElementById('botLog');
  var botChips = document.getElementById('botChips');
  var botForm = document.getElementById('botForm');
  var botInput = document.getElementById('botInput');
  function say(text, who){
    var b = document.createElement('div');
    b.className = 'bubble ' + who;
    b.textContent = text;
    botLog.appendChild(b);
    botLog.scrollTop = botLog.scrollHeight;
  }
  function answer(q){
    var lower = q.toLowerCase();
    var hit = BOT.filter(function(e){
      return e.k.some(function(k){ return lower.indexOf(k) > -1; });
    })[0];
    return hit ? hit.a
      : 'I have not been trained on that one yet. Ask me about engagement, onboarding, pricing, burnout or retention, or add the source material and I will know it tomorrow.';
  }
  if(botLog){
    say('I have read everything you have published. Ask me anything a member would ask.', 'them');
    ['Why has my community gone quiet?','What should new members do first?','How do I stop burning out?']
      .forEach(function(q){
        var c = document.createElement('button');
        c.className = 'chip'; c.type = 'button'; c.textContent = q;
        c.addEventListener('click', function(){ ask(q); });
        botChips.appendChild(c);
      });
    botForm.addEventListener('submit', function(e){
      e.preventDefault();
      var v = botInput.value.trim();
      if(v){ ask(v); botInput.value = ''; }
    });
  }
  function ask(q){
    say(q, 'you');
    setTimeout(function(){ say(answer(q), 'them'); }, 320);
  }

  /* ── newsletter ───────────────────────────────────────────────────────── */
  var newsForm = document.getElementById('newsForm');
  if(newsForm){
    newsForm.addEventListener('submit', function(e){
      e.preventDefault();
      document.getElementById('newsMsg').textContent =
        'Demo only, not wired up yet. Hook this to your list before launch.';
    });
  }
})();
