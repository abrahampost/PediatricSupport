<template>
  <div class="patient-messages">
    <div class="ui stackable middle aligned grid container padding-top">
      <div class="four wide column">
        <div id="chats" class="ui fluid card">
          <div class="content">
            <h1 class="header">Chats</h1>
          </div>
          <div id="users" class="content">
            <h2 class="header" v-if="conversations.length === 0">No Matches Yet</h2>
            <div class="ui middle aligned selection list" v-if="conversations.length > 0">
              <div
                class="item"
                v-for="conversation in conversations"
                :key="conversation.id"
                @click="selectedConversationId = conversation.id"
              >
                <img
                  class="ui avatar image"
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                >
                <router-link
                  class="content"
                  :to="{name:'patientMessagesWithUser', params: {id: conversation.id}}"
                >
                  <a>{{ conversation.username }}</a>
                  <div class="description">
                    {{ conversation.messages.length > 0 ?
                    formatDate(conversation.messages[conversation.messages.length - 1].createdAt) : 'no messages yet' }}
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="twelve wide column">
        <MessageLog
          v-bind:username="selectedConversation.username"
          v-bind:messages="selectedConversation.messages"
          v-bind:error="error"
          v-bind:loading="loading"
          v-on:sendMessage="sendMessage($event)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import MessageLog from "./MessageLog.vue";
import { setTimeout } from 'timers';

export default {
  name: "PatientMessages",
  data() {
    return {
      conversations: [],
      lastPolled: undefined,
      loading: false,
      error: undefined,
    };
  },
  components: {
    MessageLog
  },
  computed: {
    selectedConversation() {
      if (this.$route.params.id) {
        return this.conversations.find(c => c.id === this.$route.params.id);
      }
      return {
        username: "",
        messages: []
      };
    }
  },
  mounted() {
    this.loadAllMessages();
    //setTimeout(this.loadAllMessages, 10000);
  },
  methods: {
    formatDate(date) {
      date = new Date(date);
      if (date.toDateString() === new Date().toDateString()) {
        return date.toLocaleTimeString();
      }
      return date.toLocaleDateString();
    },
    sendMessage(message) {
      this.$http
        .post(`/messages/${this.$route.params.id}`, { content: message })
        .then(res => {
          const { data } = res;
          this.lastPolled = data.lastPolled;
          this.loading = false;
          this.error = "";
          let conversation = this.conversations.find(
            c => c.id === this.$route.params.id
          );
          conversation.messages.push(data.message);
        })
        .catch(err => {
          if (err && err.data && err.data.error) {
            this.error = err.data.error;
          } else {
            this.error = "Unable to create message.";
          }
          this.loading = false;
        });
    },
    loadAllMessages() {
      let route = "/messages";
      if (this.lastPolled) {
        route += `?time=${this.lastPolled}`;
      }
      this.$http
        .get(route)
        .then(res => {
          const { data } = res;
          this.conversations = data.conversations;
          this.lastPolled = data.lastPolled;
          this.loading = false;
          this.error = "";
        })
        .catch(err => {
          if (err && err.data && err.data.error) {
            this.error = err.data.error;
          } else {
            this.error = "Unable to load messages.";
          }
          this.loading = false;
        });
    }
  }
};
</script>
<style scoped>
#chats {
  max-height: 70vh;
}
#users {
  height: 80%;
  overflow-y: auto;
  overflow-x: hidden;
}

.padding-top {
  padding-top: 2em;
}
</style>
