var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');
//var Chart = require('XXX');
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
    clearInterval(jProductDetailtimer);
    var d = [];
    if(data.content && data.content.indexOf("\\n") !== -1){
      d = data.content.split('\\n');
    }else{
      d.push(data.content);
    }
    var v = data.videoUrls?data.videoUrls:[];
    var img = data.photoUrls?data.photoUrls:[];
    //更新图表
    var html = `<div id="jProductDetail">`
    if(data.contentType == 3){
      html+=`<video width="464" height="488" controls="controls" autoplay="autoplay">
      <source src="${v[0]}" type="video/mp4">
    </video>`
    }else{
      html+= `<p style="font-size:36px;">${data.title}</p>`
      html+= `<p><span>${data.author}</span><span style="margin-left:30px;">${data.releaseTime.substr(5, 11)}</span></p>`
      if(!data.photoUrls && data.content && (!data.videoUrls||data.videoUrls.length==0)){ //内容
        for(var i =0;i<d.length;i++){
          html+=`<p style="text-indent: 2.2em;font-size:24px;line-height:44px;letter-spacing:4px;margin-bottom:10px;">${d[i]}</p>`
        }
      }
  
      else if(data.photoUrls && data.content && (!data.videoUrls||data.videoUrls.length==0)){ //图片和文字
        for(var i =0;i<d.length;i++){
          html+=`<p style="text-indent: 2.2em;font-size:24px;line-height:40px;letter-spacing:4px;margin-bottom:10px;">${d[i]}</p>`
          if(img[i]){
            html+= `<img style="width:100%;height:300px;" src="${img[i]}" />`
          }
        }
      }
  
      else if(!data.photoUrls && !data.content && data.videoUrls.length > 0){ //视频
        for(var i =0;i<v.length;i++){
          html+=`<video width="100%" height="300" controls>
            <source src="${v[i]}" type="video/mp4">
          </video>`
        }
      }
  
      else if(!data.photoUrls && data.content && data.videoUrls.length > 0){ //视频和内容
        for(var i =0;i<d.length;i++){
          html+=`<p style="text-indent: 2.2em;font-size:24px;line-height:40px;letter-spacing:4px;margin-bottom:10px;">${d[i]}</p>`
          if(v[i]){
            html+=`<video width="100%" height="300" controls>
              <source src="${v[i]}" type="video/mp4">
            </video>`
          }
          
        }
      }

      else if(!data.videoUrls && !data.content && data.photoUrls.length > 0){ //只有图片
        for(var i =0;i<img.length;i++){
            html+= `<img style="width:100%;height:300px;margin-top:20px;" src="${img[i]}" />`
        }
      }
      else{  //都有
        for(var i =0;i<v.length;i++){
          html+=`<video width="100%" height="300" controls>
            <source src="${v[i]}" type="video/mp4">
          </video>`
          if(d[i]){
            html+=`<p style="text-indent: 2.2em;font-size:24px;line-height:40px;letter-spacing:4px;margin-bottom:10px;">${d[i]}</p>`
          }
         
          if(img[i]){
            html+= `<img style="width:100%;height:300px;" src="${img[i]}" />`
          }
        }
      }

    }
    

    html += `</div>`
    
    this.container.html(html);


    var newTop ; 
    //使用定时器
    var jProductDetailtimer = setInterval(function(){
    //文本是否已经到底部（底部出现在浏览器窗口中）
      if($('#jProductDetail').height()<488){
          //清除定时器
        clearInterval(jProductDetailtimer);

    }else{
        //每次在原来的基础上移动
      newTop =  $("#jProductDetail").scrollTop();
          $("#jProductDetail").scrollTop(newTop + 5);
        }
    },700);


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