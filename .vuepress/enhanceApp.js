export default ({ Vue, options, router, siteData }) => {
  router.afterEach((to, from) => {
    if(typeof _paq === 'undefined' || !_paq.push) return;
    if(to.path === from.path) return; // no hash changes
    _paq.push(['setDocumentTitle', document.title.replace(' | AskSin++', '')]);
    _paq.push(['trackPageView']);
  });
}