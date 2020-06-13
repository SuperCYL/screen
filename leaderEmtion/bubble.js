/*
* 3d鏍囩浜�
* 鍔熻兘锛氶紶鏍囩Щ鍏ユ爣绛撅紝褰撳墠鏍囩闈欐鏀惧ぇ
* 璇存槑锛�
* */

window.tagcloud = (function(win, doc) { // ns
    // 鍒ゆ柇瀵硅薄
    function isObject (obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }

    // 鏋勯€犲嚱鏁�
    function TagCloud (options) {
        var self = this;

        self.config = TagCloud._getConfig(options);
        self.box = self.config.element;   //缁勪欢鍏冪礌
        self.fontsize = self.config.fontsize; //骞冲潎瀛椾綋澶у皬
        self.radius = self.config.radius; //婊氬姩鍗婂緞
        self.depth = 2 * self.radius;   //婊氬姩娣卞害
        self.size = 2 * self.radius;    //闅忛紶鏍囨粴鍔ㄥ彉閫熶綔鐢ㄥ尯鍩�

        self.mspeed = TagCloud._getMsSpeed(self.config.mspeed);
        self.ispeed = TagCloud._getIsSpeed(self.config.ispeed);
        self.items = self._getItems();

        self.direction = self.config.direction;   //鍒濆婊氬姩鏂瑰悜
        self.keep = self.config.keep; //榧犳爣绉诲嚭鍚庢槸鍚︿繚鎸佷箣鍓嶆粴鍔�

        //鍒濆鍖�
        self.active = false;   //鏄惁涓烘縺娲荤姸鎬�
        self.lasta = 1;
        self.lastb = 1;
        self.mouseX0 = self.ispeed * Math.sin(self.direction * Math.PI / 180);    //榧犳爣涓庢粴鍔ㄥ渾蹇儀杞村垵濮嬭窛绂�
        self.mouseY0 = -self.ispeed * Math.cos(self.direction * Math.PI / 180);   //榧犳爣涓庢粴鍔ㄥ渾蹇儁杞村垵濮嬭窛绂�
        self.mouseX = self.mouseX0;   //榧犳爣涓庢粴鍔ㄥ渾蹇儀杞磋窛绂�
        self.mouseY = self.mouseY0;   //榧犳爣涓庢粴鍔ㄥ渾蹇儁杞磋窛绂�
        self.index = -1;

        //榧犳爣绉诲叆
        TagCloud._on(self.box, 'mouseover', function () {
            self.active = true;
        });
        //榧犳爣绉诲嚭
        TagCloud._on(self.box, 'mouseout', function () {
            self.active = false;
        });

        //榧犳爣鍦ㄥ唴绉诲姩
        TagCloud._on(self.keep ? win : self.box, 'mousemove', function (ev) {
            var oEvent = win.event || ev;
            var boxPosition = self.box.getBoundingClientRect();
            self.mouseX = (oEvent.clientX - (boxPosition.left + self.box.offsetWidth / 2)) / 5;
            self.mouseY = (oEvent.clientY - (boxPosition.top + self.box.offsetHeight / 2)) / 5;
        });

        for (var j = 0, len = self.items.length; j < len; j++) {
            self.items[j].element.index=j;

            //榧犳爣绉诲嚭瀛愬厓绱�,褰撳墠鍏冪礌闈欐鏀惧ぇ
            self.items[j].element.onmouseover = function(){
                self.index = this.index;
            };

            //榧犳爣绉诲嚭瀛愬厓绱�,褰撳墠鍏冪礌缁х画婊氬姩
            self.items[j].element.onmouseout = function(){
                self.index = -1;
            };
        }

        //瀹氭椂鏇存柊
        TagCloud.boxs.push(self.box);
        self.update(self);    //鍒濆鏇存柊
        self.box.style.visibility = "visible";
        self.box.style.position = "relative";
        self.box.style.minHeight = 1.2 * self.size + "px";
        self.box.style.minWidth = 2.5 * self.size + "px";
        for (var j = 0, len = self.items.length; j < len; j++) {
            self.items[j].element.style.position = "absolute";
            self.items[j].element.style.zIndex = j + 1;
        }
        self.up = setInterval(function() {
            self.update(self);
        }, 10);
    }

    //瀹炰緥
    TagCloud.boxs = []; //瀹炰緥鍏冪礌鏁扮粍
    // 闈欐€佹柟娉曚滑
    TagCloud._set = function (element) {
        if (TagCloud.boxs.indexOf(element) == -1) {//ie8涓嶆敮鎸佹暟缁勭殑indexOf鏂规硶
            return true;
        }
    };

    //娣诲姞鏁扮粍IndexOf鏂规硶
    if (!Array.prototype.indexOf){
        Array.prototype.indexOf = function(elt /*, from*/){
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0)
                ? Math.ceil(from)
                : Math.floor(from);
            if (from < 0)
                from += len;

            for (; from < len; from++){
                if (from in this && this[from] === elt)
                    return from;
            }
            return -1;
        };
    }


    TagCloud._getConfig = function (config) {
        var defaultConfig = {   //榛樿鍊�
            fontsize: 16,       //鍩烘湰瀛椾綋澶у皬, 鍗曚綅px
            radius: 60,         //婊氬姩鍗婂緞, 鍗曚綅px
            mspeed: "normal",   //婊氬姩鏈€澶ч€熷害, 鍙栧€�: slow, normal(榛樿), fast
            ispeed: "normal",   //婊氬姩鍒濋€熷害, 鍙栧€�: slow, normal(榛樿), fast
            direction: 135,     //鍒濆婊氬姩鏂瑰悜, 鍙栧€艰搴�(椤烘椂閽�360): 0瀵瑰簲top, 90瀵瑰簲left, 135瀵瑰簲right-bottom(榛樿)...
            keep: true          //榧犳爣绉诲嚭缁勪欢鍚庢槸鍚︾户缁殢榧犳爣婊氬姩, 鍙栧€�: false, true(榛樿) 瀵瑰簲 鍑忛€熻嚦鍒濋€熷害婊氬姩, 闅忛紶鏍囨粴鍔�
        };

        if(isObject(config)) {
            for(var i in config) {
                if(config.hasOwnProperty(i)) {//hasOwnProperty()鐢ㄦ潵鍒ゆ柇涓€涓睘鎬ф槸瀹氫箟鍦ㄥ璞℃湰韬€屼笉鏄户鎵胯嚜鍘熷瀷閾�
                    defaultConfig[i] = config[i]; //鐢ㄦ埛閰嶇疆
                }
            }
        }

        return defaultConfig;// 閰嶇疆 Merge
    };
    TagCloud._getMsSpeed = function (mspeed) {    //婊氬姩鏈€澶ч€熷害
        var speedMap = {
            slow: 1, 
            normal: 3,
            fast: 5
        };
        return speedMap[mspeed] || 3;
    };
    TagCloud._getIsSpeed = function (ispeed) {    //婊氬姩鍒濋€熷害
        var speedMap = {
            slow: 10,
            normal: 25,
            fast: 50
        };
        return speedMap[ispeed] || 25;
    };
    TagCloud._getSc = function(a, b) {
        var l = Math.PI / 180;
        //鏁扮粍椤哄簭0,1,2,3琛ㄧずasin,acos,bsin,bcos
        return [
            Math.sin(a * l),
            Math.cos(a * l),
            Math.sin(b * l),
            Math.cos(b * l)
        ];
    };

    TagCloud._on = function (ele, eve, handler, cap) {
        if (ele.addEventListener) {
            ele.addEventListener(eve, handler, cap);
        } else if (ele.attachEvent) {
            ele.attachEvent('on' + eve, handler);
        } else {
            ele['on' + eve] = handler;
        }
    };

    // 鍘熷瀷鏂规硶
    TagCloud.prototype = {
        constructor: TagCloud, // 鍙嶅悜寮曠敤鏋勯€犲櫒

        update: function () {
            var self = this, a, b;

            if (!self.active && !self.keep) {
                self.mouseX = Math.abs(self.mouseX - self.mouseX0) < 1 ? self.mouseX0 : (self.mouseX + self.mouseX0) / 2;   //閲嶇疆榧犳爣涓庢粴鍔ㄥ渾蹇儀杞磋窛绂�
                self.mouseY = Math.abs(self.mouseY - self.mouseY0) < 1 ? self.mouseY0 : (self.mouseY + self.mouseY0) / 2;   //閲嶇疆榧犳爣涓庢粴鍔ㄥ渾蹇儁杞磋窛绂�
            }

            a = -(Math.min(Math.max(-self.mouseY, -self.size), self.size) / self.radius ) * self.mspeed;
            b = (Math.min(Math.max(-self.mouseX, -self.size), self.size) / self.radius ) * self.mspeed;
            
            if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) { return; }

            self.lasta = a;
            self.lastb = b;

            var sc = TagCloud._getSc(a, b);

            for (var j = 0, len = self.items.length; j < len; j++) {

                var rx1 = self.items[j].x,
                    ry1 = self.items[j].y*sc[1] + self.items[j].z*(-sc[0]),
                    rz1 = self.items[j].y*sc[0] + self.items[j].z*sc[1];

                var rx2 = rx1 * sc[3] + rz1 * sc[2],
                    ry2 = ry1,
                    rz2 = rz1 * sc[3] - rx1 * sc[2];

                if(self.index==j){

                    self.items[j].scale = 1; //鍙栧€艰寖鍥�0.6 ~ 3
                    self.items[j].fontsize = 16;
                    self.items[j].alpha = 1;
                    self.items[j].element.style.zIndex = 99;
                }else{
                    var per = self.depth / (self.depth + rz2);
                    self.items[j].x = rx2;
                    self.items[j].y = ry2;
                    self.items[j].z = rz2;

                    self.items[j].scale = per; //鍙栧€艰寖鍥�0.6 ~ 3
                    self.items[j].fontsize = Math.ceil(per * 2) + self.fontsize - 6;
                    self.items[j].alpha = 1.5 * per - 0.5;
                    self.items[j].element.style.zIndex = Math.ceil(per*10-5);
                }
                //self.items[j].element.style.fontSize = self.items[j].fontsize + "px";//瀛椾綋鍙樺ぇ灏�
                self.items[j].element.style.left = self.items[j].x + (self.box.offsetWidth - self.items[j].offsetWidth) / 2 + "px";
                self.items[j].element.style.top = self.items[j].y + (self.box.offsetHeight - self.items[j].offsetHeight) / 2 + "px";
                // self.items[j].element.style.filter = "alpha(opacity=" + 100 * self.items[j].alpha + ")";
                // self.items[j].element.style.opacity = self.items[j].alpha;
            }
        },

        _getItems: function () {
            var self = this,
                items = [],
                element = self.box.children, // children 鍏ㄩ儴鏄疎lement
                length = element.length,
                item;

            for (var i = 0; i < length; i++) {
                item = {};
                item.angle = {};
                item.angle.phi = Math.acos(-1 + (2 * i + 1) / length);
                item.angle.theta = Math.sqrt((length + 1) * Math.PI) * item.angle.phi;
                item.element = element[i];
                item.offsetWidth = item.element.offsetWidth;
                item.offsetHeight = item.element.offsetHeight;
                item.x = self.radius * 1.5 * Math.cos(item.angle.theta) * Math.sin(item.angle.phi);
                item.y = self.radius * 1.5 * Math.sin(item.angle.theta) * Math.sin(item.angle.phi);
                item.z = self.radius * 1.5 * Math.cos(item.angle.phi);
                item.element.style.left = item.x + (self.box.offsetWidth - item.offsetWidth) / 2 + "px";
                item.element.style.top = item.y + (self.box.offsetHeight - item.offsetHeight) / 2 + "px";
                items.push(item);
            }

            return items;   //鍗曞厓绱犳暟缁�
        }



    };

    if (!doc.querySelectorAll) {//ie7涓嶆敮鎸乹uerySelectorAll锛屾墍浠ヨ閲嶆柊瀹氫箟
        doc.querySelectorAll = function (selectors) {
            var style = doc.createElement('style'), elements = [], element;
            doc.documentElement.firstChild.appendChild(style);
            doc._qsa = [];

            style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
            window.scrollBy(0, 0);
            style.parentNode.removeChild(style);

            while (doc._qsa.length) {
                element = doc._qsa.shift();
                element.style.removeAttribute('x-qsa');
                elements.push(element);
            }
            doc._qsa = null;
            return elements;
        };
    }

    return function (options) { // factory
        options = options || {}; // 鐭矾璇硶
        var selector = options.selector || '.tagcloud', //榛樿閫夋嫨class涓簍agcloud鐨勫厓绱�
            elements = doc.querySelectorAll(selector),
            instance = [];
        for (var index = 0, len = elements.length; index < len; index++) {
            options.element = elements[index];
            if (!!TagCloud._set(options.element)) {
                instance.push(new TagCloud(options));
            }
        }
        return instance;
    };

})(window, document);
