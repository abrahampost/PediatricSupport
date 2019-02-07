<template>
  <div class="login">
    <div class="ui card padded">
      <form class="ui form" @submit.prevent="login">
        <h1 class="ui subheader">Login</h1>
        <div class="field">
          <label>Username</label>
          <input type="text"
                v-model="username"
                name="username" 
                placeholder="Username"
                autocomplete="username"
                @change="error=''">
        </div>
        <div class="field">
          <label>Password</label>
          <input type="password" 
                v-model="password"
                name="password" 
                placeholder="Password"
                autocomplete="current-password"
                @change="error=''">
        </div>
        <button class="ui button" type="submit">Submit</button>
        <div class="ui negative message" v-if="error">
          <div class="header">
            {{ error }}
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '../config/axiosInstance';

export default {
  name: 'Login',
  data: function () {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    login: function() {
      axios.post('authenticate/login', {
        username: this.username, password: this.password
      }).then(res => {
        console.log(res)
      }).catch(err => {
        this.error = err.data.error;
      });
    }
  }
};
</script>
<style scoped>
  .login {
    height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .padded {
    padding: 5%;
  }
</style>
