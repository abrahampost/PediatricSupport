<template>
  <div class="admin">
    <h1>{{reportStatus}} Reports</h1>
    <div class="ui negative message" v-if="error">
      <div class="header">{{ error }}</div>
    </div>
    <div class="ui large buttons">
      <div class="ui button" @click="showPending=true">Pending</div>
      <div class="or"></div>
      <div class="ui button" @click="showPending=false">Resolved</div>
    </div>
    <table class="ui celled table">
      <thead>
        <tr>
          <th>Reported User</th>
          <th>Reporter User</th>
          <th>Reason</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="report in filteredReports" :key="report.id">
          <td data-label="Reported Username">{{report.reported_username}}</td>
          <td data-label="Reporter Username">{{report.reporter_username}}</td>
          <td data-label="Reason">{{report.description}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: "AdminManageReports",
  data() {
    return {
      reports: [],
      error: "",
      showPending: true
    };
  },
  methods: {
    getReports() {
      this.error = "";
      this.$http
        .get("/reports")
        .then(res => {
          const { data } = res;
          this.reports = data;
        })
        .catch(err => {
          if (err && err.data && err.data.error) {
            this.error = err.data.error;
          } else {
            this.error = "Unable to load reports.";
          }
        });
    },
    resolveReport() {}
  },
  computed: {
    reportStatus() {
      if (this.showPending) {
        return "Pending";
      }
      return "Resolved";
    },
    filteredReports() {
      let status = this.showPending ? "pending" : "resolved";
      return this.reports.filter(report => report.status === status);
    }
  },
  created() {
    this.getReports();
  }
};
</script>
<style scoped>
</style>
