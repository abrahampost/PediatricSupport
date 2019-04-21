<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="ui tabular menu">
            <div
              class="item"
              @click="activeTab='summary'"
              v-bind:class="{active: activeTab==='summary'}"
            >Summary</div>
            <div
              class="item"
              @click="activeTab='biography'"
              v-bind:class="{active: activeTab==='biography'}"
            >Biography</div>
            <div
              class="item"
              @click="activeTab='conversation'"
              v-bind:class="{active: activeTab==='conversation'}"
            >Conversation</div>
          </div>
          <div id="content">
            <div class="ui form" v-if="activeTab==='summary'">
              <div class="ui field">
                <h4 class="ui left aligned header">Reported Username</h4>
                <input type="text" readonly v-model="report.reported_username">
              </div>
              <div class="ui field">
                <h4 class="ui left aligned header">Reporter Username</h4>
                <input type="text" readonly v-model="report.reporter_username">
              </div>
              <div class="ui field">
                <h4 class="ui left aligned header">Reason</h4>
                <textarea type="text" rows="3" readonly v-model="report.description"></textarea>
              </div>
            </div>
            <div class="ui stackable grid" v-if="activeTab==='biography'">
              <div class="four wide column">
                <div class="ui centered card">
                  <img class="ui medium image" :src="reportedAvatar">
                </div>
              </div>
              <div class="twelve wide column">
                <div class="ui form">
                  <div class="ui field">
                    <h4 class="ui left aligned header">Biography</h4>
                    <textarea
                      type="text"
                      rows="3"
                      readonly
                      v-model="reportedUserInformation.biography"
                    ></textarea>
                  </div>
                </div>
                <h4 class="ui left aligned header">Interests</h4>
                <div id="interest-list" class="ui segment">
                  <div
                    class="interest-list-item"
                    v-for="interest in reportedUserInformation.attributes"
                    :key="interest.id"
                  >{{ interest.name }}</div>
                  <h3
                    class="ui header"
                    v-if="reportedUserInformation.attributes.length == 0"
                  >No Interests Selected</h3>
                </div>
              </div>
            </div>
            <div id="log" class="ui middle aligned grid" v-if="activeTab==='conversation'">
              <div class="row" v-for="message in messages" :key="message.id">
                <div class="two wide column">
                  <div v-if="message.sender !== report.reporter_id">
                    <img class="ui medium image" :src="reportedAvatar">
                  </div>
                </div>
                <div class="twelve wide column">
                  <div
                    :class="{'float-left': message.sender !== report.reporter_id,
              'float-right': message.sender === report.reporter_id}"
                  >
                    <p class="message">{{ message.content}}</p>
                    <div class="date-label">{{ formatDate(message.createdAt) }}</div>
                  </div>
                </div>
                <div class="two wide column">
                  <div v-if="message.sender === report.reporter_id">
                    <img class="ui medium image" :src="reporterAvatar">
                  </div>
                </div>
              </div>
              <div class="row" v-if="messages.length === 0">
                <div class="column">No messages with this user.</div>
              </div>
            </div>
          </div>
          <div class="ui right aligned container">
            <div class="ui button" @click="closeModal()">Close</div>
            <div class="ui primary button" @click="resolveReport()">Resolve Report</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "ViewReportModal",
  props: {
    messages: undefined,
    reporterAvatar: undefined,
    reportedAvatar: undefined,
    report: undefined,
    reportedUserInformation: undefined
  },
  data() {
    return {
      activeTab: "summary"
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    resolveReport() {
      this.$emit("resolve");
    },
    formatDate(date) {
      date = new Date(date);
      if (date.toDateString() === new Date().toDateString()) {
        return date.toLocaleTimeString();
      }
      return date.toLocaleDateString();
    }
  }
};
</script>
<style scoped>
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

#content {
  min-height: 60vh;
}
#log {
  height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;
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
  border: 1px solid rgba(60, 60, 60, 0.26);
  border-radius: 1em;
  padding: 1em;
  margin: 0.25em 0.4em;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 75%;
  margin: 0px auto;
  padding: 2% 2%;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
