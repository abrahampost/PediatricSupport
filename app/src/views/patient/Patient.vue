<template>
  <div class="patient">
    <Header></Header>
    <router-view></router-view>
  </div>
</template>
<script>
import Header from './Header.vue';

export default {
  name: 'Patient',
  components: {
    Header,
  },
};
</script>
<style scoped>
</style>
