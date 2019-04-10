<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <h3>Avatar<i class="right floated red window close icon" @click="closeModal"></i></h3>
          <Avatar
            :accessories="accessories"
            :clothes="clothes"
            :hats="hats"
            :heads="heads"
          />
          <div class="ui form">
            <div class="field">
              <label>Accessories</label>
              <input type="range" v-model="accessories" min="1" max="4">
            </div>
            <div class="field">
              <label>Clothes</label>
              <input type="range" v-model="clothes" min="1" max="4">
            </div>
            <div class="field">
              <label>Hats</label>
              <input type="range" v-model="hats" min="1" max="4">
            </div>
            <div class="field">
              <label>Heads</label>
              <input type="range" v-model="heads" min="1" max="4">
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Avatar from '@/components/Avatar.vue';

export default {
  name: 'EditAvatarModal',
  components: {
    Avatar
  },
  data() {
    return {
      accessories: "1",
      clothes: "1",
      heads: "1",
      hats: "1",
    };
  },
  methods: {
    closeModal() {
      console.log("attempting to close");
      this.$emit('close');
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
  width: 50%;
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
