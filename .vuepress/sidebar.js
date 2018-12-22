const fs = require('fs');
const path = require('path');
// const matter = require('gray-matter');

function getFiles(dir) {
  return fs.readdirSync(path.join(__dirname, '..', dir))
     .filter(file => file.endsWith('.md') && file !== 'README.md');
}

module.exports = () => {
  const sidebar = {};

  sidebar['/Grundlagen/'] =[
    {
      title: 'Grundlagen',
      collapsable: false,
      children: [
        ['', 'Einführung'],
        ...getFiles('Grundlagen')
      ]
    },
    {
      title: 'FAQ',
      collapsable: false,
      children: [
        ...getFiles('Grundlagen/FAQ').map(file => `FAQ/${file}`)
      ]
    },
    {
      title: 'Material',
      collapsable: false,
      children: [
        ['/Projekte/', 'Projekte'],
        ['/Sketche/', 'Sketche'],
        ['/Platinen/', 'Platinen'],
        ['/Gehaeuse/', 'Gehäuse'],
        ['/Projekte/Umbau.html', 'Umbauten'],
      ]
    },
  ];

  return sidebar;
};

