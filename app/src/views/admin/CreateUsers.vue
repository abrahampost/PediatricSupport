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
      <div class="ui positive message" v-if="successfullyCreated">
        <div class="header">The accounts were successfully created!</div>
      </div>
      <div class="ui negative message" v-if="error">
        <div class="header">{{ error }}</div>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  name: "AdminCreateUsers",
  data: function() {
    return {
      patientEmail: "",
      patientFirstName: "",
      patientLastName: "",
      parentEmail: "",
      parentFirstName: "",
      parentLastName: "",
      error: "",
      successfullyCreated: false
    };
  },
  methods: {
    createAccounts() {
      this.successfullyCreated= false;

      this.$http
        .post("users/", {
          patientEmail: this.patientEmail,
          patientFirstName: this.patientFirstName,
          patientLastName: this.patientLastName,
          parentEmail: this.parentEmail,
          parentFirstName: this.parentFirstName,
          parentLastName: this.parentLastName
        })
        .then(() => {
          this.successfullyCreated = true;
          this.clearFields();
        })
        .catch(err => {
          if (err && err.data && err.data.error) {
            this.error = err.data.error;
          } else {
            this.error =
              "An unspecified error occurred when attempting to create the patient user account.";
          }
        });
    },
    clearFields() {
      this.patientEmail = "";
      this.patientFirstName = "";
      this.patientLastName = "";
      this.parentEmail = "";
      this.parentFirstName = "";
      this.parentLastName = "";
    }
  }
};
</script>
<style scoped>
</style>
