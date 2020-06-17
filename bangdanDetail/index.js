var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');
//var Chart = require('XXX');
var bangdanDetailContSwiper = require('./swiper.min.js');
require('./swiper.min.css');
require('./index.css');

/**
 * 马良基础类
 */
module.exports = Event.extend(function Base(container, config) {
  this.config = {
    theme: {}
  }
  this.container = $(container);           //容器
  this.apis = config.apis;                 //hook一定要有
  this._data = null;                       //数据
  this.chart = null;                       //图表
  this.init(config);
}, {
  /**
   * 公有初始化
   */
  init: function (config) {
    //1.初始化,合并配置
    this.mergeConfig(config);
    //2.刷新布局,针对有子组件的组件 可有可无
    this.updateLayout();
    //3.子组件实例化
    //this.chart = new Chart(this.container[0], this.config);
    //4.如果有需要, 更新样式
    this.updateStyle();
  },
  /**
   * 绘制
   * @param data
   * @param options 不一定有
   * !!注意: 第二个参数支持config, 就不需要updateOptions这个方法了
   */
  render: function (data, config) {
    data = this.data(data);
    var textC = [];
    if(data.content && data.content.indexOf("\\n") !== -1){
      textC = data.content.split('\\n');
    }else{
      textC.push(data.content);
    }

    var img = data.photoUrls?data.photoUrls:[];
    //更新图表
    var html = `<div id="bangdanDetailCont">
                <div class="swiper-container bangdanDetailContent">
                <div class="swiper-wrapper">
                <div class="swiper-slide bangdanDetailSlide">`

    if(data.contentType != 3){
      html+= `<p style="font-size:36px;">${data.title}</p>`
      html+= `<p><span>${data.author}</span><span style="margin-left:30px;">${data.releaseTime.substr(5, 11)}</span></p>`
      

      if(data.content){ //文字

        for(var i =0;i<textC.length;i++){
          html+=`<p style="text-indent: 2.2em;font-size:24px;line-height:40px;letter-spacing:4px;margin-bottom:10px;">${textC[i]}</p>`
        }
        
      }

      if(data.photoUrls){ //图片

        for(var i =0;i<img.length;i++){
          
            html+= `<img style="width:100%;height:300px;" src="${img[i]}" />`
        }

      }

      if(data.photoUrls && data.content){ //图片和文字

        for(var i =0;i<textC.length;i++){
          html+=`<p style="text-indent: 2.2em;font-size:24px;line-height:40px;letter-spacing:4px;margin-bottom:10px;">${textC[i]}</p>`
          if(img[i]){
            html+= `<img style="width:100%;height:300px;" src="${img[i]}" />`
          }
        }

      }

    }
    

    html += `</div></div></div></div>`
    
    this.container.html(html);

    let h = document.getElementsByClassName("bangdanDetailSlide")[0].offsetHeight;

    new bangdanDetailContSwiper('#bangdanDetailCont .bangdanDetailContent', {
      direction: 'vertical',
      slidesPerView: 'auto',
      autoplay:{
        delay: 1500,
      },
      speed:600*h,
      freeMode: true,
      scrollbar: {
        el: '.swiper-scrollbar',
      },
      mousewheel: true,
    });


    //如果有需要的话,更新样式
    this.updateStyle();
  },
  /**
   *
   * @param width
   * @param height
   */
  resize: function (width, height) {
    this.updateLayout(width, height);
    //更新图表
    //this.chart.render({
    //  width: width,
    //  height: height
    //})
  },
  /**
   * 每个组件根据自身需要,从主题中获取颜色 覆盖到自身配置的颜色中.
   * 暂时可以不填内容
   */
  setColors: function () {
    //比如
    //var cfg = this.config;
    //cfg.color = cfg.theme.series[0] || cfg.color;
  },
  /**
   * 数据,设置和获取数据
   * @param data
   * @returns {*|number}
   */
  data: function (data) {
    if (data) {
      this._data = data;
    }
    return this._data;
  },
  /**
   * 更新配置
   * 优先级: config.colors > config.theme > this.config.theme > this.config.colors
   * [注] 有数组的配置一定要替换
   * @param config
   * @private
   */
  mergeConfig: function (config) {
    if (!config) {return this.config}
    this.config.theme = _.defaultsDeep(config.theme || {}, this.config.theme);
    this.setColors();
    this.config = _.defaultsDeep(config || {}, this.config);
    return this.config;
  },
  /**
   * 更新布局
   * 可有可无
   */
  updateLayout: function () {},
  /**
   * 更新样式
   * 有些子组件控制不到的,但是需要控制改变的,在这里实现
   */
  updateStyle: function () {
    var cfg = this.config;
    this.container.css({
      'font-size': cfg.size + 'px',
      'color': cfg.color || '#fff'
    });
  },
  /**
   * 更新配置
   * !!注意:如果render支持第二个参数options, 那updateOptions不是必须的
   */
  //updateOptions: function (options) {},
  /**
   * 更新某些配置
   * 给可以增量更新配置的组件用
   */
  //updateXXX: function () {},
  /**
   * 销毁组件
   */
   destroy: function(){console.log('请实现 destroy 方法')}
});