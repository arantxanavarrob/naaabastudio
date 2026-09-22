const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }), { threshold: .12 });
reveals.forEach(el => io.observe(el));
const hero = document.querySelector('.hero-logo');
addEventListener('scroll', () => { if (hero) { const y = scrollY; hero.style.transform = `translateY(${y * .16}px) scale(${1 + y * .00015}) scaleY(1.08)`; hero.style.opacity = Math.max(.12, 1 - y / 900) } });
const nav = document.querySelector('.nav'), btn = document.querySelector('.menu-btn');
btn?.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.navlinks a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));


// Scroll typing: selected headlines are "typed" as you move down and
// erased again when you move back up. Hidden letters keep their space,
// so the layout never jumps while the effect runs.
const scrollTypeEls = document.querySelectorAll('.scroll-type');
scrollTypeEls.forEach(el => {
  const nodes = [...el.childNodes];
  el.innerHTML = '';
  let index = 0;
  nodes.forEach(node => {
    if (node.nodeName === 'BR') {
      el.appendChild(document.createElement('br'));
      return;
    }
    [...node.textContent].forEach(char => {
      const span = document.createElement('span');
      span.className = 'type-char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.dataset.charIndex = index++;
      el.appendChild(span);
    });
  });
  el.dataset.charCount = index;
});

let typeTicking = false;
function updateScrollType() {
  const vh = window.innerHeight;
  scrollTypeEls.forEach(el => {
    const r = el.getBoundingClientRect();
    // Starts typing near the bottom of the viewport and finishes around
    // the upper-middle. Reverses naturally when scrolling upward.
    const start = vh * .90;
    const end = vh * .34;
    const progress = Math.max(0, Math.min(1, (start - r.top) / (start - end)));
    const count = Number(el.dataset.charCount || 0);
    const visible = Math.round(progress * count);
    el.querySelectorAll('.type-char').forEach((ch, i) => {
      ch.classList.toggle('typed', i < visible);
    });
  });
  typeTicking = false;
}
function requestTypeUpdate() {
  if (!typeTicking) { typeTicking = true; requestAnimationFrame(updateScrollType); }
}
addEventListener('scroll', requestTypeUpdate, { passive: true });
addEventListener('resize', requestTypeUpdate);
updateScrollType();

// Interactive buttons + navigation: magnetic pull, animated fill and playful labels.
const hoverTargets = document.querySelectorAll('.pill, .submit, .navlinks a, .menu-btn');
hoverTargets.forEach(el => {
  el.classList.add('magnetic');
  const txt = el.textContent.trim();
  if ((el.matches('.pill,.submit')) && !el.querySelector('.interactive-arrow')) {
    // Keep existing wording but give CTAs a small moving arrow.
    const arrow = document.createElement('span');
    arrow.className = 'interactive-arrow';
    arrow.textContent = '↗';
    el.appendChild(arrow);
  }
  el.addEventListener('mousemove', e => {
    if (matchMedia('(pointer:coarse)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * .16;
    const y = (e.clientY - (r.top + r.height / 2)) * .22;
    el.style.transform = `translate(${x}px,${y}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

// Minimal custom cursor that expands over clickable NAAABA elements.
if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);
  let mx = -50, my = -50, cx = -50, cy = -50;
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  const follow = () => { cx += (mx - cx) * .18; cy += (my - cy) * .18; dot.style.transform = `translate(${cx - 5}px,${cy - 5}px)`; requestAnimationFrame(follow) };
  follow();
  document.querySelectorAll('a,button,.service-row,.project').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => dot.classList.remove('is-hovering'));
  });
}


// V8 — VISIT SITE badge follows the pointer inside external project cards.
document.querySelectorAll('.project-link').forEach(project => {
  const media = project.querySelector('.project-media');
  const badge = project.querySelector('.project-visit');
  if (!media || !badge) return;
  media.addEventListener('mousemove', e => {
    if (matchMedia('(pointer:coarse)').matches) return;
    const r = media.getBoundingClientRect();
    badge.style.left = `${e.clientX - r.left}px`;
    badge.style.top = `${e.clientY - r.top}px`;
  });
});

// V16 — On touch/mobile, typography stays complete instead of ending mid-word.
if (matchMedia('(max-width:760px), (pointer:coarse)').matches) {
  document.querySelectorAll('.scroll-type .type-char').forEach(ch => ch.classList.add('typed'));
}
