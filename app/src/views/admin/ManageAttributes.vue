<template>
  <div>
    <h1>Manage {{pluralType}}</h1>
    <div class="ui negative message" v-if="error">
      <div class="header">{{ error }}</div>
    </div>
    <div class="table-container">
      <div class="table-header">
        <div class="ui input filter-bar">
          <input type="text" v-model="filter" placeholder="Filter">
        </div>
        <div
          class="create-button ui vertical animated button"
          tabindex="0"
          @click="showCreateModal()"
        >
          <div class="hidden content">Create</div>
          <div class="visible content">
            <i class="edit outline icon"></i>
          </div>
        </div>
      </div>
      <table class="ui celled table">
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="attribute in filteredAttributes" :key="attribute.id">
            <td data-label="Name">{{attribute.name}}</td>
          </tr>
        </tbody>
      </table>
      <div class="create-modal ui modal">
        <div class="header">Create {{singularType}}</div>
        <form class="create-modal-content ui form" @submit.prevent="createAccounts">
          <input type="text" placeholder="Name" v-model="patientFirstName" required>
          <div class="actions">
            <div class="ui black deny button">Close</div>
            <div class="ui positive right labeled icon button">
              Create
              <i class="checkmark icon"></i>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "AdminManageAttributes",
  props: {
    type: String
  },
  data() {
    return {
      error: "",
      attributes: [],
      filter: ""
    };
  },
  methods: {
    getAttributes() {
      this.error = "";
      this.$http
        .get("/attributes", {
          params: {
            type: this.type
          }
        })
        .then(res => {
          const { data } = res;
          this.attributes = data;
        })
        .catch(err => {
          if (err && err.data && err.data.error) {
            this.error = err.data.error;
          } else {
            this.error = "Unable to load attributes.";
          }
        });
    },
    showCreateModal() {
      $(".create-modal").modal("show");
    }
  },
  computed: {
    pluralType() {
      if (this.type === "interest") {
        return "Interests";
      } else {
        return "Diagnoses";
      }
    },
    singularType() {
      if (this.type === "interest") {
        return "Interest";
      } else {
        return "Diagnosis";
      }
    },
    filteredAttributes() {
      return this.attributes.filter(attribute => {
        return (
          attribute.name.toLowerCase().indexOf(this.filter.toLowerCase()) > -1
        );
      });
    }
  },
  watch: {
    type: "getAttributes"
  },
  created() {
    this.getAttributes();
  }
};
</script>
<style scoped>
.table-container {
  width: 50%;
  margin: auto;
}

.filter-bar {
  float: left;
}

.create-button {
  float: right;
}

.create-modal-content {
  margin-top: 5%;
  margin-bottom: 5%;
  margin-left: 2%;
}

thead {
  text-align: center;
}
</style>
