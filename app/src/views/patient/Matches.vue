
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
          :class="{'active': 'pending' === filterType}">Pending
          <span v-if="pendingNumber > 0" class="pending">{{ pendingNumber }}</span>
          </a>
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
              <img :src="match.avatar">
            </div>
            <div class="content">
              <div class="header">{{ match.username }}</div>
              <div class="meta" v-if="filterType === 'potential'">
                <progress min="0" max="100" v-bind:value="similarPercent(match.similarity)">
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
      highestSimilarity: 1,
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
    pendingNumber() {
      if (!this.matches || this.matches.length === 0) {
        return 0;
      }
      return this.matches.reduce((acc, val) => {
        if (val.type === 'pending') {
          return acc + 1;
        }
        return acc;
      }, 0);
    },
  },
  methods: {
    fetchData() {
      this.loading = true;
      this.error = '';
      this.$http.get('/matches')
        .then((res) => {
          const { data } = res;
          this.matches = data.matches;
          this.potentialMatches = data.potentialMatches;
          if (this.potentialMatches.length > 0) {
            //prevents divide by 0 errors if no similar matches exist
            let highestSimilarity = this.potentialMatches[0].similarity;
            this.highestSimilarity = Math.max(1, highestSimilarity);
          }
          this.loading = false;
          this.error = '';
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
      const { id } = match;
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
      const { id } = match;
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
      const { id } = match;
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
    similarPercent(similarity) {
      if (this.highestSimilarity === 0) return 0;
      return Math.round((similarity / this.highestSimilarity) * 100);
    },
  },
};
</script>
<style scoped>
.ui.huge.header.margin {
  margin: 1em;
}
.pending {
  margin-left: 4px;
  background-color: red;
  border-radius: 3px;
  color: white;
  padding: .3em;
  font-weight: 400;
}
</style>
