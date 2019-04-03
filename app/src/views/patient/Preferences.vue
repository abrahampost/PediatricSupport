<template>
  <!-- Not connected to backend atm, so uses placeholder values -->

  <div class="patient-preferences">
    <h1 class="ui huge header margin">Preferences</h1>

    <!-- 
      Interests section

      - Patent's currently saved interests are reflected in checkboxes when page is loaded
      - On submit, updates "current interests" message with selected interests
    -->
    <div class="ui stackable grid form">
      <div class="four wide column">
        <div class="ui centered card">
          <div class="image">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
            >
          </div>
          <div class="extra">Change Avatar</div>
        </div>
      </div>
      <div class="twelve wide column">
        <div class="ui field">
          <h4 class="ui left aligned header">Biography</h4>
          <textarea type="text" rows="3" placeholder="Write here..." v-model="biography"></textarea>
        </div>
        <div>
          <h4 class="ui left aligned header">Interests</h4>
          <div class>
            <input
              type="text"
              list="available-interest-list"
              placeholder="Add Interest"
              v-model="selectedInterest"
              @change="updateSelectedInterest()"
            >
            <datalist id="available-interest-list">
              <option v-for="interest in unselectedInterests" :key="interest.id">{{interest.name}}</option>
            </datalist>
          </div>
          <div class="ui floated segment">
            <div
              class="ui floated compact segment"
              v-for="interest in interests"
              :key="interest.id"
            >
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PatientPreferences",
  data() {
    return {
      selectedInterest: "",
      biography: "",
      interests: [
        { id: 1, like: true, name: "legos" },
        { id: 2, like: true, name: "movies" },
        { id: 3, like: false, name: "sports" },
        { id: 4, like: true, name: "chess" },
        { id: 5, like: false, name: "dinosaurs" },
        { id: 6, like: false, name: "youtube" },
        { id: 7, like: true, name: "skating" },
        { id: 8, like: true, name: "videogames" },
        { id: 9, like: false, name: "broccoli" },
        { id: 10, like: true, name: "badminton" },
        { id: 11, like: true, name: "having a really great time" },
        { id: 12, like: false, name: "cup stacking" },
        { id: 13, like: false, name: "going to disney land" },
        { id: 14, like: false, name: "riding a bus around town" },
        { id: 15, like: true, name: "long walks on the beach" },
        { id: 16, like: false, name: "water without any ice" },
        { id: 17, like: false, name: "volunteering at a soup kitchen" },
        { id: 18, like: false, name: "baking gluten free cookies" }
      ]
    };
  },
  computed: {
    upperCaseSelectedInterest: function() {
      return this.selectedInterest.toUpperCase();
    },
    isValidInterest: function() {
      let filteredInterests = this.filteredUnselectedInterests;
      return (
        filteredInterests.length === 1 &&
        filteredInterests[0].name.toUpperCase() ===
          this.upperCaseSelectedInterest
      );
    },
    selectedInterests: function() {
      return this.interests.filter(interest => {
        return interest.like;
      });
    },
    unselectedInterests: function() {
      return this.interests.filter(interest => {
        return !interest.like;
      });
    },
    filteredUnselectedInterests: function() {
      if (this.selectedInterest === null) {
        return [];
      }
      return this.interests.filter(interest => {
        return (
          !interest.like &&
          interest.name.toUpperCase().indexOf(this.upperCaseSelectedInterest) >
            -1
        );
      });
    }
  },
  methods: {
    clickSelectedInterest(interest) {
      console.log("click");
      this.selectedInterest = interest.name;
      this.updateSelectedInterest();
    },
    updateSelectedInterest() {
      console.log("update");
      if (this.isValidInterest) {
        this.filteredUnselectedInterests[0].like = true;
        this.selectedInterest = "";
      }
    }
  }
};
</script>
<style scoped>
.ui.huge.header.margin {
  margin: 1em;
}
.ui.segment {
  margin: 0.5em;
}
.ui.button {
  margin: 0.5em;
}
.interest {
  font-size: 20px;
  font-weight: bold;
  margin: 1em;
}
</style>
