const fs = require('fs');
const path = require('path');
// const matter = require('gray-matter');

function getFiles(dir) {
  return fs.readdirSync(path.join(__dirname, '..', dir))
     .filter(file => file.endsWith('.md') && file !== 'README.md');
}

module.exports = () => {
  const sidebar = {};

  sidebar['/Grundlagen/'] = [
    {
      title: 'Grundlagen',
      collapsable: true,
      children: [
        ['', 'Einführung'],
        ...getFiles('Grundlagen')
      ]
    },
    {
      title: 'FAQ',
      collapsable: true,
      children: [
        ...getFiles('Grundlagen/FAQ').map(file => `FAQ/${file}`)
      ]
    },
    {
      title: 'STM32',
      collapsable: true,
      children: [
        ['STM32/', 'Einführung'],
        ...getFiles('Grundlagen/STM32').map(file => `STM32/${ file }`)
      ]
    },
    {
      title: 'Material',
      collapsable: true,
      children: [
        ['/Projekte/', 'Projekte'],
        ['/Sketche/', 'Sketche'],
        ['/Platinen/', 'Platinen'],
        ['/Gehaeuse/', 'Gehäuse'],
        ['/Projekte/Umbau.html', 'Umbauten'],
        ['/rftypes/', 'RF-Types'],
      ]
    },
  ];

  sidebar['/rftypes/'] = [
    ['', 'RF-Types'],
    ['HomeBrew', 'HomeBrew Types'],
  ];

  sidebar['/Projekte/psi/HMSensor/'] = [
    ['', 'HMSensor'],
    ...getFiles('Projekte/psi/HMSensor')
  ];

  return sidebar;
};

