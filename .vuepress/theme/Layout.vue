<script>
  import DefaultLayout from '@vuepress/theme-default/layouts/Layout';
  import Navbar from './components/Navbar';
  import Home from './components/Home'

  export default {
    extends: DefaultLayout,
    components: { Home, Navbar },
  }
</script>