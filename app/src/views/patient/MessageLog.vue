<template>
  <div class="patient-message-log">
    <div class="ui segment full-height">
      <h3 class="ui header" v-if="username">Chat with {{ username }}</h3>
      <div id="log"
        class="ui middle aligned grid"
        v-if="username && username.length > 0"
        v-chat-scroll="{always: false, smooth: true}">
        <div class="row" v-for="message in messages" :key="message.id">
          <div class="two wide column">
            <div v-if="message.sender !== userId">
              <img class="ui medium image"
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png">
            </div>
          </div>
          <div class="twelve wide column">
            <div :class="{'float-left': message.sender !== userId,
              'float-right': message.sender === userId}">
              <p class="message">{{ message.content}}</p>
              <div class="date-label">{{ formatDate(message.createdAt) }}</div>
            </div>
          </div>
          <div class="two wide column">
            <div v-if="message.sender === userId">
              <img class="ui medium image"
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png">
            </div>
          </div>
        </div>
        <div class="row"
          v-if="messages.length === 0">
          <div class="column">
            No messages with this user. Send one now below!
          </div>
        </div>
      </div>
      <div id="no-chats"
        v-if="!username || username.length == 0">
        <div
          class="ui centered floating message">
          Click a chat to view messages.
        </div>
      </div>
      <div id="send">
        <div class="ui fluid action input">
          <input type="text" 
            placeholder="Send Message..."
            v-model="message"
            v-on:keydown.enter="sendMessage">
          <button
            class="ui green button"
            @click="sendMessage"
            :disabled="!$route.params.id">Send</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import store from '../../config/store';

export default {
  name: 'PatientMessageLog',
  props: ['username', 'messages', 'error', 'loading'],
  data() {
    return {
      message: '',
      userId: store.user.id
    };
  },
  methods: {
    formatDate(date) {
      date = new Date(date);
      if (date.toDateString() === new Date().toDateString()) {
        return date.toLocaleTimeString();
      }
      return date.toLocaleDateString();
    },
    sendMessage() {
      if (!this.message) {
        return;
      }
      this.$emit('sendMessage', this.message);
      this.message = '';
    },
  },
  watch: {
    username: function() {
      Vue.nextTick(() => {
        let log = this.$el.querySelector("#log");
        if (log) {
          log.scrollTop = log.scrollHeight;
        }
      });
    },
  },
};
</script>
<style scoped>
.patient-message-log {
  height: 100%;
}

.full-height {
  height: 70vh;
}

#log {
  height: calc(70vh - 3em - 2.5em - 3em);
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: .5em;
}

#send {
  height: 3em;
}

.float-left {
  float: left;
  text-align: left;
}
.float-right {
  float: right;
  text-align: right;
}

.message {
  margin-bottom: 3px;
}

.date-label {
  margin-top: 2px;
  font-weight: bold;
  font-size: .7em;
}

.float-left .date-label {
  float: left;
}

.float-right .date-label {
  float: right;
}

#no-chats {
  height: calc(70vh - 3em - 3em);
  vertical-align: middle;
  margin-bottom: -.5em;
}

.header {
  font-size: 2.5em;
}
</style>
