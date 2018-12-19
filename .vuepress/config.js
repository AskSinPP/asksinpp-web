const nav = require('./nav');
const sidebar = require('./sidebar');

module.exports = {
  base: '/AskSinPPCollection/',
  title: 'AskSinPPCollection',
  themeConfig: {
    sidebar: sidebar(),
    nav,
    lastUpdated: 'Letztes Update',
    logo: '/logo.jpg',
    docsRepo: 'jp112sdl/AskSinPPCollection',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub'
  },
  locales: {
    "/": {
      lang: "de-DE"
    }
  },
  markdown: {
    lineNumbers: true
  },
  plugins: [
    '@vuepress/plugin-medium-zoom'
  ]
};
