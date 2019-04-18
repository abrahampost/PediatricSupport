<template>
  <div class="admin">
    <h1>Manage Reports</h1>
    <div class="ui negative message" v-if="error">
      <div class="header">{{ error }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AdminManageReports',
  data() {
    return {
      reports: [],
      error: ''
    };
  },
};
</script>
<style scoped>
</style>
