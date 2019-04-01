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
          @click="showCreateModal=true"
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
    </div>
    <CreateAttributeModal v-if="showCreateModal" v-bind:type="type" v-on:close="showCreateModal=false" v-on:created="updateAttributes">
      <h3 class="ui header" slot="header">Create {{singularType}}</h3>
    </CreateAttributeModal>
  </div>
</template>
<script>
import CreateAttributeModal from '@/views/admin/CreateAttributeModal.vue';

export default {
  name: 'AdminManageAttributes',
  components: {
    CreateAttributeModal,
  },
  props: {
    type: String,
  },
  data() {
    return {
      error: '',
      attributes: [],
      filter: '',
      showCreateModal: false,
    };
  },
  methods: {
    getAttributes() {
      this.error = '';
      this.$http
        .get('/attributes', {
          params: {
            type: this.type,
          },
        })
        .then((res) => {
          const { data } = res;
          this.attributes = data;
        })
        .catch((err) => {
          if (err && err.data && err.data.error) {
            this.error = err.data.error;
          } else {
            this.error = 'Unable to load attributes.';
          }
        });
    },
    updateAttributes() {
      this.showCreateModal = false;
      this.getAttributes();
    },
  },
  computed: {
    pluralType() {
      if (this.type === 'interest') {
        return 'Interests';
      }
      return 'Diagnoses';
    },
    singularType() {
      if (this.type === 'interest') {
        return 'Interest';
      }
      return 'Diagnosis';
    },
    filteredAttributes() {
      return this.attributes.filter(attribute => (
        attribute.name.toLowerCase().indexOf(this.filter.toLowerCase()) > -1
      ));
    },
  },
  watch: {
    type: 'getAttributes',
  },
  created() {
    this.getAttributes();
  },
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
