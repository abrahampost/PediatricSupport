<template>
  <div class="header">
    <div class="ui top borderless stackable menu">
      <div class="header item">UNC Pediatric Support Patient Page</div>
      <router-link class="right aligned item" :to="{name:'patient'}">Matches</router-link>
      <router-link class="item" :to="{name:'patientMatches'}">Messages</router-link>
      <router-link class="item" :to="{name:'patientPreferences'}">Preferences</router-link>
      <router-link class="item" :to="{name:'login'}">Logout</router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PatientHeader',
};
</script>
<style scoped>
</style>
