<template>
  <div class="patient-preferences">
    <h1 class="ui huge header margin">Preferences</h1>

    <!-- 
      Interests section
      - Toggling an interest is recognized by console, but...
      - Don't know how to identify which values are checked/unchecked (for updating interests)
      - Don't know how to pre-check checkboxes if it's part of the user's 
        current interests when the page loads (optional?)
      - Should color in checkbox segments when checkbox is checked (optional)

      - Submit button doesn't do anything atm
      - "Current interests" are static atm
    -->
    <form class="ui form" @submit.prevent="updateInterests">
      <div class="ui container">
        <h2 class="ui left aligned header">What are some things you like?</h2>
        <div class="ui floated segment">
          <div class="ui floated compact segment" v-for="interest in interests" :key="interest.id">
            <div class="ui checkbox">
              <input type="checkbox" 
              @click="handleId(interest.id)"
              value="true"
              true-value="like"
              false-value="dislike">
              <label>{{ interest.name }}</label>
            </div>
          </div>
        </div>
        <button class="ui big button" type="submit">Update preferences</button>
      </div>
    </form>
    <br>
    <h3 class="ui header">Current interests:</h3>
    <div class="ui message">
      <p>{{ readInterests(currentInterests) }}</p>
    </div>
    <br><br><br>

    <!-- 
      Bio section
      - Works in all respects minus being connected to backend
      - "Current bio" gets updated when a bio is written + submitted
    -->
    <form class="ui form" @submit.prevent="updateBio">
      <div class="ui container">
        <h2 class="ui left aligned header">Write a short bio for yourself here!</h2>
        <div>
          <div class="ui fluid input">
            <input 
              type="text" 
              placeholder="Write here..." 
              v-model="bio">
          </div>
          <br>
          <button class="ui big button" type="submit">Update bio</button>
        </div>
      </div>
    </form>
    <br>
    <h3 class="ui header">Current bio:</h3>
    <p class="ui message">{{ currentbio }}</p>
    <br><br>
  </div>
</template>

<script>
export default {
  name: 'PatientPreferences',
  data() {
    return  {
      bio: "",
      currentbio: 'This is a placeholder bio',
      interests: [
        {id: 1, like: true, name: 'legos'},
        {id: 2, like: true, name: 'movies'},
        {id: 3, like: false, name: 'sports'},
        {id: 4, like: true, name: 'chess'},
        {id: 5, like: false, name: 'dinosaurs'},
        {id: 6, like: false, name: 'youtube'},
        {id: 7, like: true, name: 'skating'},
        {id: 8, like: true, name: 'videogames'},
        {id: 9, like: false, name: 'broccoli'},
        {id: 10, like: true, name: 'badminton'},
        {id: 11, like: true, name: 'having a really great time'},
        {id: 12, like: false, name: 'chugging a full gallon of milk in one go'},
        {id: 13, like: false, name: 'procrastinating'},
        {id: 14, like: false, name: 'waiting until sunday night to do your homework'},
        {id: 15, like: true, name: 'long walks on the beach'},
        {id: 16, like: false, name: 'water without any ice'},
        {id: 17, like: false, name: 'fsjal memes'},
        {id: 18, like: false, name: 'h'},
      ]
    }
  },
  computed: {
    currentInterests: function() {
      return this.interests.filter(function(x) {return x.like})
    }
  },
  methods: {
    readInterests(interestlist) {
      return interestlist.map(interest => interest.name).join(', ')
    },
    getInterests() {
      
    },
    updateInterests() {
      console.log("Interests not actually updated; connect to backend")
    },
    updateBio() {
      console.log(this.bio)
      this.currentbio = this.bio
    },
    handleId(id) {
      console.log("Handling " + id);
    }
  }
};
</script>
<style scoped>
.ui.huge.header.margin {margin: 1em;}
.ui.segment {margin: .5em;}
.ui.button {
  margin: .5em;
}
.interest {
  font-size: 20px;
  font-weight: bold;
  margin: 1em;
}
</style>
