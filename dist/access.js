// Static visitor gate only; this does not secure the public repository or assets.
(() => {
  const form = document.getElementById('accessForm');
  const input = document.getElementById('accessPassword');
  const error = document.getElementById('accessError');
  const submit = document.getElementById('accessSubmit');
  const loadScript = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error('load failed'));
    document.head.append(script);
  });
  let busy = false;
  input.addEventListener('input', () => {
    input.removeAttribute('aria-invalid');
    error.textContent = '';
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    if (input.value !== '123456') {
      error.textContent = '密码不正确，请重新输入。';
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      input.select();
      return;
    }
    busy = true;
    submit.disabled = true;
    submit.textContent = '正在打开…';
    error.textContent = '';
    let content;
    try {
      await loadScript('catalog.js');
      content = document.createElement('div');
      content.hidden = true;
      content.append(document.getElementById('catalogContent').content.cloneNode(true));
      document.body.append(content);
      await loadScript('app.js');
      input.value = '';
      document.getElementById('accessGate').remove();
      document.getElementById('catalogContent').remove();
      content.hidden = false;
      const heading = content.querySelector('h1');
      heading.tabIndex = -1;
      heading.focus();
    } catch {
      content?.remove();
      error.textContent = '目录加载失败，请检查网络后刷新重试。';
      submit.textContent = '请刷新后重试';
    }
  });
})();
