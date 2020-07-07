var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');
require('./index.css')
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
    var cfg = this.mergeConfig(config);
    let that = this;
    var html = `
          <div id="leaderEmotionCloudBig">
          <div class="tagcloud" style="width:100%;height:100%;">`
            for(var i=0;i<data.length;i++){
              if(data[i]["rankId"] == 1){
                html+=`<span class="tagcloudItem b${i}" index="${i}" eventId="${data[i]["eventId"]}" style="font-size:97px;color:#FFA633">${data[i]["title"]}</span>`
              }
              else if(data[i]["rankId"] == 2 || data[i]["rankId"] == 3 || data[i]["rankId"] == 4 ||data[i]["rankId"] == 5){
                html+=`<span class="tagcloudItem b${i}" index="${i}" eventId="${data[i]["eventId"]}" style="font-size:90px;color:#FFA633">${data[i]["title"]}</span>`
              }
              else if(data[i]["rankId"] == 6 || data[i]["rankId"] == 7 || data[i]["rankId"] == 8){
                html+=`<span class="tagcloudItem b${i}" index="${i}" eventId="${data[i]["eventId"]}" style="font-size:80px;color:#21F0F3">${data[i]["title"]}</span>` 
              }
              // else if(data[i]["rankId"] == 3){
              //   html+=`<span class="tagcloudItem b${i}" index="${i}" eventId="${data[i]["eventId"]}" style="font-size:73px;color:#F9C824">${data[i]["title"]}</span>` 
              // }
              else{
                html+=`<span class="tagcloudItem b${i}" index="${i}" eventId="${data[i]["eventId"]}" style="font-size:58px;color:#FFFFFF">${data[i]["title"]}</span>` 
              }
            }
            
        html+=`</div> </div>`  

   
    //更新图表
    //this.chart.render(data, cfg);
    this.container.html(html)
    
    //如果有需要的话,更新样式

    $("#leaderEmotionCloudBig .tagcloudItem").click(function(event){
      event.stopPropagation(); 
      console.log($(this).attr("eventId"));
      let index = $(this).attr("index");

      if(index == 0||index == 1 || index == 2 || index == 3 ||index == 4){
        $(this).css("text-shadow","0 0 10px #F74C64,0 0 20px #F74C64,0 0 30px #F74C64,0 0 60px #F74C64");
      }else if(index == 5 || index == 6 || index == 7){
        $(this).css("text-shadow","0 0 10px #21F0F3,0 0 20px #21F0F3,0 0 30px #21F0F3,0 0 60px #21F0F3");
      }
      // else if(index == 2){
      //   $(this).css("text-shadow","0 0 10px rgb(249, 200, 36),0 0 20px rgb(249, 200, 36),0 0 30px rgb(249, 200, 36),0 0 60px rgb(249, 200, 36)");
      // }
      else{
        $(this).css("text-shadow","0 0 10px #fff,0 0 20px #fff,0 0 30px #fff,0 0 60px #fff");
      }

      $(this).siblings("span").css("text-shadow","none");
      that.emit('click', {eventId:$(this).attr("eventId")}); 
    })
    $("#leaderEmotionCloudBig").click(function(){
      console.log("全部")
      $("#leaderEmotionCloudBig .tagcloudItem").css("text-shadow","none");
      that.emit('click', {eventId:""}); 
    })
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