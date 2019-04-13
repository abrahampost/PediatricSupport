<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="ui header">Report User</div>
          <form class="ui form" @submit.prevent="createReport">
            <div id="form-content" class="field">
            <textarea
              type="text"
              rows="4"
              placeholder="Reason for report"
              v-model="description"
              required></textarea>
            </div>
            <div class="ui right aligned container">
              <div class="ui button" @click="closeModal()">Close</div>
              <button class="ui primary button" type="submit">Create</button>
            </div>
          </form>
          <div class="ui negative message" v-if="error">
            <div class="ui header">{{ error }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CreateReportModal',
  props: {
    otherUserId: String,
  },
  data() {
    return {
      description: '',
      error: '',
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    createReport() {
      this.error = '';

      this.$http
        .post('reports/', {
          reportedId: this.otherUserId,
          description: this.description,
        })
        .then(() => {
          this.$emit('close');
          this.description = '';
        })
        .catch((err) => {
          if (err && err.data && err.data.error) {
            this.error = err.data.error;
          } else {
            this.error = 'An unspecified error occurred when attempting to create the attribute.';
          }
        });
    },
  },
};
</script>
<style scoped>
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
  width: 40%;
  margin: 0px auto;
  padding: 2% 2%;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

#form-content {
  margin: 10% 1%;
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
