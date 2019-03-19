<template>
  <div class="patient-messages">
    <div class="ui stackable middle aligned grid container padding-top">
      <div class="four wide column">
        <div id="chats" class="ui fluid card">
          <div class="content">
            <h1 class="header">Chats</h1>
          </div>
          <div id="users" class="content">
            <h2 class="header" v-if="conversations.length === 0">
              No Matches Yet
            </h2>
            <div class="ui middle aligned selection list" v-if="conversations.length > 0">
              <div class="item"
                v-for="conversation in conversations"
                :key="conversation.id"
                @click="selectedConversationId = conversation.id">
                <img class="ui avatar image" src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png">
                <router-link class="content"
                    :to="{name:'patientMessagesWithUser', params: {id: conversation.id}}">
                  <a>{{ conversation.username }}</a>
                  <div class="description">
                    {{ conversation.lastMessageDate ?
                      formatDate(conversation.lastMessageDate) : 'no messages yet' }}
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
          v-on:sendMessage="sendMessage($event)"/>
      </div>
    </div>
  </div>
</template>
<script>
import MessageLog from './MessageLog.vue';

export default {
  name: 'PatientMessages',
  data() {
    return {
      conversations: [
        {
          id: 1,
          username: 'BuffTurtle12',
          lastMessageDate: new Date(),
          messages: [{
            type: 'received',
            content: 'Hello! My name is Billie.',
            createdAt: new Date(),
          },
          {
            type: 'received',
            content: 'How are you?',
            createdAt: new Date(),
          },
          {
            type: 'sent',
            content: 'Good, and you?',
            createdAt: new Date(),
          }],
        },
        {
          id: 2,
          username: 'BigApple76',
          lastMessageDate: new Date(),
          messages: [{
            type: 'received',
            content: 'Hello! My name is Sandy.',
            createdAt: new Date(),
          },
          {
            type: 'received',
            content: 'How are you?',
            createdAt: new Date(),
          },
          {
            type: 'sent',
            content: 'Good, and you?',
            createdAt: new Date(),
          }],
        },
        {
          id: 3,
          username: 'SmartDog64',
          lastMessageDate: new Date(),
          messages: [{
            type: 'received',
            content: 'Hello! My name is Carlos.',
            createdAt: new Date(),
          },
          {
            type: 'received',
            content: 'How are you?',
            createdAt: new Date(),
          },
          {
            type: 'sent',
            content: 'Good, and you?',
            createdAt: new Date(),
          }],
        },
        {
          id: 4,
          username: 'HappyClam14',
          lastMessageDate: new Date(),
          messages: [{
            type: 'received',
            content: 'Hello! They call me the space cowboy.',
            createdAt: new Date(),
          },
          {
            type: 'received',
            content: 'How are you?',
            createdAt: new Date(),
          },
          {
            type: 'sent',
            content: 'Good, and you?',
            createdAt: new Date(),
          }],
        },
        {
          id: 5,
          username: 'LittleWhale25',
          lastMessageDate: new Date(),
          messages: [{
            type: 'received',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin facilisis ante ut tellus vehicula, a pellentesque massa scelerisque. Praesent et lacinia enim. Proin varius in velit nec consequat. Nam vel sagittis neque. Sed in risus malesuada, interdum urna sit amet, eleifend nibh. Integer eget aliquam erat. Integer vehicula non felis nec gravida. Vestibulum pretium, risus ac porttitor lacinia, tellus lorem efficitur mi, eget commodo magna nibh a augue. Nulla mauris leo, iaculis in diam non, rhoncus pulvinar risus.',
            createdAt: new Date(),
          },
          {
            type: 'received',
            content: 'How are you?',
            createdAt: new Date(),
          },
          {
            type: 'sent',
            content: 'Good, and you?',
            createdAt: new Date(),
          }],
        },
        {
          id: 6,
          username: 'SmallPuppy3',
          lastMessageDate: new Date(),
          messages: [{
            type: 'received',
            content: 'Hello! I am Cameron Newton.',
            createdAt: new Date(),
          },
          {
            type: 'received',
            content: 'How are you?',
            createdAt: new Date(),
          },
          {
            type: 'sent',
            content: 'Good, and you?',
            createdAt: new Date(),
          }],
        },
        {
          id: 7,
          username: 'SwiftHare27',
          lastMessageDate: new Date(),
          messages: [{
            type: 'received',
            content: 'The name is Bond. James, Bond.',
            createdAt: new Date(),
          },
          {
            type: 'received',
            content: 'How are you?',
            createdAt: new Date(),
          },
          {
            type: 'sent',
            content: 'Good, and you?',
            createdAt: new Date(),
          }],
        },
      ],
    };
  },
  components: {
    MessageLog,
  },
  computed: {
    selectedConversation() {
      if (this.$route.params.id) {
        return this.conversations.find(c => c.id === this.$route.params.id);
      }
      return {
        username: '',
        messages: [],
      };
    },
  },
  methods: {
    formatDate(date) {
      if (date.toDateString() === new Date().toDateString()) {
        return date.toLocaleTimeString();
      }
      return date.toLocaleDateString();
    },
    sendMessage(message) {
      let newMessage = {
        type: 'sent',
        content: message,
        createdAt: new Date()
      };
      let conversation = this.conversations.find(c => c.id === this.$route.params.id);
      conversation.messages.push(newMessage);
    }
  },
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
