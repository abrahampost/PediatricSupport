<template>
  <!-- Not connected to backend atm, so uses placeholder values -->

  <div class="patient-preferences">
    <h1 class="ui huge header margin">Preferences</h1>

    <!-- 
      Interests section

      - Patent's currently saved interests are reflected in checkboxes when page is loaded
      - On submit, updates "current interests" message with selected interests
    -->
    <form class="ui form" @submit.prevent="updatePreferences">
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
          <div class="field">
            <h4 class="ui left aligned header">Biography</h4>
            <textarea type="text" rows="3" placeholder="Write here..." v-model="biography"></textarea>
          </div>
          <div>
            <h4 class="ui left aligned header">Interests</h4>
            <div class="ui field">
              <input
                type="text"
                list="available-interest-list"
                v-model="selectedInterest"
                @change="updateSelectedInterest()"
              >
              <datalist class="fluid menu" id="available-interest-list">
                <option
                  class="fluid item"
                  v-for="interest in interests"
                  :key="interest.id"
                  @click="selectedInterest = option"
                >{{interest.name}}</option>
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
    </form>
  </div>
</template>

<script>
export default {
  name: "PatientPreferences",
  data() {
    return {
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
    checkedInterests: $(".ui.patient-preferences").find(".ui.checkbox input"),
    currentInterests: function() {
      return this.interests.filter(function(x) {
        return x.like;
      });
    }
  },
  methods: {
    readInterests(interestlist) {
      return interestlist.map(interest => interest.name).join(", ");
    },
    updateInterests() {
      console.log($(".ui.toggle").checkbox("is checked"));
      var checkboxValues = $(".ui.toggle").checkbox("is checked");
      var newInterests = [];
      for (var i = 0; i < checkboxValues.length; i++) {
        if (checkboxValues[i]) {
          console.log(i);
          newInterests.push(this.interests[i].name);
        }
      }
      document.getElementById(
        "current_interests_message"
      ).innerHTML = newInterests.join(", ");
    },
    updateBio() {
      console.log(this.bio);
      this.currentbio = this.bio;
    },
    handleId(id) {
      console.log("Handling " + id);
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
