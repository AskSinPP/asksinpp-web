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
