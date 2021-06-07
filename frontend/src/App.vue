<template>
  <v-app>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> | 
      <button v-if="!user">login</button>
      <button v-else  @click="logout">logout</button>
    </div>
    <router-view/>
</v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';


@Component({
  components: {

  },
})
export default class App extends Vue {
  
  mounted() {
    if( this.user === null) {
      this.$router.push( '/' )
    }
  }

  logout() {
    console.log("logout")
    this.$store.commit('logout')
  }

  
  public get user() {
    return this.$store.getters.user
  }
  
  
}
</script>

<style lang="scss">

</style>
