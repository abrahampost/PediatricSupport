<template>
  <div class="avatar">
    <canvas ref="canvasObj" width="235" height="330"></canvas>
    <div class="ui message" v-if="error" >
      <div class="header">
        Unable to draw Avatar
      </div>
      <p>{{ error }}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Avatar',
  props: ['accessories', 'clothes', 'hats', 'heads'],
  created() {
    this.draw();
  },
  data() {
    return {
      error: '',
    };
  },
  methods: {
    draw() {
      Promise.all([
        this.loadImage('heads'),
        this.loadImage('hats'),
        this.loadImage('clothes'),
        this.loadImage('accessories'),
      ]).then((images) => {
        // images will be drawn in the order they are listed above
        const canvas = this.$refs.canvasObj;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        images.forEach((image) => {
          ctx.drawImage(image, 0, 0);
        });
      }).catch((err) => {
        this.error = err;
      });
    },
    loadImage(feature) {
      return new Promise((resolve, reject) => {
        const loc = this.getPath(feature);
        const imageObj = new Image();
        imageObj.onload = () => resolve(imageObj);
        imageObj.onerror = () => reject();
        imageObj.src = loc;
      });
    },
    getPath(feature) {
      const imageLoc = 'avatarimages';
      const path = `${process.env.BASE_URL}${imageLoc}/${feature}/${this[feature]}.png`;
      return path;
    },
  },
  watch: {
    accessories: 'draw',
    clothes: 'draw',
    hats: 'draw',
    heads: 'draw',
  },
};
</script>
<style scoped>
canvas {
  width: 40%;
  height: auto;
}
</style>
