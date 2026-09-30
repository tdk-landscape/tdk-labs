document.addEventListener('click', (event) => {
  const copy = event.target.closest('[data-copy-value]');
  if (copy) navigator.clipboard.writeText(copy.dataset.copyValue).then(() => { copy.textContent = 'Copied'; setTimeout(() => { copy.textContent = 'Copy'; }, 1200); });
  const filter = event.target.closest('[data-filter]');
  if (filter) {
    document.querySelectorAll('[data-filter]').forEach((button) => button.setAttribute('aria-pressed', String(button === filter)));
    document.querySelectorAll('[data-classification]').forEach((card) => { card.hidden = filter.dataset.filter !== 'All' && card.dataset.classification !== filter.dataset.filter; });
  }
});
