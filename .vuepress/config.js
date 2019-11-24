const nav = require('./nav');
const sidebar = require('./sidebar');

module.exports = {
  base: '/',
  title: 'AskSin++',
  themeConfig: {
    sidebar: sidebar(),
    nav,
    lastUpdated: 'Letztes Update',
    logo: '/logo.jpg',
    docsRepo: 'AskSinPP/asksinpp.de',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    algolia: {
      apiKey: 'acfa71c7299ab8e74e13a65ac8c2c9ac',
      indexName: 'asksinpp',
      debug: false
    }
  },
  serviceWorker: true,
  locales: {
    "/": {
      lang: "de-DE"
    }
  },
  markdown: {
    lineNumbers: true
  },
  plugins: [
    ['@vuepress/plugin-medium-zoom', { selector: '.content__default img' }],
    ['sitemap', {
      hostname: 'https://asksinpp.de',
      dateFormatter: lastUpdated => {
        // Convert de date str to Date obj
        let [date, time] = lastUpdated.split(',');
        date = date.split('.').reverse().join('-');
        return new Date(`${date} ${time}`);
      }
    }]
  ],
  head: [['script', {}, `
      var _paq = _paq || [];
      _paq.push(["disableCookies"]);
      (function() {
        _paq.push(['setTrackerUrl', '/t.php']);
        _paq.push(['setSiteId', '2']);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript'; g.async=true; g.defer=true; g.src='/t.js'; s.parentNode.insertBefore(g,s);
        
        function tl(ev) {
          var path = event.path || (event.composedPath && event.composedPath());
          if(!path) return;
          var target = path.find(function(el) { return el.tagName === 'A'; });
          if(!target) return;
          if(!target.href || target.href.startsWith(location.origin)) return;
          _paq.push(['trackLink', target.href, 'link']);
        }
        window.addEventListener('click', tl);
      })();
    `]]
};
