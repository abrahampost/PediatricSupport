<template>
  <div class="patient-message-log">
    <div class="ui segment full-height">
      <div class="ui middle aligned grid container" v-if="username">
        <div class="two wide column"></div>
        <div class="twelve wide column">
          <h3 class="ui header">Chat with {{ username }}</h3>
        </div>
        <div class="two wide column">
          <div class="dropdown" v-on-clickaway="hideMoreOptions">
            <div class="ui icon button" tabindex="0" @click="showMoreOptions=!showMoreOptions">
              <i class="ellipsis horizontal icon"></i>
            </div>
            <div class="dropdown-content" v-if="showMoreOptions">
              <div class="ui button" @click="showReportModal">Report User</div>
            </div>
          </div>
        </div>
      </div>
      <CreateReportModal v-if="showReport" v-on:close="showReport=false" v-bind:otherUserId="otherUserId">
      </CreateReportModal>
      <div
        id="log"
        class="ui middle aligned grid"
        v-if="$route.params.id"
        v-chat-scroll="{always: false, smooth: true}"
      >
        <div class="row" v-for="message in messages" :key="message.id">
          <div class="two wide column">
            <div v-if="message.sender !== userId">
              <img
                class="ui medium image"
                src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              >
            </div>
          </div>
          <div class="twelve wide column">
            <div
              :class="{'float-left': message.sender !== userId,
              'float-right': message.sender === userId}"
            >
              <p class="message">{{ message.content}}</p>
              <div class="date-label">{{ formatDate(message.createdAt) }}</div>
            </div>
          </div>
          <div class="two wide column">
            <div v-if="message.sender === userId">
              <img
                class="ui medium image"
                src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              >
            </div>
          </div>
        </div>
        <div class="row" v-if="messages.length === 0">
          <div class="column">No messages with this user. Send one now below!</div>
        </div>
      </div>
      <div id="no-chats" v-if="!$route.params.id">
        <div class="ui centered floating message">Click a chat to view messages.</div>
      </div>
      <div id="send">
        <div class="ui fluid action input">
          <input
            type="text"
            placeholder="Send Message..."
            v-model="message"
            v-on:keydown.enter="sendMessage"
          >
          <button class="ui green button" @click="sendMessage" :disabled="!$route.params.id">Send</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import store from "../../config/store";
import { mixin as clickaway } from "vue-clickaway";
import CreateReportModal from "@/views/patient/CreateReportModal.vue";

export default {
  name: "PatientMessageLog",
  props: ["username", "messages", "error", "otherUserId"],
  mixins: [clickaway],
  components: {
    CreateReportModal
  },
  data() {
    return {
      message: "",
      userId: store.user.id,
      showMoreOptions: false,
      showReport: false
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
      this.$emit("sendMessage", this.message);
      this.message = "";
    },
    hideMoreOptions() {
      this.showMoreOptions = false;
    },
    showReportModal() {
      this.showReport = true;
      this.showMoreOptions = false;
    }
  },
  watch: {
    username: function() {
      Vue.nextTick(() => {
        let log = this.$el.querySelector("#log");
        if (log) {
          log.scrollTop = log.scrollHeight;
        }
      });
    }
  }
};
</script>
<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  position: absolute;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  right: 0;
  list-style-type: none;
  margin: 0;
  padding-left: 0;
  border-radius: 5px;
}

.dropdown-content div {
  color: black;
  padding: 10% 15%;
  min-width: 10em;
  text-align: right;
  white-space: nowrap;
  margin-right: 0;
}

.dropdown-content li:hover {
  background-color: #ddd;
}

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
  margin-bottom: 0.5em;
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
  font-size: 0.7em;
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
  margin-bottom: -0.5em;
}

.header {
  font-size: 2.5em;
}
</style>
