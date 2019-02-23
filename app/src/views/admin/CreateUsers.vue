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
      <div class="ui negative message" v-if="error">
        <div class="header">{{ error }}</div>
      </div>
    </form>
  </div>
</template>
<script>
import store from "../../config/store";

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
    };
  },
  methods: {
    createAccounts() {
      this.$http
        .post(
          "authenticate/signup",
          {
            email: this.patientEmail,
            firstName: this.patientFirstName,
            lastName: this.patientLastName,
            type: "patient"
          },
          {
            headers: {
              Authorization: localStorage.getItem("token")
            }
          }
        )
        .then(() => {
          this.$http
            .post(
              "authenticate/signup",
              {
                email: this.parentEmail,
                firstName: this.parentFirstName,
                lastName: this.parentLastName,
                type: "parent"
              },
              {
                headers: {
                  Authorization: localStorage.getItem("token")
                }
              }
            )
            .then(() => {
              alert("account was successfully created");
            })
            .catch(err => {
              if (err && err.data && err.data.error) {
                this.error = err.data.error;
              } else {
                this.error =
                  "An unspecified error occurred when attempting to create the parent user account.";
              }
            });
        })
        .catch(err => {
          if (err && err.data && err.data.error) {
            this.error = err.data.error;
          } else {
            this.error =
              "An unspecified error occurred when attempting to create the patient user account.";
          }
        });
    }
  }
};
</script>
<style scoped>
</style>
