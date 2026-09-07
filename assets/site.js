/* ==================================================================
   Site behaviour: registration marks, menu overlay, scrollspy,
   publication filtering. Theme handling stays in theme.js.
   ================================================================== */
(function () {
  'use strict';

  /* ---- registration marks aligned to the 12-column content area ---- */
  var host = document.querySelector('.marks');
  var inner = document.querySelector('.inner');

  function drawMarks() {
    if (!host || !inner) return;
    host.innerHTML = '';
    if (window.innerWidth <= 820) return;
    var box = inner.getBoundingClientRect();
    var step = box.width / 12;
    var rows = Math.ceil(window.innerHeight / 104) + 1;
    var frag = document.createDocumentFragment();
    for (var c = 0; c <= 12; c++) {
      for (var r = 0; r <= rows; r++) {
        var b = document.createElement('b');
        b.style.left = (box.left + c * step) + 'px';
        b.style.top = (r * 104) + 'px';
        frag.appendChild(b);
      }
    }
    host.appendChild(frag);
  }
  drawMarks();
  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(drawMarks, 140);
  });

  /* ---- keep the current page visible in a scrolled top bar ---- */
  var sitenav = document.querySelector('.topbar .sitenav');
  var current = sitenav && sitenav.querySelector('a.on');
  if (sitenav && current && sitenav.scrollWidth > sitenav.clientWidth) {
    // set scrollLeft directly: scrollIntoView would also move the page vertically
    sitenav.scrollLeft = current.offsetLeft -
      (sitenav.clientWidth - current.offsetWidth) / 2;
  }

  /* ---- scrollspy for in-page spine nav ---- */
  var spyLinks = [].slice.call(document.querySelectorAll('.vnav a[href^="#"]'));
  if (spyLinks.length && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = '#' + e.target.id;
        spyLinks.forEach(function (a) {
          a.classList.toggle('on', a.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    spyLinks.forEach(function (a) {
      var el = document.querySelector(a.getAttribute('href'));
      if (el) obs.observe(el);
    });
  }

  /* ---- publication / project filtering (spine buttons + fallback chips) ---- */
  var items = [].slice.call(document.querySelectorAll('#pub-list > li, #proj-list > li'));
  if (items.length) {
    var controls = [].slice.call(document.querySelectorAll('[data-filter]'));
    var counter = document.querySelector('[data-pub-count]');
    var total = items.length;

    function apply(filter) {
      var shown = 0;
      items.forEach(function (li) {
        var hit = filter === 'all' || li.getAttribute('data-area') === filter;
        li.hidden = !hit;
        if (hit) shown++;
      });
      controls.forEach(function (c) {
        var on = c.getAttribute('data-filter') === filter;
        c.classList.toggle('on', on);
        c.classList.toggle('active', on);
      });
      if (counter) {
        counter.textContent = String(shown).padStart(2, '0') + ' of ' +
          String(total).padStart(2, '0');
      }
    }
    // a per-area count on each chip: unmistakably a filter, and useful
    document.querySelectorAll('.chips button[data-filter]').forEach(function (b) {
      var f = b.getAttribute('data-filter');
      var n = f === 'all' ? total : items.filter(function (li) {
        return li.getAttribute('data-area') === f;
      }).length;
      var tag = document.createElement('span');
      tag.className = 'ct';
      tag.textContent = String(n).padStart(2, '0');
      b.appendChild(tag);
    });

    controls.forEach(function (c) {
      c.addEventListener('click', function () {
        apply(c.getAttribute('data-filter'));
      });
    });
    apply('all');
  }
})();
