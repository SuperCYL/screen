var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');
require('./index.css');
//var Chart = require('XXX');
function escape2Html(str) {
  var temp = document.createElement("div");
  temp.innerHTML = str;
  var output = temp.innerText || temp.textContent;
  temp = null;
  return output;
}
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
    var oMeta = document.createElement('meta');
    oMeta.name= 'referrer';
    oMeta.content= 'never';
    document.getElementsByTagName('head')[0].appendChild(oMeta);

    var html = `<div id="yqDetail" style="width:100%;height:100%;overflow:auto">`
    html+=`<p style="font-size:44px!important;text-indent: 0!important;">${data.doctitle.length>20?data.doctitle.substr(0,20)+"...":data.doctitle}</p>`
    html += `<p style="font-size:28px!important;line-height:60px;text-indent: 0!important;">${data.docpubtime}</p>`
    html+= `<p style="letter-spacing: 2px;text-indent: 2.2em;font-size:30px;line-height:60px;">${data["abstractTag"]}</p>`

    // if(data.yqType == "1"){
    //   html+= `<div style="font-size:30px;line-height:55px;">${data.irContent}</div>`
    // }else{
      let cont = data.irContent.replace(/\s+\s+/g,'<br/><br/><span style="display:inline-block;width:32px"></span>');
      cont = cont.replace(/>;/g,'>');
      cont = escape2Html(cont);
      html+= `<div style="font-size:30px;line-height:60px;">${cont}</div>`
    // }
    
    //更新图表
    
    html += `</div>`
    //this.chart.render(data, cfg);
    this.container.html(html)
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