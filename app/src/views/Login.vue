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
                autocomplete="username">
        </div>
        <div class="field">
          <label>Password</label>
          <input type="password" 
                v-model="password"
                name="password" 
                placeholder="Password"
                autocomplete="current-password">
        </div>
        <button class="ui button" type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data: function () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login: function() {
      console.log(this.username, btoa(this.password));
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
