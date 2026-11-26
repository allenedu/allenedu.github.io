/* Progressive enhancements: every word and chapter remains usable without JS. */
const normalize = value => value.normalize('NFKC').toLocaleLowerCase().trim();

const glossary = document.querySelector('[data-glossary-search]');
if (glossary) {
  const input = glossary.querySelector('input');
  const clear = glossary.querySelector('[data-clear-glossary]');
  const count = glossary.querySelector('[data-glossary-count]');
  const empty = document.querySelector('[data-glossary-empty]');
  const rows = Array.from(document.querySelectorAll('[data-glossary-row]'), row => ({row, text: normalize(row.textContent)}));
  const filter = () => {
    const terms = normalize(input.value).split(/\s+/).filter(Boolean);
    let matches = 0;
    rows.forEach(({row, text}) => {
      row.hidden = !terms.every(term => text.includes(term));
      if (!row.hidden) matches++;
    });
    count.textContent = `显示 ${matches} / ${rows.length} 个词条`;
    clear.hidden = !input.value;
    empty.hidden = matches !== 0;
  };
  input.addEventListener('input', filter);
  clear.addEventListener('click', () => { input.value = ''; filter(); input.focus(); });
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') { input.value = ''; filter(); }
  });
  glossary.hidden = false;
  filter();
}

const readerNavigation = document.querySelector('[data-reader-navigation]');
if (readerNavigation && window.matchMedia('(max-width: 850px)').matches) readerNavigation.open = false;

document.querySelectorAll('[data-print-page]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', () => window.print());
});

const unitLinks = Array.from(document.querySelectorAll('[data-unit-link]'));
if (unitLinks.length && 'IntersectionObserver' in window) {
  const headings = unitLinks.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  const visible = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) visible.add(entry.target.id); else visible.delete(entry.target.id); });
    const active = headings.find(heading => visible.has(heading.id));
    if (!active) return;
    unitLinks.forEach(link => {
      if (link.hash === '#' + active.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, {rootMargin: '-115px 0px -55% 0px'});
  headings.forEach(heading => observer.observe(heading));
}
