class TdkLabPlayer extends HTMLElement {
  connectedCallback() {
    this.steps = JSON.parse(this.querySelector('script[type="application/json"]').textContent);
    this.verified = this.dataset.verified === 'true';
    this.pos = 0;
    this.timer = null;
    this.body = this.querySelector('.sb-term-body');
    this.status = this.querySelector('.sb-term-status');
    this.counter = this.querySelector('[data-pos]');
    this.total = this.querySelector('[data-total]');
    this.explain = document.querySelector('[data-step-explain]');
    this.files = document.querySelector('[data-step-files]');
    this.total.textContent = this.steps.length;
    this.querySelector('[data-js="step"]').addEventListener('click', () => { this.focus(); this.step(); });
    this.querySelector('[data-js="play-all"]').addEventListener('click', () => { this.focus(); this.play(); });
    this.querySelector('[data-js="reset"]').addEventListener('click', () => { this.focus(); this.reset(); });
    this.querySelector('[data-js="copy-command"]').addEventListener('click', (event) => this.copyCommand(event.currentTarget));
    this.addEventListener('keydown', (event) => {
      if (event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
      if (event.code === 'Space') { event.preventDefault(); this.step(); }
      else if (event.key.toLowerCase() === 'p') this.play();
      else if (event.key.toLowerCase() === 'r') this.reset();
    });
    this.tabIndex = 0;
    this.render();
  }
  connectedCallbackOnce() {}
  stop() { if (this.timer) clearInterval(this.timer); this.timer = null; }
  copyCommand(button) {
    const step = this.steps[Math.max(0, Math.min(this.pos - 1, this.steps.length - 1))];
    if (!step) return;
    navigator.clipboard.writeText(step.cmd).then(() => {
      button.textContent = 'Copied';
      setTimeout(() => { button.textContent = 'Copy command'; }, 1200);
    }).catch(() => {
      this.body.focus();
      button.textContent = 'Clipboard unavailable';
      setTimeout(() => { button.textContent = 'Copy command'; }, 1500);
    });
  }
  step() {
    this.stop();
    if (this.pos >= this.steps.length) return;
    this.pos++;
    this.render();
  }
  play() {
    this.stop();
    if (this.pos >= this.steps.length) this.pos = 0;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { this.pos = this.steps.length; this.render(); return; }
    this.status.dataset.state = 'playing';
    this.status.textContent = 'playing';
    this.timer = setInterval(() => {
      if (this.pos < this.steps.length) this.pos++;
      if (this.pos >= this.steps.length) this.stop();
      this.render();
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 560);
  }
  reset() { this.stop(); this.pos = 0; this.render(); }
  render() {
    const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
    this.body.innerHTML = this.steps.slice(0, this.pos).map((step) => {
      const output = step.out || 'Captured output pending. Copy the command and run it in your own terminal.';
      return `<span class="sb-prompt">$</span> <span class="sb-cmd">${esc(step.cmd)}</span>\n<span class="sb-out">${esc(output)}</span>\n`;
    }).join('') + '<span class="sb-prompt">$</span> <span class="sb-caret"></span>';
    this.counter.textContent = this.pos;
    this.body.scrollTop = this.body.scrollHeight;
    if (this.pos === 0) { this.status.textContent = 'idle'; this.status.dataset.state = 'idle'; }
    else if (this.timer) { this.status.textContent = 'playing'; this.status.dataset.state = 'playing'; }
    else if (this.verified && this.pos >= this.steps.length) { this.status.textContent = 'done'; this.status.dataset.state = 'done'; }
    else { this.status.textContent = 'capture pending'; this.status.dataset.state = 'pending'; }
    const current = this.steps[this.pos - 1];
    this.explain.textContent = current ? `${current.explain}${current.out ? '' : ' Verified terminal output is still pending; use Copy command to try it locally.'}` : 'Advance one step to see what happens.';
    this.files.replaceChildren(...(current?.files ?? []).map((file) => { const li = document.createElement('li'); li.textContent = file; return li; }));
    if (current && !current.out) { const li = document.createElement('li'); li.textContent = 'File delta pending verified capture'; li.dataset.pending = 'true'; this.files.append(li); }
    else if (current && !current.files.length) { const li = document.createElement('li'); li.textContent = 'No files written'; li.dataset.empty = 'true'; this.files.append(li); }
  }
}
customElements.define('tdk-lab-player', TdkLabPlayer);
