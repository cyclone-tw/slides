(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const screen = $('screen');
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const storageKey = 'campus-guardian-preview-v1';
  let state = {phase:'cover',chapter:0,lesson:0};
  let history = [];
  let completed = new Set();
  let resume = null;
  const valid = s => s && Number.isInteger(s.chapter) && s.chapter >= 0 && s.chapter < CHAPTERS.length && ['intro','question','lesson','finish'].includes(s.phase) && Number.isInteger(s.lesson) && s.lesson >= 0 && s.lesson < CHAPTERS[s.chapter].lessons.length;
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (stored && valid(stored.state)) resume = stored.state;
    if (Array.isArray(stored?.completed)) completed = new Set(stored.completed.filter(id => CHAPTERS.some(c => c.id === id)));
  } catch (_) { /* Browser storage is optional, including file:// and private mode. */ }

  function save() {
    if (state.phase === 'cover') return;
    const durable = {...state,phase:state.phase === 'wrong' ? 'question' : state.phase};
    delete durable.wrong;
    resume = durable;
    try { localStorage.setItem(storageKey, JSON.stringify({state:durable,completed:[...completed]})); } catch (_) {}
  }
  function go(next, remember = true) {
    if (remember) history.push({...state});
    state = {...next};
    save();
    render();
  }
  function start() { history = []; go({phase:'intro',chapter:0,lesson:0}); }
  function back() {
    if (state.phase === 'wrong') { go({...state,phase:'question'},false); return; }
    if (history.length) { state = history.pop(); save(); render(); return; }
    if (state.phase === 'lesson' && state.lesson > 0) { go({...state,lesson:state.lesson-1},false); return; }
    if (state.phase === 'lesson') { go({...state,phase:'question',lesson:0},false); return; }
    if (state.phase === 'question') { go({...state,phase:'intro'},false); return; }
    go({phase:'cover',chapter:0,lesson:0},false);
  }
  const teacher = () => `<img class="teacher" src="${ASSETS.teacher}" alt="手拿備課資料的教師主角">`;
  const owl = () => `<img class="guardian" src="${ASSETS.owl}" alt="校園守護貓頭鷹">`;
  const primary = (action,label) => `<button class="primary" data-action="${action}" data-primary>${escape(label)}</button>`;
  const paragraphs = list => `<div class="body-copy">${list.map(s=>`<p>${escape(s)}</p>`).join('')}</div>`;
  const heading = title => `<h2 tabindex="-1">${escape(title)}</h2>`;

  function render() {
    const chapter = CHAPTERS[state.chapter];
    $('stage').className = `stage ${state.phase}`;
    screen.className = `screen ${state.phase}`;
    const background = state.phase === 'cover' || state.phase === 'finish' ? 'corridor' : chapter.bg;
    if ($('backdrop').dataset.scene !== background) { $('backdrop').src = ASSETS[background]; $('backdrop').dataset.scene = background; }
    $('location').textContent = state.phase === 'cover' || state.phase === 'finish' ? '' : chapter.place;
    $('back').hidden = state.phase === 'cover';
    if (state.phase === 'cover') {
      screen.innerHTML = `<section class="cover-copy"><h1 tabindex="-1"><span>校園資通安全</span><span>與數位防護實務</span></h1><p class="cover-details"><span>國姓國小</span><time datetime="2026-10-07">2026-10-07</time></p><div class="start-actions">${primary('start','開始冒險')}${resume ? '<button class="text-button" data-action="resume">接續上次</button>' : ''}</div></section><div class="cover-cast">${teacher()}${owl()}</div>`;
    } else if (state.phase === 'intro') {
      screen.innerHTML = `<div class="cast">${teacher()}</div><section class="panel">${heading(chapter.title)}${paragraphs([chapter.intro])}<blockquote class="dialogue"><span class="speaker">${escape(chapter.speaker)}</span><p>${escape(chapter.quote)}</p></blockquote><div class="panel-actions">${primary('question','做出選擇')}</div></section>`;
    } else if (state.phase === 'question') {
      screen.innerHTML = `<div class="cast">${teacher()}</div><section class="panel">${heading(chapter.question)}<p class="cue">${escape(chapter.cue)}</p><div class="choices">${chapter.choices.map((choice,i)=>`<button class="choice" data-choice="${i}"><span class="choice-letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span>${escape(choice.text)}</span></button>`).join('')}</div></section>`;
    } else if (state.phase === 'wrong') {
      const choice = chapter.choices[state.wrong];
      screen.innerHTML = `<div class="cast">${teacher()}</div><section class="panel"><p class="failure-label">闖關失敗</p>${heading('這個選擇，留下了破口。')}${paragraphs([choice.failure])}<div class="panel-actions">${primary('retry','再試一次')}</div></section>`;
    } else if (state.phase === 'lesson') {
      const lesson = chapter.lessons[state.lesson];
      const last = state.lesson === chapter.lessons.length-1;
      screen.innerHTML = `<div class="cast">${owl()}</div><section class="panel"><span class="speaker">校園守護貓頭鷹</span>${heading(lesson.title)}${paragraphs(lesson.body)}<div class="panel-actions">${lesson.sources ? '<button class="text-button source-action" data-action="sources">資訊來源</button>' : ''}${primary('next',last ? (state.chapter === CHAPTERS.length-1 ? '完成冒險' : '前往下一個場景') : '繼續聽解說')}</div></section>`;
    } else if (state.phase === 'finish') {
      screen.innerHTML = `<div class="cast">${owl()}${teacher()}</div><section class="panel">${heading('今天的校園，平安過關。')}${paragraphs(['你守護的，是學生、同事，還有能安心進行的每一堂課。'])}<p class="tagline">先查證、少交付、給對權限。<br>出了狀況，一起求助。</p><div class="panel-actions"><button class="text-button source-action" data-action="all-sources">資訊來源</button>${primary('chapters','回顧校園情境')}</div></section>`;
    }
    window.scrollTo({top:0,left:0,behavior:'instant'});
    screen.querySelector('h1,h2')?.focus({preventScroll:true});
  }
  function choose(index) {
    if (state.phase !== 'question') return;
    const choice = CHAPTERS[state.chapter].choices[index];
    if (!choice) return;
    if (choice.correct) go({...state,phase:'lesson',lesson:0});
    else go({...state,phase:'wrong',wrong:index},false);
  }
  function next() {
    if (state.phase !== 'lesson') return;
    const chapter = CHAPTERS[state.chapter];
    if (state.lesson < chapter.lessons.length-1) { go({...state,lesson:state.lesson+1}); return; }
    completed.add(chapter.id);
    if (state.chapter < CHAPTERS.length-1) go({phase:'intro',chapter:state.chapter+1,lesson:0});
    else go({phase:'finish',chapter:state.chapter,lesson:0});
  }
  function openChapters() {
    $('chapter-list').innerHTML = CHAPTERS.map((c,i)=>`<button class="chapter-link" data-chapter="${i}" ${state.phase !== 'cover' && state.chapter === i ? 'aria-current="true"' : ''}>${escape(c.title)}<small>${escape(c.place)}${completed.has(c.id) ? '・已走訪' : ''}</small></button>`).join('');
    $('navigation').showModal();
  }
  function openSources(all=false) {
    const chapter = CHAPTERS[state.chapter];
    const ids = all ? Object.keys(SOURCES) : chapter.lessons[state.lesson]?.sources || [];
    $('sources-title').textContent = all ? '資訊來源' : chapter.title+'｜資訊來源';
    $('source-list').innerHTML = ids.map(id => {
      const s = SOURCES[id];
      return `<article class="source-item"><div class="publisher">${escape(s.publisher)}</div><a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.title)}</a><p>${escape(s.note)}</p></article>`;
    }).join('') + (all ? '<p class="source-note">情境依提供的講綱與簡報改編；校園、人物及事件為虛構教學設計。像素場景與角色由 AI 生成。</p>' : '');
    $('sources').showModal();
  }
  const actions = {
    start,
    resume:()=> { if (resume) { history=[]; go({...resume},false); } },
    question:()=> { if (state.phase === 'intro') go({...state,phase:'question'}); },
    retry:()=> { if (state.phase === 'wrong') go({...state,phase:'question'},false); },
    next,
    sources:()=>openSources(false),
    'all-sources':()=>openSources(true),
    chapters:openChapters
  };
  screen.addEventListener('click',event=> {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.choice !== undefined) choose(Number(button.dataset.choice));
    else actions[button.dataset.action]?.();
  });
  $('back').addEventListener('click',back);
  $('chapters-button').addEventListener('click',openChapters);
  $('chapter-list').addEventListener('click',event=> {
    const button = event.target.closest('[data-chapter]');
    if (!button) return;
    $('navigation').close();
    go({phase:'intro',chapter:Number(button.dataset.chapter),lesson:0});
  });
  $('cover-button').addEventListener('click',()=> { $('navigation').close(); go({phase:'cover',chapter:0,lesson:0}); });
  $('all-sources-button').addEventListener('click',()=> { $('navigation').close(); openSources(true); });
  document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>$(button.dataset.close).close()));
  document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=> { if (event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close(); } }));
  const fs = $('fullscreen');
  if (!document.documentElement.requestFullscreen) fs.hidden=true;
  fs.addEventListener('click',async()=> {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch (_) { fs.textContent='全螢幕未開啟'; }
  });
  document.addEventListener('fullscreenchange',()=>{fs.textContent=document.fullscreenElement?'離開全螢幕':'全螢幕';});
  document.addEventListener('keydown',event=> {
    if (event.altKey||event.ctrlKey||event.metaKey||event.repeat||document.querySelector('dialog[open]')) return;
    if (event.target.closest('a,input,textarea,select')) return;
    if (event.key === 'ArrowLeft' && state.phase !== 'cover') { event.preventDefault(); back(); }
    else if (event.key === 'ArrowRight') { event.preventDefault(); screen.querySelector('[data-primary]')?.click(); }
    else if (event.key === 'Enter' && !event.target.closest('button')) { event.preventDefault(); screen.querySelector('[data-primary]')?.click(); }
    else if (state.phase === 'question' && /^[abc]$/i.test(event.key)) { event.preventDefault(); choose(event.key.toUpperCase().charCodeAt(0)-65); }
  });
  render();
})();
