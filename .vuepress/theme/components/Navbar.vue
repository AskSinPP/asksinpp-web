<template>
  <header class="navbar">
    <SidebarButton @toggle-sidebar="$emit('toggle-sidebar')"/>

    <router-link
        :to="$localePath"
        class="home-link"
    >
      <img
          class="logo"
          v-if="$site.themeConfig.logo"
          :src="$withBase($site.themeConfig.logo)"
          :alt="$siteTitle"
      >
      <span
          ref="siteName"
          class="site-name"
          v-if="$siteTitle"
          :class="{ 'can-hide': $site.themeConfig.logo }"
      >{{ $siteTitle }}</span>
    </router-link>

    <div
        class="links"
        :style="{
        'max-width': linksWrapMaxWidth + 'px'
      }"
    >
      <AlgoliaSearchBox
          v-if="isAlgoliaSearch"
          :options="algolia"
      />
      <SearchBox v-else-if="$site.themeConfig.search !== false"/>
      <NavLinks class="can-hide"/>
      <ThemeToggler/>
    </div>
  </header>
</template>

<script>
  import DefaultNavbar from '@vuepress/theme-default/components/Navbar';
  import ThemeToggler from './ThemeToggler';

  export default {
    extends: DefaultNavbar,
    components: { ThemeToggler }
  }
</script>