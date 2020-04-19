(function() {
  'use strict';

  const SlotMachinePanel = Vue.extend({
    data: function() {
      return {
        image: undefined,
        isStopped: true,
        timeoutId: undefined,
        unmatch: false,
      }
    },
    template: '<div class="slotmachine__panel"><img :src="image" class="slotmachine__panel-img" :class="{\'slotmachine__panel-img--unmatch\': unmatch}"/><div @click="stop" class="btn" :class="{\'btn--disabled\': isStopped}">STOP</div></div>',
    mounted: function() {
      this.image = this.getRandomImage();
    },
    methods: {
      activate: function() {
        this.unmatch = false;
      },
      getRandomImage: function() {
        const images = [
          'img/seven.png',
          'img/bell.png',
          'img/cherry.png',
        ];

        return images[Math.floor(Math.random() * images.length)];
      },
      spin: function() {
        this.isStopped = false;
        this.image     = this.getRandomImage();

        this.timeoutId = setTimeout(() => {
          this.spin();
        }, 50);
      },
      stop: function() {
        if (this.isStopped) { return; }

        clearTimeout(this.timeoutId);
        this.isStopped = true;
        this.$parent.panelsLeft--;

        if (this.$parent.panelsLeft === 0) {
          this.$parent.checkResults();
        }
      },
      isUnmatched: function(p1, p2) {
        return this.image !== p1.image && this.image !== p2.image;
      }
    }
  });

  new Vue({
    el: '#app',
    components: {
      'slotmachine-panel': SlotMachinePanel
    },
    data: {
      isRunning: false,
      panelsLeft: undefined,
    },
    methods: {
      spin: function() {
        if (this.isRunning) { return; }
        this.isRunning = true;

        this.panelsLeft = 3;
        
        const panels = [
          this.$refs.panel_1,
          this.$refs.panel_2,
          this.$refs.panel_3,
        ];

        panels.forEach(panel => {
          panel.spin();
          panel.activate();
        });
      },
      checkResults: function() {
        this.isRunning = false;
        
        const p1 = this.$refs.panel_1;
        const p2 = this.$refs.panel_2;
        const p3 = this.$refs.panel_3;

        if (p1.isUnmatched(p2, p3)) { p1.unmatch = true; }
        if (p2.isUnmatched(p1, p3)) { p2.unmatch = true; }
        if (p3.isUnmatched(p1, p2)) { p3.unmatch = true; }
      }
    }
  });
})();