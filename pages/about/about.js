//logs.js
const util = require('../../utils/util.js')

Page({
   data: {
      logs: [],
      isPlay: false,
      playState: null,
      currentPosition: 0,
      duration: 0,
      musicTime: '',
      timer: null
   },
   onLoad: function() {
      this.setData({
         logs: (wx.getStorageSync('logs') || []).map(log => {
            return util.formatTime(new Date(log))
         })
      })
   },
   previewImage: function(e) {
      let url = e.target.dataset.url;
      wx.previewImage({
         current: url, // 当前显示图片的http链接
         urls: [url] // 需要预览的图片http链接列表
      });
   },
   openMap: function() {
      wx.getLocation({
         type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
         success: res => {
            wx.openLocation({
               latitude: 22.54999, // 纬度，范围为-90~90，负数表示南纬
               longitude: 113.95066, // 经度，范围为-180~180，负数表示西经
               scale: 28 // 缩放比例
            });
         }
      });
   },
   playMusic: function() {
      clearInterval(this.timer);
      this.timer = null;
      this.isPlay = !this.isPlay;
      console.log(this.isPlay);
      if (this.isPlay) {
         // 播放音乐
         wx.playBackgroundAudio({
            dataUrl: 'http://www.pengmengshan.cn/pms/audio/hktk%20.mp3',
            title: '海阔天空',
            coverImgUrl: 'http://www.pengmengshan.cn/img/huangjiaju.jpg'
         });
         this.getTime();

      } else {
         // 暂停播放音乐
         wx.pauseBackgroundAudio();
      }
   },

   getTime: function() {
      var that = this;
      var timer = setInterval(function() {
         // 获取后台音乐播放状态
         wx.getBackgroundAudioPlayerState({
            success: function(res)  {
               that.playState = res;
               console.log(that.playState);
               that.musicTime = that.secondToDate(res.duration);
               this.musicTime = that.secondToDate(res.duration);
               console.log(this.musicTime);

            }
         });
      }, 300);

      that.timer = timer;
      console.log(that.timer, 123);
   },

   secondToDate: function(result) {
      var m = Math.floor((result / 60) % 60);
      var s = Math.floor(result % 60);
      if (s < 10) {
         s = '0' + s;
      }
      return (result = m + ':' + s);
   },
   onReady: function() {
      var that = this;
      // 监听音乐播放
      wx.onBackgroundAudioPlay(() => {
         console.log('监听音乐播放');

      });
      // 监听音乐停止
      wx.onBackgroundAudioStop(res => {
         clearInterval(this.timer);
         this.isPlay = false;
         this.timer = null;
         console.log('监听音乐停止', res);
      });
      // 监听音乐暂停
      wx.onBackgroundAudioPause(res => {
         clearInterval(this.timer);
         this.isPlay = false;
         this.timer = null;
         console.log('监听音乐暂停', res);
      });
   }


})
