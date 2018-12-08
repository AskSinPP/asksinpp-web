<template>
  <div class="home">
    <div class="hero">
      <h1>AskSinPP Collection</h1>

      <p class="description">
        Selbstbau-Komponenten für HomeMatic mit AskSinPP
      </p>

      <p class="action">
        <NavLink
          class="action-button"
          :item="{text: 'Und los →', link: '/Grundlagen/'}"
        />
      </p>
    </div>

    <div class="features">
      <div class="feature">
        <h2>Hardware</h2>
        <p>Arduino Pro Mini, STM32 und kompatible Microcontroller mit CC1101 868Mhz Funkmodul als Hardwarebasis.</p>
        <div>
          <img src="platine.jpg" alt="">
        </div>
      </div>
      <div class="feature">
        <h2>Software</h2>
        <p>Homematic kompatible AskSinPP Implementierung. Viele Sketche für Aktoren und Sensoren.</p>
        <div>
          <img src="asksinpp.jpg" alt="">
        </div>
      </div>
      <div class="feature">
        <h2>Community</h2>
        <p>Projekte, Platinen und Gehäuse von der Homematic Community zum Aufbau der Komponenten.</p>
        <div>
          <img src="3d-druck.jpg" alt="">
        </div>
      </div>
    </div>

    <div class="footer" style="text-align: left">
      <img src="https://hits.dwyl.com/jp112sdl/AskSinPPCollection.svg" style="float:right; margin-left: 10px; margin-bottom: 10px;"/>
      Diese Seite lebt von euren Zuarbeiten!<br/>
      Wer sich hier vermisst, oder noch was gefunden hat, das fehlt - immer her damit. Entweder per
      <NavLink :item="{text: 'Pull request', link: 'https://github.com/jp112sdl/AskSinPPCollection/pulls'}"/>
      oder
      <NavLink :item="{text: 'Issue', link: 'https://github.com/jp112sdl/AskSinPPCollection/issues'}" />.
    </div>
  </div>
</template>

<script>
import NavLink from '@vuepress/theme-default/components/NavLink.vue'

export default {
  components: { NavLink },

  computed: {
    data () {
      return this.$page.frontmatter
    },
  },

  created() {
    this.$vuepress.$emit('AsyncMarkdownContentMounted');
  }

}
</script>

<style lang="stylus">
.home
  padding $navbarHeight 2rem 0
  max-width 960px
  margin 0px auto
  .hero
    text-align center
    img
      max-width: 100%
      max-height 280px
      display block
      margin 3rem auto 1.5rem
    h1
      font-size 3rem
    h1, .description, .action
      margin 1.8rem auto
    .description
      max-width 35rem
      font-size 1.6rem
      line-height 1.3
      color lighten($textColor, 40%)
    .action-button
      display inline-block
      font-size 1.2rem
      color #fff
      background-color $accentColor
      padding 0.8rem 1.6rem
      border-radius 4px
      transition background-color .1s ease
      box-sizing border-box
      border-bottom 1px solid darken($accentColor, 10%)
      &:hover
        background-color lighten($accentColor, 10%)
  .features
    border-top 1px solid $borderColor
    padding 1.2rem 0
    margin-top 2.5rem
    display flex
    flex-wrap wrap
    align-items flex-start
    align-content stretch
    justify-content space-between
  .feature
    flex-grow 1
    flex-basis 30%
    max-width 30%
    h2
      font-size 1.4rem
      font-weight 500
      border-bottom none
      padding-bottom 0
      color lighten($textColor, 10%)
    p
      color lighten($textColor, 25%)
    img
      max-width 100%
  .footer
    padding 2.5rem
    border-top 1px solid $borderColor
    text-align center
    color lighten($textColor, 25%)

@media (max-width: $MQMobile)
  .home
    .features
      flex-direction column
    .feature
      max-width 100%
      padding 0 2.5rem

@media (max-width: $MQMobileNarrow)
  .home
    padding-left 1.5rem
    padding-right 1.5rem
    .hero
      img
        max-height 210px
        margin 2rem auto 1.2rem
      h1
        font-size 2rem
      h1, .description, .action
        margin 1.2rem auto
      .description
        font-size 1.2rem
      .action-button
        font-size 1rem
        padding 0.6rem 1.2rem
    .feature
      h2
        font-size 1.25rem
</style>
