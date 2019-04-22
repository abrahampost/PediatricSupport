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
    <table class="ui celled selectable table">
      <thead>
        <tr>
          <th>Reported User</th>
          <th>Reporter User</th>
          <th>Reason</th>
        </tr>
      </thead>
      <tbody>
        <tr v-bind:class="{pending: showPending}" v-for="report in filteredReports" :key="report.id" @click="showReport(report)">
          <td data-label="Reported Username">{{report.reported_username}}</td>
          <td data-label="Reporter Username">{{report.reporter_username}}</td>
          <td data-label="Reason">{{report.description}}</td>
        </tr>
      </tbody>
    </table>
    <ViewReportModal
      v-if="showReportModal"
      v-on:close="showReportModal=false"
      v-on:resolve="resolveReport()"
      v-bind:messages="messages"
      v-bind:reporterAvatar="reporterAvatar"
      v-bind:reportedAvatar="reportedAvatar"
      v-bind:reportedUserInformation="reportedUserInformation"
      v-bind:report="selectedReport"
    ></ViewReportModal>
  </div>
</template>
<script>
import ViewReportModal from "@/views/admin/ViewReportModal.vue";

export default {
  name: "AdminManageReports",
  components: {
    ViewReportModal
  },
  data() {
    return {
      reports: [],
      error: "",
      showPending: true,
      showReportModal: false,
      messages: [],
      reporterAvatar: undefined,
      reportedAvatar: undefined,
      selectedReport: undefined,
      reportedUserInformation: undefined
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
            this.error = "Unable to retrieve reports.";
          }
        });
    },
    resolveReport() {
      this.error = "";
      this.$http
        .put("/reports/"+this.selectedReport.id, {
          status: 'resolved'
        })
        .then(() => {
          this.showReportModal = false;
          this.getReports();
        })
        .catch(err => {
          if (err && err.data && err.data.error) {
            this.error = err.data.error;
          } else {
            this.error = "Unable to resolve report.";
          }
        });
    },
    showReport(report) {
      if (report.status === "resolved") {
        return;
      }

      this.error = "";
      this.selectedReport = report;
      this.showReportModal = true;

      this.$http
        .get(
          "/users/" +
            report.reporter_id +
            "/conversations/" +
            report.reported_id
        )
        .then(res => {
          const { data } = res;
          this.messages = data.messages;
          this.reporterAvatar = data.userOneAvatar;
          this.reportedAvatar = data.userTwoAvatar;

          this.$http
            .get("/users/" + report.reported_id)
            .then(res => {
              const { data } = res;
              this.reportedUserInformation = data;
            })
            .catch(err => {
              if (err && err.data && err.data.error) {
                this.error = err.data.error;
              } else {
                this.error =
                  "Unable to retrieve the reported user's information.";
              }
            });
        })
        .catch(err => {
          if (err && err.data && err.data.error) {
            this.error = err.data.error;
          } else {
            this.error = "Unable to retrieve report.";
          }
        });
    }
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
.pending {
  cursor: pointer;
}
</style>
