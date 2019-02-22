<template>
  <div class="admin">
    <Header></Header>
    <router-view></router-view>
  </div>
</template>
<script>
import Header from './Header.vue';

export default {
  name: 'Admin',
  components: {
    Header,
  },
};
</script>
<style scoped>
</style>
