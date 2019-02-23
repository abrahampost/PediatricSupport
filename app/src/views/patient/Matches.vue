<template>
  <div class="patient-matches">
    <div class="ui container">
      <h1>Patient Matches</h1>
      <div class="ui menu">
        <a class="item" @click="filterType='all'" :class="{'active': 'all' === filterType}">All</a>
        <a class="item" @click="filterType='matched'" :class="{'active': 'matched' === filterType}">Matched</a>
        <a class="item" @click="filterType='pending'" :class="{'active': 'pending' === filterType}">Pending</a>
      </div>
        <div class="ui segment">
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
                <p v-if="match.type != 'pending'">Matched</p>
                <p v-if="match.type == 'pending'">Respond to Request</p>
                <div class="ui two buttons" v-if="match.type == 'pending'">
                  <div class="ui basic green button" @click="acceptFriend(match.id)">Accept</div>
                  <div class="ui basic red button" @click="denyFriend(match.id)">Deny</div>
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
          type: 'pending',
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
          type: 'pending',
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
      if (this.filterType === 'all') {
        return this.matches;
      }
      return this.matches.filter(match => match.type === this.filterType);
    },
  },
  methods: {
    acceptFriend(id) {
      //TODO: Make this hit backend
      console.log("ACCEPT FRIEND: " + id);
    },
    denyFriend(id) {
      //TODO: Make this hit backend
      console.log("DENY FRIEND: " + id);
    }
  }
};
</script>
<style scoped>
</style>
