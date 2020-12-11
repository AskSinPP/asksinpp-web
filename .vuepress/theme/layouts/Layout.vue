<template>
  <div>
    <ParentLayout>
      <template #page-bottom>

      </template>
    </ParentLayout>
  </div>
</template>

<script>
/*
        <div class="utterances">
          <component
            v-if="UtterancesCommentsComponent"
            :is="UtterancesCommentsComponent"
            :title="$page.title"
            :pathname="$page.relativePath"
            repo="AskSinPP/asksinpp.de"
            label="comment"
            :theme="utterancesTheme"
            description="Dieses Issue enthält die Kommentare der Seite:"
          />
          <a href="/Other/Kommentare.html">Infos zur Kommentarfunktion</a>
        </div>
*/

  // use when slots are fixed
  // import ParentLayout from '@parent-theme/layouts/Layout.vue';
  import ParentLayout from './OriginTheme.vue';

  export default {
    components: {
      ParentLayout,
    },

    data() {
      return {
        isDark: false,
        // UtterancesCommentsComponent: null,
      }
    },

    mounted() {
      this.isDark = window.localStorage.getItem('vuepress-isDark') || false;
      // Component is not SSR friendly
      // import('@theme/components/UtterancesComments.vue')
      //   .then(module => this.UtterancesCommentsComponent = module.default);
    },

    computed: {
      // utterancesTheme() {
      //   return this.isDark ? 'dark-blue' : 'github-light';
      // },
    },

    created() {
      this.$root.$on('dark-mode', (isDark) => this.isDark = isDark);
    }
  }
</script>
