<template>
  <div class="header">
    <div class="ui top borderless stackable menu">
      <div class="header item">UNC Pediatric Support Parent Page</div>
      <router-link class="right aligned item" :to="{name:'login'}">Logout</router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ParentHeader',
};
</script>
<style scoped>
</style>
