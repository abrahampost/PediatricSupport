<template>
  <div class="patient">
    <Header></Header>
    <router-view class="content"></router-view>
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
.content {
  margin-top: 1%;
  margin-left: 3%;
  margin-right: 3%;
}
</style>
