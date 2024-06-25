<template>
  <div id="app">
    <component :is="isAuthenticated ? 'on-navbar' : 'off-navbar'"></component>
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import OnNavbar from './components/navbar/onNavbar.vue';
import OffNavbar from './components/navbar/offNavbar.vue';

export default {
  name: 'App',
  provide(){
    return{
      reload: this.reload 
    }
  },
  components: {
    OnNavbar,
    OffNavbar,
  },
  data() {
    return {
      isRouterAlive:true,
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    reload(){
        this.isRouterAlive = false
        this.$nextTick(() => {
          this.isRouterAlive = true
          console.log("刷新")
        })
     },
  },
};
</script>
