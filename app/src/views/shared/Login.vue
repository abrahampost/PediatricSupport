<template>
  <div class="login">
    <div class="ui card padded">
      <form class="ui form" @submit.prevent="login">
        <h1 class="ui subheader">Login</h1>
        <div class="field">
          <label>Username</label>
          <input
            type="text"
            v-model="username"
            name="username"
            placeholder="Username"
            autocomplete="username"
            required
          >
        </div>
        <div class="field">
          <label>Password</label>
          <input
            type="password"
            v-model="password"
            name="password"
            placeholder="Password"
            autocomplete="current-password"
            required
          >
        </div>
        <button class="ui button" type="submit">Submit</button>
        <div class="ui negative message" v-if="error">
          <div class="header">{{ error }}</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: '',
    };
  },
  methods: {
    login() {
      console.log(this);
      this.$http
        .post('authenticate/login', {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          this.error = '';
          console.log(res);
        })
        .catch((err) => {
          if (err && err.data && err.data.error) {
            this.error = err.data.error;
          } else {
            this.error = 'An unspecified error occured during the login attempt.';
          }
        });
    },
  },
};
</script>
<style scoped>
.login {
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ui.card.padded {
  padding: 5%;
  min-width: 40%;
}
</style>
