
(function () {
  const formEl = document.querySelector('.input-wrapper');

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const val = formEl.querySelector('input').value;

    if (val.trim()) {
      window.open(`/${val.trim()}/rss`);
    }
  }, false);
}());
