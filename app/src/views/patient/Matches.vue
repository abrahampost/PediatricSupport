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
        <div class="ui cards">
          <div class="ui centered card" v-for="match in filteredMatches" :key="match.id">
            <div class="image">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png">
            </div>
            <div class="content">
              <div class="header">{{ match.user.name }}</div>
              <div class="description">{{ match.user.description }}</div>
            </div>
            <div class="extra content">
              <div v-if="match.type === 'matched'">
                <p>Matched</p>
              </div>
              <div v-if="match.type === 'sent'"
                class="ui basic red button"
                @click="deleteMatch(match.id)">Delete Request</div>
              <div v-if="match.type === 'pending'">
                <p>Respond to Request</p>
                <div class="ui two buttons" v-if="match.type == 'pending'">
                  <div class="ui basic green button" @click="acceptMatch(match.id)">Accept</div>
                  <div class="ui basic red button" @click="denyMatch(match.id)">Deny</div>
                </div>
              </div>
            </div>
          </div>
          <div class="ui centered card" v-if="filteredMatches.length === 0">
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
  data() {
    return {
      filterType: 'all',
      matches: [
        {
          id: 1,
          user: {
            name: 'BuffTurtle12',
            description: 'I love to play with legos.',
          },
          type: 'potential',
        },
        {
          id: 2,
          user: {
            name: 'BigApple76',
            description: 'I love to watch movies.',
          },
          type: 'pending',
        },
        {
          id: 3,
          user: {
            name: 'SmartDog64',
            description: 'Legos are my favorite things.',
          },
          type: 'matched',
        },
        {
          id: 4,
          user: {
            name: 'HappyClam14',
            description: 'Halo is my favorite game.',
          },
          type: 'matched',
        },
        {
          id: 5,
          user: {
            name: 'LittleWhale25',
            description: 'If you like fortnite pls friend me!!!.',
          },
          type: 'sent',
        },
        {
          id: 6,
          user: {
            name: 'SmallPuppy3',
            description: 'I like basketball.',
          },
          type: 'matched',
        },
        {
          id: 7,
          user: {
            name: 'SwiftHare27',
            description: 'MJ >> Lebron.',
          },
          type: 'pending',
        },
      ],
    };
  },
  computed: {
    filteredMatches() {
      return this.matches.filter(match => match.type === this.filterType);
    },
  },
  methods: {
    acceptMatch(id) {
      // TODO: Make this hit backend
      console.log(`ACCEPT FRIEND: ${id}`);
    },
    denyMatch(id) {
      // TODO: Make this hit backend
      console.log(`DENY FRIEND: ${id}`);
    },
    deleteMatch(id) {
      // TODO: Make this hit the backend
      console.log(`DELETE MATCH: ${id}`);
    },
  },
};
</script>
<style scoped>
.ui.huge.header.margin {
  margin: 1em;
}
</style>
