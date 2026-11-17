(() => {
  const app=globalThis.Komorebi;
  app.ui.shell();
  const render=app.pages[app.ui.page] || app.pages['404'];
  render();
})();
