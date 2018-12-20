<template>
  <div
    class="theme-container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <Navbar
      v-if="shouldShowNavbar"
      @toggle-sidebar="toggleSidebar"
    />

    <div class="layout--projects">
      <h1>Projekte</h1>

      <h3>Filter</h3>
      <div class="tags">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-tag">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7" y2="7"></line>
        </svg>
        <span class="tag" v-for="tag in tags" :class="{ active: filterTags.includes(tag) }" @click="toggleTag(tag)">{{ tag }}</span>
      </div>

      <hr>

      <transition-group tag="div" class="projects" name="project">
        <div v-for="{title, path, thumb, tags, author, authorUrl, desc, url} in projects" :key="path">
          <a class="title" rel="noreferrer noopener" :href="url" target="_blank">{{ title }}</a>
          <div class="thumb">
            <div class="author">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <a rel="noreferrer noopener" :href="authorUrl" target="_blank">{{ author }}</a>
            </div>
            <a rel="noreferrer noopener" :href="url" target="_blank">
              <img :src="thumb" alt="" v-if="thumb">
            </a>
            <div class="tags">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-tag">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7" y2="7"></line>
              </svg>
              <span v-for="tag in tags" class="tag" @click="toggleTag(tag)" :class="{ active: filterTags.includes(tag) }">{{ tag }}</span>
            </div>
          </div>
          <div class="desc">{{ desc }}</div>
        </div>
        <p v-if="projects.length === 0" :key="'none found'">
          Keine Projekte gefunden :(
        </p>
      </transition-group>

      <p>
        <a href="./Projekt-hinzufuegen.html">→ Projekt hinzufügen</a>
      </p>
    </div>

  </div>
</template>

<script>
  import DefaultLayout from '../.vuepress/theme/Layout'

  export default {
    extends: DefaultLayout,

    data() {
      return {
        allProjects: [],
        filterTags: []
      }
    },

    computed: {
      tags() {
        const tagsSet = new Set();
        this.allProjects.forEach(p => p.tags.forEach(t => tagsSet.add(t)));
        return [...tagsSet];
      },
      projects() {
        return this.allProjects
          .filter(p => this.filterTags.every(tag => p.tags.includes(tag)));
      }
    },

    created() {
      this.allProjects = this.$site.pages
        .filter(page => page.frontmatter.isProject)
        .map(page => {
          let thumb = null;

          if (page.frontmatter.Thumb) {
            let base = page.path.replace('/Projekte', '.');
            if (base.endsWith('.html')) {
              base = base.split('/').slice(0, -1).join('/') + '/';
            }
            thumb = require('' + base + page.frontmatter.Thumb);
          }

          return {
            title: page.title,
            path: page.path,
            thumb,
            tags: page.frontmatter.Tags.split(',').map(t => t.trim()).filter(t => t.length > 0) || [],
            author: page.frontmatter.Author || [],
            authorUrl: page.frontmatter.AuthorUrl,
            desc: page.frontmatter.Desc || '',
            url: page.frontmatter.ProjectUrl,
          };
        });
    },

    mounted() {
      if (document.location && document.location.hash) {
        this.filterTags = document.location.hash.substr(1).split(',')
          .filter(tag => this.tags.includes(tag));
      }
    },

    methods: {
      toggleTag(tag) {
        if (this.filterTags.includes(tag)) {
          this.filterTags.splice(this.filterTags.indexOf(tag), 1);
        } else {
          this.filterTags.push(tag);
        }
        document.location.hash = this.filterTags.join(',');
      }
    }
  }
</script>

<style lang="stylus">
  .layout--projects
    max-width none
    margin-top 3rem
    padding 2rem 0.5rem 2rem 1.5rem

    .tags
      display flex
      flex-wrap wrap
      align-items flex-end
      user-select none
      svg
        vertical-align middle
        margin-right 0.3rem
    h3
      margin-bottom 0.5rem

    .tag
      font-weight bold
      cursor pointer
      background #8f8f8f
      color #eee
      padding 0 0.4rem
      margin-right 0.3rem
      margin-bottom 0.1rem
      border-radius 4px
      transition: all .1s ease-in-out

      &.active
        background #00bc00

    .projects
      position relative
      display flex
      flex-wrap wrap

      .project-move
        transition all 400ms ease-in-out 50ms

      .project-enter-active
        transition all 300ms ease-out

      .project-leave-active
        transition all 300ms ease-in
        position absolute
        z-index 0

      .project-enter, project-leave-to
        opacity 0

      .project-enter
        transform scale(0.9)

      > div
        position relative
        box-shadow 2px 2px 10px 0 rgba(0, 0, 0, 0.3)
        background #efefef
        margin-top 1rem;
        margin-right: 1rem;
        border 1px solid $borderColor
        width 320px
        backface-visibility hidden
        z-index 1
        transform-origin 10% 50%

        .title
          padding 0.5rem 0.5rem
          border-bottom 1px solid $borderColor
          font-weight bold
          text-align center
          display block
          color inherit
          transition: color .1s ease-in-out

          &:hover
            color $accentColor

        .desc
          padding 0.3rem .5rem

        .thumb
          font-size 0
          min-height 180px
          position relative
          border-bottom 1px solid $borderColor

          .author, .tags
            position absolute
            right 0
            top 0
            padding 0.2rem 0.3rem
            background rgba(#efefef, 0.8)
            display flex
            flex-wrap wrap

            svg
              height 20px
              margin-right 0.1rem

          .author
            border-bottom-left-radius 6px
            font-size 16px

          img
            width 100%
            height 180px
            object-fit cover

          .tags
            right 0
            top auto
            left auto
            bottom 0
            padding-top: 0.3rem
            border-top-left-radius 6px
            font-size 14px

            svg
              height 16px

  .dark
    .layout--projects
      .tag
        background #7a7a7a

        &.active
          background green

      .projects
        > div
          box-shadow 2px 2px 10px 0 rgba(255, 255, 255, 0.1)
          background $darkSecondaryBg
          border 1px solid $darkBorderColor

          .title
            border-bottom 1px solid $darkBorderColor

            &:hover
              color $accentColorDark

          .thumb
            border-bottom 1px solid $darkBorderColor

            .author, .tags
              background rgba(#2B2B2B, 0.8)

              svg
                height 20px
                margin-right 0.1rem
</style>