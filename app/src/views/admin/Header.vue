<template>
  <div class="header">
    <div class="ui container">
      <h1 class="ui header left aligned">UNC Pediatric Support Admin Page</h1>
    </div>
    <div class="ui four item menu">
      <router-link class="item" :to="{name:'admin'}">Create Accounts</router-link>
      <router-link class="item" :to="{name:'adminManageUsers'}">Manage Accounts</router-link>
      <router-link class="item" :to="{name:'adminManageReports'}">Manage Reports</router-link>
      <router-link class="item" :to="{name:'adminManageAttributes'}">Manage Attributes</router-link>
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
