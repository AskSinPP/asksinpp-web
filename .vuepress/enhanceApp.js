import pageComponents from '@internal/page-components'

import { Tabs, Tab } from 'vue-slim-tabs';

export default ({ Vue, options, router, siteData }) => {
  router.afterEach((to, from) => {
    if(typeof _paq === 'undefined' || !_paq.push) return;
    if(to.path === from.path) return; // no hash changes
    _paq.push(['setDocumentTitle', document.title.replace(' | AskSin++', '')]);
    _paq.push(['trackPageView']);
  });

  Vue.component('tabs', Tabs);
  Vue.component('tab', Tab);

  // https://github.com/vuejs/vuepress/issues/1173
  for (const [name, component] of Object.entries(pageComponents)) {
    Vue.component(name, component)
  }
}
