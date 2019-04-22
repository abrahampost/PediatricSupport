<template>
  <div class="patient-preferences">
    <h1 class="ui huge header margin">Preferences</h1>
    <div class="ui stackable grid">
      <div class="four wide column">
        <div class="ui centered card">
          <div class="ui active inverted dimmer" v-if="loading">
            <div class="ui text loader">Loading</div>
          </div>
          <Avatar
            class="image"
            :accessories="avatar.accessories"
            :clothes="avatar.clothes"
            :hats="avatar.hats"
            :heads="avatar.heads"
          />
          <div class="extra">
            <button
              class="ui basic button"
              @click="editAvatar=true">
              Change Avatar
            </button>
          </div>
        </div>
      </div>
      <div class="twelve wide column">
        <div class="ui form">
          <div class="ui field">
            <h4 class="ui left aligned header">Biography</h4>
            <textarea
              type="text"
              rows="3"
              placeholder="Write here..."
              v-model="biography"></textarea>
          </div>
        </div>
        <h4 class="ui left aligned header">Interests</h4>
        <v-select
          label="name"
          :options="filteredInterests"
          placeholder="Add Interest"
          v-model="selectedInterest"
          @change="updateInterests"
          ref='selectList'
        ></v-select>
        <div id="interest-list" class="ui segment">
          <div
            class="interest-list-item"
            v-for="interest in selectedInterests"
            :key="interest.id">
            <i class="red window close outline icon" @click="deleteInterest(interest.id)"></i>
            {{ interest.name }}
          </div>
          <h3 class="ui header" v-if="selectedInterests.length == 0">No Interests Selected</h3>
        </div>
        <button class="ui green button" @click="saveInfo">
          Save
        </button>
        <div class="ui negative message" v-if="error">
          <i class="close icon" @click="error = ''"></i>
          <div class="header">
            {{ error }}
          </div>
        </div>
        <div class="ui info message" v-if="message">
          <i class="close icon" @click="message = ''"></i>
          <div class="header">
            {{ message }}
          </div>
        </div>
      </div>
    </div>
    <EditAvatarModal
      :avatar="avatar"
      v-if="editAvatar"
      v-on:close="editAvatar=false"
      v-on:save="saveAvatar" />
  </div>
</template>

<script>
import EditAvatarModal from '@/views/patient/EditAvatarModal.vue';
import Avatar from '@/components/Avatar.vue';

export default {
  name: 'PatientPreferences',
  components: {
    EditAvatarModal,
    Avatar
  },
  mounted() {
    this.loadInfo();
  },
  data() {
    return {
      selectedInterest: '',
      selectedInterests: [],
      biography: '',
      interests: [],
      avatar: {
        accessories: '1',
        clothes: '1',
        hats: '1',
        heads: '1',
      },
      editAvatar: false,
      error: '',
      message: '',
      loading: false,
    };
  },
  methods: {
    deleteInterest(id) {
      this.selectedInterests = this.selectedInterests.filter(item => item.id !== id);
    },
    updateInterests() {
      if (this.selectedInterest) {
        this.selectedInterests.push(this.selectedInterest);
        this.selectedInterest = '';
      }
    },
    saveInfo() {
      const requestBody = {
        biography: this.biography || '',
        interests: this.selectedInterests.map(interest => interest.id),
        avatar: this.avatar,
      };
      this.$http.put('/users', requestBody)
        .then(() => {
          this.message = 'Successfully updated info.';
        }).catch((err) => {
          this.error = err.data.error;
        });
    },
    loadInfo() {
      this.loading = true;
      this.$http.get('/users')
        .then((res) => {
          const { data } = res;
          this.biography = data.biography;
          this.selectedInterests = data.attributes;
          this.avatar = data.avatar;
        }).catch((err) => {
          this.error = err.data.error;
        }).then(() => {
          this.loading = false;
        });

      this.$http.get('/attributes')
        .then((res) => {
          this.interests = res.data;
        }).catch((err) => {
          this.error = err.data.error;
        });
    },
    saveAvatar(avatar) {
      this.editAvatar = false;
      this.avatar = avatar;
    },
  },
  computed: {
    filteredInterests() {
      const selectedIds = new Set(this.selectedInterests.map(interest => interest.id));
      return this.interests.filter(interest => !selectedIds.has(interest.id));
    },
  },
};
</script>
<style scoped>
.ui.huge.header.margin {
  margin: 1em;
}

#interest-list {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-content: flex-start;
  justify-content: center;
  min-height: 10em;
}

.interest-list-item {
  border: 1px solid rgba(60,60,60, .26);
  border-radius: 1em;
  padding: 1em;
  margin: .25em .4em;
}

.red.window.close.outline.icon:hover {
  font-weight: bolder;
}
</style>
