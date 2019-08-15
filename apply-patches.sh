#!/usr/bin/env sh

if ! grep -qF lastUpdatedTstamp node_modules/@vuepress/plugin-last-updated/index.js; then
  patch --batch node_modules/@vuepress/plugin-last-updated/index.js last-updated.patch
else
  echo last-updated.patch already applied
fi

if ! grep -qF lastUpdatedTstamp node_modules/vuepress-plugin-sitemap/index.js; then
  patch --batch node_modules/vuepress-plugin-sitemap/index.js sitemap.patch
else
  echo sitemap.path already applied
fi
