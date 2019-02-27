<template>
  <div class="patient-matches">
    <h1 class="ui huge header margin">Patient Matches</h1>
    <div class="ui container">
      <div class="ui top attached tabular four item menu">
        <a class="item" @click="filterType='potential'"
          :class="{'active': 'potential' === filterType}">Potential Matches</a>
        <a class="item" @click="filterType='matched'"
          :class="{'active': 'matched' === filterType}">Matched</a>
        <a class="item" @click="filterType='pending'"
          :class="{'active': 'pending' === filterType}">Pending</a>
        <a class="item" @click="filterType='sent'"
          :class="{'active': 'sent' === filterType}">Sent</a>
      </div>
      <div class="ui bottom attached segment">
        <div class="ui active dimmer" v-if="loading">
          <div class="ui loader"></div>
        </div>
        <div class="ui cards">
          <div class="ui centered card" v-for="match in filteredMatches" :key="match.id">
            <div class="image">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png">
            </div>
            <div class="content">
              <div class="header">{{ match.username }}</div>
              <div class="meta" v-if="filterType === 'potential'">
                <progress min="0" max="100" v-bind:value="Math.round(match.similarity * 100)">
                </progress>
              </div>
              <div class="description">{{ getAttributeList(match.attributes) }}</div>
            </div>
            <div class="extra content">
              <div v-if="filterType === 'potential'"
                class="ui basic green button"
                @click="sendRequest(match)">Send Request</div>
              <div v-if="filterType === 'matched'">
                <p>Matched</p>
              </div>
              <div v-if="filterType === 'sent'"
                class="ui basic red button"
                @click="deleteMatch(match)">Delete Request</div>
              <div v-if="filterType === 'pending'">
                <p>Respond to Request</p>
                <div class="ui two buttons" v-if="match.type === 'pending'">
                  <div class="ui basic green button" @click="acceptMatch(match)">Accept</div>
                  <div class="ui basic red button" @click="deleteMatch(match)">Deny</div>
                </div>
              </div>
            </div>
          </div>
          <div class="ui centered card" v-if="error">
            <div class="content">
              <div class="ui negative messasge">
                <div class="header">{{ error }}</div>
              </div>
            </div>
          </div>
          <div class="ui centered card" v-if="filteredMatches.length === 0 && error === ''">
            <div class="content">
              <div class="header">
                No Users Found
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PatientMatches',
  created() {
    this.fetchData();
  },
  data() {
    return {
      filterType: 'potential',
      matches: [],
      potentialMatches: [],
      error: '',
      loading: false,
    };
  },
  computed: {
    filteredMatches() {
      if (this.filterType === 'potential') {
        return this.potentialMatches;
      }
      return this.matches.filter(match => match.type === this.filterType);
    },
  },
  methods: {
    fetchData() {
      this.loading = true;
      this.error = '';
      this.$http.get('/matches')
        .then((res) => {
          const [data] = res;
          this.matches = data.matches;
          this.potentialMatches = data.potentialMatches;
          this.loading = false;
        })
        .catch((err) => {
          if (err && err.data && err.data.error) {
            this.error = err.data.error;
          } else {
            this.error = 'Unable to load matches.';
          }
          this.loading = false;
        });
    },
    acceptMatch(match) {
      const [id] = match;
      this.loading = true;
      this.$http.put(`matches/${id}`, {
        matchType: 'matched',
      })
        .then(() => {
          this.loading = false;
        })
        .then(this.fetchData)
        .catch((err) => {
          if (err.data && err.data.message) {
            this.error = err.data.message;
          } else {
            this.error = 'Unable to accept match.';
          }
        });
    },
    deleteMatch(match) {
      const [id] = match;
      this.loading = true;
      this.$http.delete(`matches/${id}`, {
      })
        .then(() => {
          this.loading = false;
        })
        .then(this.fetchData)
        .catch((err) => {
          if (err.data && err.data.message) {
            this.error = err.data.message;
          } else {
            this.error = 'Unable to delete match.';
          }
        });
    },
    sendRequest(match) {
      const [id] = match;
      this.loading = true;
      this.$http.post('matches/', {
        receivingId: id,
      })
        .then(() => {
          this.loading = false;
        })
        .then(this.fetchData)
        .catch((err) => {
          if (err.data && err.data.message) {
            this.error = err.data.message;
          } else {
            this.error = 'Unable to send match.';
          }
        });
    },
    getAttributeList(attributes) {
      return attributes.map(a => a[0].toUpperCase() + a.substring(1)).join(', ');
    },
  },
};
</script>
<style scoped>
.ui.huge.header.margin {
  margin: 1em;
}
</style>
