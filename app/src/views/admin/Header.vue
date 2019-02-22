<template>
  <div class="header">
    <div class="ui top borderless stackable menu">
      <div class="header item">UNC Pediatric Support Admin Page</div>
      <router-link class="right aligned item" :to="{name:'admin'}">Create Accounts</router-link>
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

.menu {
  min-height: 8em;
}

.menu .item {
  font-weight: bold;
  font-size: 1.4em;
}

.menu .header.item {
  font-size: 2em;
}

</style>
