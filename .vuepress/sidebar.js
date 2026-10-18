const fs = require('fs');
const path = require('path');
// const matter = require('gray-matter');

function getFiles(dir) {
  return fs.readdirSync(path.join(__dirname, '..', dir))
     .filter(file => file.endsWith('.md') && file !== 'README.md');
}

module.exports = () => {
  const sidebar = {};

  sidebar['/Handbuch/'] = [
    ['', 'Über das Handbuch'],
    {
      title: 'Einstieg',
      collapsable: false,
      children: [
        ['Grundlagen/Architektur', 'Architektur im Überblick'],
        ['Grundlagen/Erstes-Geraet', 'Das erste eigene Gerät'],
        ['Grundlagen/Programmablauf', 'Programmablauf'],
      ]
    },
    {
      title: 'Klassen und Templates',
      collapsable: true,
      children: [
        ['Klassen/Device', 'Geräteklassen'],
        ['Klassen/Channel', 'Kanäle'],
        ['Klassen/HAL', 'Hardwareabstraktion'],
        ['Klassen/Templates', 'Templates verstehen'],
      ]
    },
    {
      title: 'Batterie und Energie',
      collapsable: true,
      children: [
        ['Batterie/Grundlagen', 'Grundlagen'],
        ['Batterie/Messverfahren', 'Messverfahren'],
        ['Batterie/Schwellenwerte', 'Schwellenwerte'],
        ['Batterie/Energiesparen', 'Energiesparen'],
      ]
    },
    {
      title: 'Geräteentwicklung',
      collapsable: true,
      children: [
        ['Funk/', 'Funk, Nachrichten und Peers'],
        ['Register/', 'Register und Speicherung'],
        ['Sensoren/', 'Sensoren'],
        ['Aktoren/', 'Aktoren'],
      ]
    },
    ['Praxis/', 'Praxis und Lernbeispiele'],
    ['Referenz/', 'Quellen und Versionsstand'],
  ];

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

