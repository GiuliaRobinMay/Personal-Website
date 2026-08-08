(function(){
  "use strict";

  /* Anyone who has asked for less motion gets every timed demo instantly
     instead of stepping through. Nothing is lost, only the theatre. */
  var CALM = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  function after(ms, fn){ return setTimeout(fn, CALM ? 0 : ms); }

  /* ── mobile nav ───────────────────────────────────────────────────────── */
  var navToggle = document.getElementById('navToggle');
  var navLinks  = document.getElementById('navLinks');
  if(navToggle && navLinks){
    navToggle.addEventListener('click', function(){
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      navLinks.setAttribute('data-open', open ? 'false' : 'true');
    });
    /* tapping a link should close the sheet, not leave it hanging over the page */
    navLinks.addEventListener('click', function(e){
      if(e.target.tagName !== 'A') return;
      navToggle.setAttribute('aria-expanded','false');
      navLinks.setAttribute('data-open','false');
    });
  }

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

  /* ── demo 7 · automation ──────────────────────────────────────────────── */
  var FLOW = [
    ['Member joins','The trigger. Everything below hangs off this one event.','Community'],
    ['Read what they told you','Plan, referrer, the answers from the join form. Nothing gets asked twice.','Database'],
    ['Write a welcome that sounds like you','Their name, their goal, your voice. Not a merge tag in a template.','AI'],
    ['Put them in the right rooms','Tagged, placed and introduced to the three members who match them.','Community'],
    ['Schedule the first seven days','Six touches, spaced properly, cancelled the moment they no longer need them.','Scheduler'],
    ['Tell you only if it matters','No notification for the 499 that went fine. One for the person who went quiet.','Slack']
  ];
  var flowList = document.getElementById('flowList');
  var flowRun  = document.getElementById('flowRun');
  var flowStat = document.getElementById('flowStat');
  var flowTimers = [];
  if(flowList){
    FLOW.forEach(function(s, i){
      var el = document.createElement('div');
      el.className = 'flow-step';
      el.setAttribute('data-state','idle');
      el.innerHTML =
        '<span class="flow-dot">' + (i+1) + '</span>' +
        '<span><h4>' + s[0] + '</h4><p>' + s[1] + '</p></span>' +
        '<span class="flow-tool">' + s[2] + '</span>';
      flowList.appendChild(el);
    });
    flowRun.addEventListener('click', function(){
      flowTimers.forEach(clearTimeout);
      flowTimers = [];
      var steps = flowList.querySelectorAll('.flow-step');
      Array.prototype.forEach.call(steps, function(s){ s.setAttribute('data-state','idle'); });
      flowRun.disabled = true;
      flowStat.textContent = 'Running...';
      FLOW.forEach(function(_, i){
        flowTimers.push(after(i * 620, function(){
          steps[i].setAttribute('data-state','run');
          flowTimers.push(after(430, function(){
            steps[i].setAttribute('data-state','done');
            steps[i].querySelector('.flow-dot').innerHTML = '&check;';
          }));
        }));
      });
      flowTimers.push(after(FLOW.length * 620 + 500, function(){
        flowRun.disabled = false;
        flowStat.textContent = 'Done. That is every one of those jobs, off your desk, forever.';
      }));
    });
  }

  /* ── demo 8 · MCP ─────────────────────────────────────────────────────── */
  var MCP = [
    {q:'Who joined this week and has not posted yet?',
     calls:[['list_members','joined_after: "7d"','412 members'],
            ['get_activity','member_ids: [412], type: "post"','38 have posted']],
     a:'374 of the 412 who joined this week have not posted. 61 of them opened the app more than three times, so they are lurking rather than gone. Want me to drop them into the quiet-starter sequence?'},
    {q:'Set up next month\'s workshop space.',
     calls:[['create_space','name: "March Workshop", type: "events"','space_id 8841'],
            ['set_access','plan: "Inner Circle"','restricted'],
            ['publish_landing_page','template: "workshop"','live']],
     a:'Space created, locked to Inner Circle, and the sign-up page is live. It is empty except for the pinned briefing. Say the word and I will announce it.'},
    {q:'What is actually working in here?',
     calls:[['get_space_feed','range: "30d"','1,204 posts'],
            ['rank_engagement','by: "replies_per_post"','ranked']],
     a:'The Wins thread beats everything else by a factor of four on replies per post, and it costs you nothing to run. Your carefully produced Monday briefing is bottom three. That is not a content problem, it is a format problem.'}
  ];
  var mcpLog   = document.getElementById('mcpLog');
  var mcpChips = document.getElementById('mcpChips');
  var mcpTimers = [];
  function mcpSay(text, who){
    var b = document.createElement('div');
    b.className = 'bubble ' + who;
    b.textContent = text;
    mcpLog.appendChild(b);
    mcpLog.scrollTop = mcpLog.scrollHeight;
  }
  function mcpRun(item){
    mcpTimers.forEach(clearTimeout);
    mcpTimers = [];
    mcpLog.innerHTML = '';
    mcpSay(item.q, 'you');
    item.calls.forEach(function(c, i){
      mcpTimers.push(after(360 + i * 620, function(){
        var el = document.createElement('div');
        el.className = 'mcp-call';
        el.innerHTML = '<b>Tool call</b><code>' + c[0] + '(' + c[1] + ')</code> &rarr; ' + c[2];
        mcpLog.appendChild(el);
        mcpLog.scrollTop = mcpLog.scrollHeight;
      }));
    });
    mcpTimers.push(after(360 + item.calls.length * 620 + 240, function(){
      mcpSay(item.a, 'them');
    }));
  }
  if(mcpLog){
    var hint = document.createElement('div');
    hint.className = 'mcp-wait';
    hint.textContent = 'Pick a question. Watch it reach into the community and actually do the work.';
    mcpLog.appendChild(hint);
    MCP.forEach(function(item){
      var c = document.createElement('button');
      c.className = 'chip'; c.type = 'button'; c.textContent = item.q;
      c.addEventListener('click', function(){ mcpRun(item); });
      mcpChips.appendChild(c);
    });
  }

  /* ── demo 9 · second brain ────────────────────────────────────────────── */
  var BRAIN = [
    {k:['price','pricing','charge','cost','money','rate'],
     a:'Your position has not moved in six years: price the transformation, not the hours. What did move is the tiering. In 2021 you taught three tiers; since the 2024 talk you argue for two, because the middle tier is where people stall.',
     src:[['Podcast &middot; ep. 84','"The middle tier is a decision you are making on their behalf." 22:10'],
          ['Course &middot; module 3','Worked pricing example, three communities'],
          ['Voice note &middot; Mar 2024','The reason you dropped from three tiers to two']]},
    {k:['quiet','dead','engagement','engage','silence'],
     a:'You have written about this eleven times. The through-line: quiet is a rhythm problem, not an effort problem. Your test is whether a member arriving on a random Tuesday finds something obviously for them.',
     src:[['Book &middot; ch. 2','The empty room test'],
          ['Newsletter &middot; Nov 2023','"Posting more into a quiet room makes it quieter"'],
          ['Workshop recording','The 90-day rhythm exercise']]},
    {k:['onboard','welcome','first week','new member','start'],
     a:'Land well, meet three people, finish one small thing. You have taught this since 2019 and the only change is that step two used to be optional. You made it mandatory after the retention data came in.',
     src:[['Book &middot; ch. 4','The first seven days'],
          ['Client debrief &middot; 2023','Why "meet three people" stopped being optional'],
          ['Template','Seven-day onboarding checklist']]},
    {k:['burn','tired','exhausted','alone','overwhelm','boundaries'],
     a:'Your own line, from a talk you have never written up: "if the room needs you to be there for it to be alive, you have built a stage, not a home." Everything you teach about handover comes out of that sentence.',
     src:[['Keynote &middot; 2022','Unpublished. 34:50'],
          ['Book &middot; ch. 9','Handing the room over'],
          ['Journal &middot; Jan 2023','The week you nearly quit']]}
  ];
  var brainForm  = document.getElementById('brainForm');
  var brainInput = document.getElementById('brainInput');
  var brainChips = document.getElementById('brainChips');
  var brainOut   = document.getElementById('brainOut');
  function brainSearch(q){
    var lower = q.toLowerCase();
    var hit = BRAIN.filter(function(e){
      return e.k.some(function(k){ return lower.indexOf(k) > -1; });
    })[0];
    if(!hit){
      brainOut.innerHTML =
        '<div class="brain-ans">Nothing on that yet. This one is trained on a sample; the real thing reads ' +
        'everything you have ever made. Try pricing, engagement, onboarding or burnout.</div>';
      return;
    }
    brainOut.innerHTML =
      '<div class="brain-ans">' + hit.a + '</div>' +
      '<div class="brain-src"><span class="k">Where this came from</span>' +
      hit.src.map(function(s){
        return '<div class="brain-cite"><i>' + s[0] + '</i><span>' + s[1] + '</span></div>';
      }).join('') + '</div>';
  }
  if(brainOut){
    ['How do I price this?','Why has it gone quiet?','What do new members do first?']
      .forEach(function(q){
        var c = document.createElement('button');
        c.className = 'chip'; c.type = 'button'; c.textContent = q;
        c.addEventListener('click', function(){ brainInput.value = q; brainSearch(q); });
        brainChips.appendChild(c);
      });
    brainForm.addEventListener('submit', function(e){
      e.preventDefault();
      var v = brainInput.value.trim();
      if(v) brainSearch(v);
    });
    brainSearch('pricing');
  }

  /* ── demo 10 · integrations ───────────────────────────────────────────── */
  var TOOLS = [
    {n:'Community', s:'Mighty, Circle, Skool',
     f:[['Out','A member joins, upgrades or goes quiet &mdash; every one of those is a trigger.'],
        ['In','New spaces, posts, events and access changes, created without you opening a tab.']]},
    {n:'Email', s:'Kit, Mailchimp',
     f:[['Out','Who opened, who clicked, who has not heard from you in six weeks.'],
        ['In','Sequences that start and stop based on what the member actually did in the community.']]},
    {n:'CRM', s:'Airtable, Notion, HubSpot',
     f:[['Out','The record of the human: what they bought, what they asked, what they are working on.'],
        ['In','Updated the moment anything changes, so you stop maintaining it by hand.']]},
    {n:'Calendar', s:'Google, Calendly',
     f:[['Out','Who booked, who showed, who booked and then vanished.'],
        ['In','Sessions created, reminders sent, follow-ups written before you have closed the tab.']]},
    {n:'Payments', s:'Stripe',
     f:[['Out','Upgrades, failed cards, cancellations &mdash; each one a different conversation.'],
        ['In','Access granted or revoked in the community the second the payment resolves.']]},
    {n:'Your AI', s:'Claude, via MCP',
     f:[['Out','Answers, drafts, summaries and decisions, grounded in your actual data.'],
        ['In','Read and write access to every tool above, so it can do the job instead of describing it.']]}
  ];
  var intGrid   = document.getElementById('intGrid');
  var intDetail = document.getElementById('intDetail');
  function renderInt(active){
    intGrid.innerHTML = '';
    TOOLS.forEach(function(t, i){
      var b = document.createElement('button');
      b.className = 'int-tool'; b.type = 'button';
      b.setAttribute('data-on', i === active ? 'true' : 'false');
      b.innerHTML = t.n + '<small>' + t.s + '</small>';
      b.addEventListener('click', function(){ renderInt(i); });
      intGrid.appendChild(b);
    });
    var t = TOOLS[active];
    intDetail.innerHTML = '<h4>' + t.n + '</h4>' + t.f.map(function(f){
      return '<div class="int-flow"><b>' + f[0] + '</b><span>' + f[1] + '</span></div>';
    }).join('');
  }
  if(intGrid) renderInt(0);

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
