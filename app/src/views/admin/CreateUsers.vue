<template>
  <div>
    <h1>Create Users</h1>
    <form class="ui form" @submit.prevent="createAccounts">
      <h3 class="left aligned">Patient Information</h3>
      <div class="field">
        <input type="email" placeholder="Email" v-model="patientEmail" required>
      </div>
      <div class="two fields">
        <div class="field">
          <input type="text" placeholder="First Name" v-model="patientFirstName" required>
        </div>
        <div class="field">
          <input type="text" placeholder="Last Name" v-model="patientLastName" required>
        </div>
      </div>
      <h3>Parent Information</h3>
      <div class="field">
        <input type="email" placeholder="Email" v-model="parentEmail" required>
      </div>
      <div class="two fields">
        <div class="field">
          <input type="text" placeholder="First Name" v-model="parentFirstName" required>
        </div>
        <div class="field">
          <input type="text" placeholder="Last Name" v-model="parentLastName" required>
        </div>
      </div>
      <button class="ui button" type="submit">Submit</button>
    </form>
  </div>
</template>
<script>
export default {
  name: 'AdminCreateUsers',
  data: function() {
    return {
      patientEmail: "",
      patientFirstName:"",
      patientLastName:"",
      parentEmail: "",
      parentFirstName:"",
      parentLastName:"",
    }
  },
    methods: {
    createAccounts() {
      alert("printing accounts");
    },
  },
};
</script>
<style scoped>
</style>
