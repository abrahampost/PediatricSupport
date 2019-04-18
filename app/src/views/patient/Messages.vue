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
              >
                <img
                  class="ui avatar image"
                  :src="conversation.avatar"
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
          v-bind:otherUserAvatar="selectedConversation.avatar"
          v-bind:userAvatar="userAvatar"
          v-bind:messages="selectedConversation.messages"
          v-bind:error="error"
          v-bind:otherUserId="$route.params.id"
          v-on:sendMessage="sendMessage($event)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import MessageLog from "./MessageLog.vue";

export default {
  name: "PatientMessages",
  data() {
    return {
      userAvatar: undefined,
      conversations: [],
      lastPolled: undefined,
      error: undefined,
      intervalId: undefined,
      loading: false,
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
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  mounted() {
    this.loadMessages(true);
    this.intervalId = setInterval(this.loadMessages, 3000);
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
        .then((res) => {
          this.error = "";
          this.loadMessages();
        })
        .catch((err) => {
          if (err && err.data && err.data.error) {
            this.error = err.data.error;
          } else {
            this.error = "Unable to create message.";
          }
        });
    },
    loadMessages() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      let route = "/messages";
      if (this.lastPolled) {
        route += `?time=${this.lastPolled}`;
      }
      this.$http
        .get(route)
        .then((res) => {
          const { data } = res;
          if (this.lastPolled) {
            this.combineMessages(this.conversations, data.conversations);
          } else {
            this.conversations = data.conversations;
          }
          if (data.avatar) {
            this.userAvatar = data.avatar;
          }
          this.lastPolled = data.lastPolled;
          this.error = "";
          this.loading = false;
        })
        .catch((err) => {
          if (err && err.data && err.data.error) {
            this.error = err.data.error;
          } else {
            this.error = "Unable to load messages.";
          }
          this.loading = false;
        });
    },
    combineMessages(current, retrieved) {
      for(var i = 0; i < retrieved.length; i++) {
        let conversation = this.conversations.find(
            c => c.id === retrieved[0].id
        );
        if (!conversation) {
          conversations.push(retrieved[0])
        } else {
          if (retrieved[0].messages.length > 0) {
            retrieved[0].messages.forEach((message) => {
              conversation.messages.push(message);
            })
          }
        }
      }
    },
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
