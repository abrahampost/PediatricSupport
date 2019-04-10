<template>
  <div class="avatar">
    <div class="ui segment">
      <canvas ref="canvasObj" width="235" height="330"></canvas>
      <div class="ui active inverted dimmer" v-if="loading">
        <div class="ui text loader">Loading</div>
      </div>
      <div class="ui message" v-if="error" >
        <div class="header">
          Unable to draw Avatar
        </div>
        <p>{{ error }}</p>
      </div>
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
      loading: false,
      error: '',
    };
  },
  methods: {
    draw() {
      Promise.all([
        this.loadImage('heads'),
        this.loadImage('hats'),
        this.loadImage('accessories'),
        this.loadImage('clothes'),
      ]).then((images) => {
        console.log("painting images!");
        //images will be drawn in the order they are listed above
        let canvas = this.$refs['canvasObj'];
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        images.forEach((image) => {
          ctx.drawImage(image, 0, 0);
        });
      }).catch((err) => {
        console.log(err);
        this.error = err;
      });
    },
    loadImage(feature) {
      return new Promise((resolve, reject) => {
        let loc = this.getPath(feature)
        let imageObj = new Image();
        imageObj.onload = () => resolve(imageObj);
        imageObj.onerror = (err) => console.error(err);
        imageObj.src = loc;
      });
    },
    getPath(feature) {
      const imageLoc = 'avatarimages';
      let path = `${process.env.BASE_URL}${imageLoc}/${feature}/${this[feature]}.png`
      return path;
    }
  },
  watch: {
    'accessories': 'draw',
    'clothes': 'draw',
    'hats': 'draw',
    'heads': 'draw',
  }
}
</script>
<style scoped>
canvas {
  width: 30%;
  height: auto;
}
</style>
