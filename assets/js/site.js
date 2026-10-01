document.addEventListener('click', (event) => {
  const copy = event.target.closest('[data-copy-value]');
  if (copy) navigator.clipboard.writeText(copy.dataset.copyValue).then(() => { copy.textContent = 'Copied'; setTimeout(() => { copy.textContent = 'Copy'; }, 1200); });
  const filter = event.target.closest('[data-filter]');
  if (filter) {
    document.querySelectorAll('[data-filter]').forEach((button) => button.setAttribute('aria-pressed', String(button === filter)));
    document.querySelectorAll('[data-classification]').forEach((card) => { card.hidden = filter.dataset.filter !== 'All' && card.dataset.classification !== filter.dataset.filter; });
  }
  const fill = event.target.closest('[data-fill-command]');
  if (fill) {
    const input = document.querySelector('#local-command');
    if (input) { input.value = fill.dataset.fillCommand; input.focus(); }
  }
  const copyCommand = event.target.closest('[data-copy-command]');
  if (copyCommand) {
    const input = document.querySelector('#local-command');
    if (input) navigator.clipboard.writeText(input.value).then(() => {
      copyCommand.textContent = 'Copied';
      setTimeout(() => { copyCommand.textContent = 'Copy command'; }, 1200);
    });
  }
  const showOutput = event.target.closest('[data-show-output]');
  if (showOutput) {
    const output = document.querySelector('#local-output');
    const result = document.querySelector('[data-command-result]');
    if (output && result) result.textContent = output.value.trim() || 'No output pasted yet.';
  }
});
