<template>
  
  <!-- Not connected to backend atm, so uses placeholder values -->
  
  <div class="patient-preferences">
    <h1 class="ui huge header margin">Preferences</h1>

    <!-- 
      Interests section

      - Patent's currently saved interests are reflected in checkboxes when page is loaded
      - On submit, updates "current interests" message with selected interests
    -->
    <form class="ui form" @submit.prevent="updateInterests">
      <div class="ui container">
        <h2 class="ui left aligned header">What are some things you like?</h2>
        <div class="ui floated segment">
          <div class="ui floated compact segment" v-for="interest in interests" :key="interest.id">
            <div v-if="interest.like" class="ui toggle checkbox">
              <input type="checkbox" @click="handleId(interest.id)" checked="true">
              <label>{{ interest.name }}</label>
            </div>
            <div v-else class="ui toggle checkbox">
              <input type="checkbox" @click="handleId(interest.id)">
              <label>{{ interest.name }}</label>
            </div>
          </div>
        </div>
        <button class="ui big button" type="submit">Update preferences</button>
      </div>
    </form>
    <br>
    <h3 class="ui header">Current interests:</h3>
    <div class="ui message" id="current_interests_message">
      <p>{{ readInterests(currentInterests) }}</p>
    </div>
    <br><br><br>

    <!-- 
      Bio section

      - Updates bio message on submit
      - Should there be a char limit?
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
        {id: 12, like: false, name: 'cup stacking'},
        {id: 13, like: false, name: 'going to disney land'},
        {id: 14, like: false, name: 'riding a bus around town'},
        {id: 15, like: true, name: 'long walks on the beach'},
        {id: 16, like: false, name: 'water without any ice'},
        {id: 17, like: false, name: 'volunteering at a soup kitchen'},
        {id: 18, like: false, name: 'baking gluten free cookies'},
      ]
    }
  },
  computed: {
    checkedInterests: $('.ui.patient-preferences').find('.ui.checkbox input'),
    currentInterests: function() {
      return this.interests.filter(function(x) {return x.like})
    }
  },
  methods: {
    readInterests(interestlist) {
      return interestlist.map(interest => interest.name).join(', ')
    },
    updateInterests() {
      console.log($('.ui.toggle').checkbox('is checked'))
      var checkboxValues = $(".ui.toggle").checkbox('is checked')
      var newInterests = []
      for (var i = 0; i < checkboxValues.length; i++){
        if (checkboxValues[i]){
          console.log(i)
          newInterests.push(this.interests[i].name)
        }
      }
      document.getElementById("current_interests_message").innerHTML = newInterests.join(', ')
    },
    updateBio() {
      console.log(this.bio)
      this.currentbio = this.bio
    },
    handleId(id) {
      console.log("Handling " + id)
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
