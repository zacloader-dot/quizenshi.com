// Quizenshi website: the world picker relights the page, and a few real questions from the game can be answered.
// Nothing is stored and nothing is sent anywhere.
(function () {
  'use strict';

  var root = document.documentElement;
  var buttons = document.querySelectorAll('.world-btn');
  var caption = document.querySelector('[data-world-caption]');
  var worlds = {
    'shadow-academy': { name: 'Shadow Academy', line: 'Gothic halls where knowledge is a weapon', hero: 'Kael' },
    'neon-rebellion': { name: 'Neon Rebellion', line: 'A wired city that runs on fast answers', hero: 'Rin' },
    'spirit-kingdom': { name: 'Spirit Kingdom', line: 'A blood-moon realm of old oaths', hero: 'Akane' }
  };

  function pick(id) {
    if (!worlds[id]) return;
    root.setAttribute('data-world', id);
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-for') === id)); });
    if (caption) {
      caption.querySelector('strong').textContent = worlds[id].name;
      caption.querySelector('span').textContent = worlds[id].line + '. Hero: ' + worlds[id].hero + '.';
    }
  }
  buttons.forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-for')); }); });

  // Three questions from the game's checked bank (ani-0001, sci-0001, geo-0001), word for word.
  var questions = [
    { text: 'What is a baby kangaroo called?', options: ['Joey', 'Cub', 'Kit', 'Pup'], correct: 0,
      fact: "A newborn kangaroo is about the size of a jellybean and climbs straight into its mother's pouch." },
    { text: 'Which planet is closest to the Sun?', options: ['Venus', 'Mercury', 'Mars', 'Earth'], correct: 1,
      fact: 'One full day-night cycle on Mercury lasts 176 Earth days.' },
    { text: 'What is the capital city of Japan?', options: ['Tokyo', 'Kyoto', 'Osaka', 'Nagoya'], correct: 0,
      fact: 'Before 1868, Tokyo was known by a different name: Edo.' }
  ];
  var demo = document.querySelector('[data-demo]');
  if (!demo) return;
  var qEl = demo.querySelector('.demo-q');
  var list = demo.querySelector('.answers');
  var feedback = demo.querySelector('.feedback');
  var next = demo.querySelector('.next');
  var tick = '<svg class="mark mark-tick" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10.5l4.5 4.5L17 5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"/></svg>';
  var crack = '<svg class="mark mark-crack" viewBox="0 0 20 20" aria-hidden="true"><path d="M11 1l-4 7 5 3-5 8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="bevel"/></svg>';
  var index = 0;

  function show(i) {
    var q = questions[i];
    qEl.textContent = q.text;
    list.innerHTML = '';
    feedback.innerHTML = '';
    next.hidden = true;
    q.options.forEach(function (option, n) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'answer';
      b.innerHTML = '<span>' + tick + crack + '<span class="label"></span></span>';
      b.querySelector('.label').textContent = option;
      b.addEventListener('click', function () { answer(n); });
      li.appendChild(b);
      list.appendChild(li);
    });
  }

  function answer(n) {
    var q = questions[index];
    var all = list.querySelectorAll('.answer');
    all.forEach(function (b) { b.disabled = true; });
    var right = n === q.correct;
    all[n].classList.add(right ? 'is-right' : 'is-wrong');
    if (!right) all[q.correct].classList.add('is-answer');
    feedback.innerHTML = right
      ? '<strong class="verdict-right">Right.</strong> '
      : '<strong class="verdict-wrong">Not quite.</strong> The answer is <strong></strong>. ';
    if (!right) feedback.querySelectorAll('strong')[1].textContent = q.options[q.correct];
    feedback.appendChild(document.createTextNode(q.fact));
    next.hidden = false;
  }

  next.addEventListener('click', function () {
    index = (index + 1) % questions.length;
    show(index);
    var first = list.querySelector('.answer');
    if (first) first.focus();
  });

  show(index);
})();
