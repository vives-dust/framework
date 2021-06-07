<template>
  <div class="loginform">
      <div class="message" v-show="message">
        {{ message }}
      </div>
      <input type="text" name="username" v-model="email" placeholder="username"><br>
      <input type="password" name="password" v-model="password" placeholder="password"><br>
      <button @click="login">Login</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';

@Component({
  components: {

  },
})
export default class LoginForm extends Vue {

  email = 'test@test.be';
  password = 'secret';
  
  message?: string = '';

  login() {
    axios.post('http://localhost:3030/authentication',
        {
          strategy: "local",
          email: this.email,
          password: this.password
        }
    ).then( response => {
      console.log(response.data)
      this.$store.commit('authenticate', response.data)
    })
    .catch( error => {
      console.log(error)
      this.message = error.message
    })
  }
  
}
</script>
