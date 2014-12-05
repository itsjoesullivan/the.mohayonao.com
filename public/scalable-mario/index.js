(function() {
  $(function() {
    'use strict';
    var MML_DATA, app, items, scale, scales, vue;
    MML_DATA = 't104 l16 q4 $\no6 eere rcer gr8. > gr8.<\no6 cr8>gr8er rarb rb-ar l12g<eg l16arfg rerc d>br8<\no6 cr8>gr8er rarb rb-ar l12g<eg l16arfg rerc d>br8<\no6 r8gg-fd+re r>g+a<c r>a<cd r8gg-fd+re < rcrc cr8.> r8gg-fd+re r>g+a<c r>a<cd r8e-r8dr8cr8.r4\no6 r8gg-fd+re r>g+a<c r>a<cd r8gg-fd+re < rcrc cr8.> r8gg-fd+re r>g+a<c r>a<cd r8e-r8dr8cr8.r4\no6 ccrc rcdr ecr>a gr8.< ccrc rcde r2 ccrc rcdr ecr>a gr8.<\no6 eere rcer gr8. > gr8.<\no6 cr8>gr8er rarb rb-ar l12g<eg l16arfg rerc d>br8<\no6 cr8>gr8er rarb rb-ar l12g<eg l16arfg rerc d>br8<\no6 ecr>g r8g+r a<frf> ar8. l12b<aa agf l16ecr>a gr8.< ecr>g r8g+r a<frf> ar8. l12b<ff fed l16c>grg cr8.<\no6 ecr>g r8g+r a<frf> ar8. l12b<aa agf l16ecr>a gr8.< ecr>g r8g+r a<frf> ar8. l12b<ff fed l16c>grg cr8.<\no6 ccrc rcdr ecr>a gr8.< ccrc rcde r2 ccrc rcdr ecr>a gr8.;\n\nt104 l16 q4 $\no5 f+f+rf+ rf+f+r gr8. >gr8.\no5 er8cr8>gr <rcrd rd-cr l12cg<c l16cr>ab rgre fdr8\no5 er8cr8>gr <rcrd rd-cr l12cg<c l16cr>ab rgre fdr8\no6 r8ee-d>b<rc r>efa rfab< r8ee-d>b<rc rgrg gr8. r8ee-d>b<rc r>efa rfab< r8cr8>fr8er8.r4\no6 r8ee-d>b<rc r>efa rfab< r8ee-d>b<rc rgrg gr8. r8ee-d>b<rc r>efa rfab< r8cr8>fr8er8.r4\no5 a-a-ra- ra-b-r <c>grf er8. a-a-ra- ra-b-g r2 a-a-ra- ra-b-r <c>grf er8.\no5 f+f+rf+ rf+f+r gr8. >gr8.\no5 er8cr8>gr <rcrd rd-cr l12cg<c l16cr>ab rgre fdr8\no5 er8cr8>gr <rcrd rd-cr l12cg<c l16cr>ab rgre fdr8\no6 c>gre r8er  f<drd> fr8. l12g<ff fed l16c>grf er8.< c>gre r8er  f<drd> fr8. l12g<dd dc>b l16er8.r4\no6 c>gre r8er  f<drd> fr8. l12g<ff fed l16c>grf er8.< c>gre r8er  f<drd> fr8. l12g<dd dc>b l16er8.r4\no5 a-a-ra- ra-b-r <c>grf er8. a-a-ra- ra-b-g r2 a-a-ra- ra-b-r <c>grf er8.;\n\nt104 l16 q4 $\no4 ddrd rddr <br8.>gr8.\no4 gr8er8cr rfrg rg-fr l12e<ce l16frde rcr>a bgr8\no4 gr8er8cr rfrg rg-fr l12e<ce l16frde rcr>a bgr8\no4 cr8gr8<cr >fr8<ccr>fr cr8er8g<c < rfrf fr >>gr cr8gr8<cr >fr8<ccr>fr> a-r<a-r> b-<b-r8> l16cr8>g grcr\no4 cr8gr8<cr >fr8<ccr>fr cr8er8g<c < rfrf fr >>gr cr8gr8<cr >fr8<ccr>fr> a-r<a-r> b-<b-r8> l16cr8>g grcr\no3 /: a-r8<e-r8a-r gr8cr8>gr :/3\no4 ddrd rddr <br8.>gr8.\no4 gr8er8cr rfrg rg-fr l12e<ce l16frde rcr>a bgr8\no4 gr8er8cr rfrg rg-fr l12e<ce l16frde rcr>a bgr8\no4 crre gr<cr> fr<cr cc>fr drrf grbr gr<cr cc>gr crre gr<cr> fr<cr cc>fr grrg l12gab l16 <cr>gr cr8.\no4 crre gr<cr> fr<cr cc>fr drrf grbr gr<cr cc>gr crre gr<cr> fr<cr cc>fr grrg l12gab l16 <cr>gr cr8.\no3 /: a-r8<e-r8a-r gr8cr8>gr :/3';
    app = new ScalableSequencer(MML_DATA);
    scales = ScalableSequencer.scales;
    vue = new Vue({
      el: '#app',
      data: {
        isPlaying: false,
        scale: '',
        scales: Object.keys(scales).map(function(key) {
          return {
            key: key,
            name: scales[key].name
          };
        })
      },
      methods: {
        play: function() {
          this.isPlaying = !this.isPlaying;
          if (this.isPlaying) {
            return app.start();
          } else {
            return app.stop();
          }
        },
        random: function(type) {
          return this.scale = Object.keys(scales).choose();
        },
        tweet: function() {
          var scaleName, text, url;
          scaleName = scales[this.scale].name;
          url = location.href;
          text = utils.lang({
            ja: "" + scaleName + " なマリオの曲",
            '': "Mario theme in " + scaleName + " mode"
          });
          return utils.tweet({
            text: text,
            url: url
          });
        }
      }
    });
    vue.$watch('scale', function(val) {
      window.location.replace("#" + this.scale);
      return app.setScale(val);
    });
    if (location.hash) {
      items = location.hash.substr(1).split(',');
      scale = items[0] || '';
    }
    if (!scales.hasOwnProperty(scale)) {
      scale = 'major';
    }
    vue.scale = scale;
    return 0;
  });

}).call(this);
