<template>
  <!-- Not connected to backend atm, so uses placeholder values -->

  <div class="patient-preferences">
    <h1 class="ui huge header margin">Preferences</h1>

    <!-- 
      Interests section

      - Patent's currently saved interests are reflected in checkboxes when page is loaded
      - On submit, updates "current interests" message with selected interests
    -->
    <div class="ui stackable grid">
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
        <div class="ui form">
          <div class="ui field">
            <h4 class="ui left aligned header">Biography</h4>
            <textarea type="text" rows="3" placeholder="Write here..." v-model="biography"></textarea>
          </div>
        </div>
        <div>
          <h4 class="ui left aligned header">Interests</h4>
          <v-select
            label="name"
            :options="filteredInterests"
            placeholder="Add Interest"
            v-model="selectedInterest"
            @change="updateInterests"
          ></v-select>
          <div v-if="selectedInterests.length != 0" class="ui fluid segment">
            <button
              class="ui compact circular red button"
              type="button"
              v-for="interest in selectedInterests"
              :key="interest.id"
              @click="deleteInterest(interest.id)"
            >
              <i class="window close outline icon"></i>
              {{ interest.name }}
            </button>
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
      selectedInterests: [],
      biography: "",
      interests: [
        { id: 1, name: "legos" },
        { id: 2, name: "movies" },
        { id: 3, name: "sports" },
        { id: 4, name: "chess" },
        { id: 5, name: "dinosaurs" },
        { id: 6, name: "youtube" },
        { id: 7, name: "skating" },
        { id: 8, name: "videogames" },
        { id: 9, name: "broccoli" },
        { id: 10, name: "badminton" },
        { id: 11, name: "having a really great time" },
        { id: 12, name: "cup stacking" },
        { id: 13, name: "going to disney land" },
        { id: 14, name: "riding a bus around town" },
        { id: 15, name: "long walks on the beach" },
        { id: 16, name: "water without any ice" },
        { id: 17, name: "volunteering at a soup kitchen" },
        { id: 18, name: "baking gluten free cookies" }
      ]
    };
  },
  methods: {
    deleteInterest(id) {
      this.selectedInterests = this.selectedInterests.filter(
        item => item.id != id
      );
    },
    updateInterests() {
      if (this.selectedInterest) {
        this.selectedInterests.push(this.selectedInterest);
        this.selectedInterest = "";
      }
    }
  },
  computed: {
    filteredInterests() {
      return this.interests.filter((interest) => this.selectedInterests.indexOf(interest) == -1);
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
