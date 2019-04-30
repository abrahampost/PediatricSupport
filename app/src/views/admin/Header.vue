<template>
  <div class="header">
    <div class="ui top borderless stackable menu">
      <div class="header item">UNC Pediatric Support Admin Page</div>
      <router-link class="right aligned item" :to="{name:'admin'}">Create Accounts</router-link>
      <router-link class="item" :to="{name:'adminManageReports'}">Manage Reports</router-link>
      <router-link class="item" :to="{name:'adminManageAttributes', params: {type:'interest'}}">Manage Interests</router-link>
      <router-link class="item" :to="{name:'adminManageAttributes', params: {type:'diagnosis'}}">Manage Diagnoses</router-link>
      <router-link class="item" :to="{name:'login'}">Logout</router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AdminHeader',
};
</script>
<style scoped>
</style>
