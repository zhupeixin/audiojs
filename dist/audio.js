/**
 * Audio对象
 * @param {object} option - 可选 - 全局配置
 * @returns {*}
 * @constructor
 */
function Audio(option) {
    var that = this;
    /**
     * 资源仓库，用于存储所有正在被程序运行的资源，
     * 只读，不可以直接操作，操作将会导致程序运行出错
     * @type {Array}
     * @private
     */
    that._store = [];

    /**
     * 事件队列，用于存储所有被监听的事件，
     * 只读，不可以直接操作，操作将会导致程序运行出错
     * @type {Array}
     * @private
     */

    that._eventQ = [];

    /**
     * 用于记录资源状态
     * @private
     */
    that._status = {
        load:[],
        ready:[],
        start:[],
        stop:[],
        play:[],
        pause:[],
        mute:[],
        vocal:[]
    };

    /**
     * 用于保存一个AudioContext实例
     * @type {null}
     * @private
     */
    that._ctx = null;
    /**
     * 创建AudioContext实例
     */
    return !!that._init(option || {}) && that;
}
;(function () {
    /**
     * Audio内部工具类
     * @constructor
     */
    function Utils() {}

    var fn = Utils.prototype;

    /**
     * 判断参数是否为数组
     * @param {array} arr
     * @returns {boolean}
     */
    fn.isArr = function (arr) {
        return arr && arr.constructor === [].constructor;
    };

    /**
     * 判断参数是否为对象
     * @param {object} obj
     * @returns {boolean}
     */
    fn.isObj = function (obj) {
        return obj && obj.constructor === {}.constructor;
    };

    /**
     * 将参数转换为数组
     * @param {object} obj
     * @returns {array}
     */
    fn.toArr = function(obj){
        var arr = [];
         if(fn.isArr(obj)){
             arr = obj;
         }else{
             arr.push(obj);
         }
        return arr;
    };

    /**
     * 克隆JSON对象，深拷贝
     * @param {object} obj
     * @returns {object}
     */
    fn.clone = function(obj){
        return JSON.parse(JSON.stringify(obj));
    };

    /**
     * 合并两个JSON对象
     * @param {object} json1
     * @param {object} json2
     * @returns {object}
     */
    fn.merge = function(json1,json2){
        for (var i in json2) {
            if (json1.hasOwnProperty(i)) {
                if (fn.isObj(json1[i]) && fn.isObj(json2[i])) {
                    fn.merge(json1[i], json2[i]);
                } else {
                    json1[i] = json2[i];
                }
            }
        }
        return json1;
    };


    fn.equalArr = function(arr1,arr2){
        var flag = true;

        if(!fn.isArr(arr1) || !fn.isArr(arr2) || arr1.length !== arr2.length){
            return false;
        }

        arr1.forEach(function (value) {
            if(arr2.indexOf(value) === -1){
                flag = false;
            }
        })

        return flag;
    }

    Audio.prototype._utils = new Utils();
})();
;(function () {
    /**
     * 私有方法
     * 资源加载器，提供多种资源加载形式，你可以根据自己的需求配置加载项，也可以自己定制资源加载器，自己定义的资源加载器应当暴露一个onload和一个onerror方法。
     * 加载成功的资源将会存入资源仓库store中，并向外部抛出load事件，可以通过onload捕捉加载完成的数据。若加载器加载出错将会抛出error事件，可以通过onerror方法捕捉错误信息。
     * @param {number} id - 必须 - 资源库资源ID
     * @returns {Audio}
     * @private
     */
    Audio.prototype._loader = function (id) {
        var that = this;
        if (!that.has(id)) {
            that.dispatchEvent('id not found');
            return that;
        }
        var source = that.find(id),
            ajaxObj = null,
            loader = that._loader.prototype;
        switch (source.option.loader.model) {
            case 'Ajax' :
                ajaxObj = loader.Ajax;
                break;
            case 'File' :
                ajaxObj = loader.File;
                break;
        }
        if (!ajaxObj) {
            that.dispatchEvent('error', id, 'loader model error');
            return that;
        }
        ajaxObj = new ajaxObj(source.option.source);
        ajaxObj.onload(function (data) {
            source.resource.sourceData = data;
            that.dispatchEvent('load', id, data);
        });
        ajaxObj.onerror(function (msg) {
            that.dispatchEvent('error', id, msg);
        });
        return that;
    }
})();
;(function () {
    /**
     * 资源加载器，用于加载来源于网络的资源。如果您使用这个加载器，它将发起一个XMLHttpRequest请求以得到来源于网络上的音频文件
     * 请自行解决跨域资源访问问题
     * @returns {Ajax}
     * @constructor
     */
    function Ajax(option) {
        var that = this;
        that.load = function () {
        };
        that.error = function () {
        };
        that.init(option);
        return that;
    }

    var fn = Ajax.prototype

    /**
     * 用于Ajax加载器的初始化
     * @param {object} option - 必填 - Ajax请求的配置项
     */
    fn.init = function (option) {
        var xhr = new XMLHttpRequest(),
            that = this;
        if (this.check(option)) {
            var opts = {
                method: 'GET',
                url: option.url || '',
                async: true,
                data: option.data || {},
                header: option.header || {}
            };
            var param = this.formatData(opts.data);
            param = param.length ? '?' + param : '';
            xhr.open(opts.method, opts.url + param, opts.async);
            for (var i in opts.header) {
                xhr.setRequestHeader(i, option.headers[i]);
            }
            xhr.responseType = 'arraybuffer';
            xhr.onload = function () {
                that.load(xhr.response);
            };
            xhr.onerror = function (ev) {
                that.error('XMLHttpRequest error' + ev);
            };
            xhr.send(null);
        }
    }

    /**
     * 用于序列化请求体参数
     * @param {object} data - 可选 - 待序列化的对象
     * @returns {string}
     */
    fn.formatData = function (data) {
        var str = '';
        for (var i in data) {
            str += i + '=' + data[i] + '&';
        }
        return str.split('').slice(0, -1).join('');
    };

    /**
     * Ajax参数校验
     * @returns {boolean}
     */
    fn.check = function (option) {
        if (typeof option.url !== 'string') {
            this.error('option error');
            return false;
        }

        if (option.data && typeof option.data !== 'object') {
            this.error('option error');
            return false;
        }

        if (option.header && typeof option.header !== 'object') {
            this.error('option error');
            return false;
        }

        return true;
    };

    /**
     * 资源加载完成后触发的事件
     * @param {function} cb
     */
    fn.onload = function (cb) {
        if (typeof cb === 'function') this.load = cb;
    };

    /**
     * 加载器出错时触发的事件
     * @param {function} cb
     */
    fn.onerror = function (cb) {
        if (typeof cb === 'function') this.error = cb;
    };
    Audio.prototype._loader.prototype.Ajax = Ajax;
})();
;(function () {
    /**
     * 资源加载器，用于加载来源于本地的资源。如果您使用这个加载器，那么你应该准备好一个即将被读取的 Blob 或 File 对象
     * 仅可以读取 Blob 或 File 对象，不可以通过传入本地URL来读取本地文件，因为浏览器对此操作是限制的
     * @returns {File}
     * @constructor
     */
   function File(option) {
        var that = this;
        that.load = function () {
        };
        that.error = function () {
        };
        that.init(option);
        return that;
   }
    var fn = File.prototype;
    /**
     * 用于File加载器的初始化
     * @param {File} option - 必填 - 一个即将被读取的 Blob 或 File 对象
     */
   fn.init = function (option) {
       var reader = new FileReader(),
           that = this;
       reader.readAsArrayBuffer(option);
       reader.onLoad = function () {
           that.load(reader.result);
       };

       reader.onerror = function (ev) {
           that.error('FileReader error' + ev);
       };
   }

    /**
     * 资源加载完成后触发的事件
     * @param {function} cb
     */
    fn.onload = function (cb) {
        if (typeof cb === 'function') this.load = cb;
    };

    /**
     * 加载器出错时触发的事件
     * @param {function} cb
     */
    fn.onerror = function (cb) {
        if (typeof cb === 'function') this.error = cb;
    };

    Audio.prototype._loader.prototype.File = File;
})();
;(function () {
    /**
     * 私有方法
     * 解码由加载器传来的已经加载完成的待解码资源
     * @param {number} id - 必须 - 资源库资源ID
     * @returns {Audio}
     * @private
     */
    Audio.prototype._decode = function (id) {
        var that = this;
        if (!that.has(id)) {
            that.dispatchEvent('id not found');
            return that;
        }
        var source = that.find(id).resource;
        that._ctx.decodeAudioData(source.sourceData.slice(0), function (decodedData) {
            source.buffer = decodedData;
            that.dispatchEvent('ready', id, decodedData);
        }, function (error) {
            that.dispatchEvent('error', id, 'decode' + error);
        });
        return that;
    }
})();
;(function () {
    var fn = Audio.prototype;

    /**
     * 向资源库添加资源，并在添加完成后，驱动该资源的下载，解析及资源创建操作
     * @param {object} option - 必须 - 添加资源的配置项
     * @param {function} cb - 可选 - 添加资源后的回调函数
     * @returns {array} 添加的资源ID数组
     */

    fn.add = function (option ,cb) {
        var that = this;
        if (typeof option !== 'object') {
            that.dispatchEvent('error', 0, 'option error');
            return [];
        }
        var id = 0, ids, length = 0,utils = that._utils;
        ids = utils.toArr(option).map(function (value) {
            length = that._store.length;
            id = length ? that._store[length - 1].id + 1 : 1;
            that._store.push(utils.merge(utils.clone(that.option), {id: id, option: value}));
            return id;
        });
        that._run(ids);
        cb && cb.call(that);
        return ids;
    };

    /**
     * 删除资源库中的资源，若资源正在播放则停止资源播放后删除资源
     * @param {number} id - 必须 - 要删除的资源ID
     */
    fn.delete = function (id) {
        var that = this;
        if (!that.has(id)) {
            that.dispatchEvent('error', id, 'id not found');
            return that;
        }
        that._store.forEach(function (e, i) {
            if (e.id === id) {
                that._store.resource && that._store.resource.sourceAudio && that.stop(id);
                that._store.splice(i, 1);
            }
        });
        that.removeEventListener(id,undefined);
        return that;
    };

    /**
     * 更新资源库中指定ID的资源文件，此操作将会删除原资源，并在添加新资源完成后，驱动该资源的下载，解析及资源创建操作
     * @param {number} id - 必须 - 要更新的资源ID
     * @param {object} option - 必须 - 更新的资源配置参数
     */
    fn.update = function (id, option) {
        var that = this;
        var utils = that._utils;
        if (!that.has(id) && utils.isObj(option)) {
            that._store.forEach(function (e, i) {
                if (e.id === id) {
                    that._store.resource.sourceAudio && that.stop(id);
                    that._store[i] = (utils.merge(utils.clone(that.option), {id: id, option: option}));
                    that._run(id);
                }
            })
        }else {
            !that.has(id) && that.dispatchEvent('error', id, 'id not found');
            typeof option !== 'object' && that.dispatchEvent('error', id, 'option error');
        }
    };

    /**
     * 查找资源库中指定ID资源，成功时返回对应资源，失败时返回资源库中的全部资源
     * @param {number} id - 必须 - 要查询的资源ID
     * @returns {object}
     */
    fn.find = function (id) {
        var res = this._store;
        this._store.forEach(function (value) {
            if (value.id === id) res = value;
        });
        return res;
    };

    /**
     * 查找资源库中指定ID资源，成功时返回对应ID，失败时返回 0
     * @param id - 必须 - 要查询的资源ID
     * @returns {number}
     */
    fn.has = function(id){
        var res = 0;
        this._store.forEach(function (value) {
            if (value.id === id) res = id;
        });
        return res;
    }

    /**
     * 查找名字所对应的资源ID
     * @param {string} name - 必须 - 要查找的资源名字
     * @returns {number}
     */
    fn.findId = function (name) {
        var id = 0;
        this._store.forEach(function (value) {
            if (value.option.name === name) id = value.id;
        });
        return id;
    }

    /**
     * 返回当前资源库中的所有资源ID
     * @returns {any[]}
     */
    fn.getAllId = function () {
        return this._store.map(function (value) {
            return value.id;
        })
    }
})();
;(function () {
    var fn = Audio.prototype;

    /**
     * 控制器 - 控制音频的淡入和淡出
     * @param {number} value - 必须 -音量的目标值
     * @param {number} endTime - 必须 - 结束时间，代表从当前开始至结束的时间差
     * @param {function} cb - 必须 - 淡入或淡出生效于哪个函数
     * @param {number} id - 可选 - 资源库资源ID，ID为空则对所有资源生效
     * @returns {Audio}
     */

    fn.fade = function (value, endTime, cb, id) {
        var that = this;
        that._utils.toArr(that.find(id)).forEach(function (e) {
            e.resource.gainNode.gain.linearRampToValueAtTime(value, that._ctx.currentTime + endTime);
        });
        cb && setTimeout(function () {
            cb.call(that);
        }, endTime * 1000);
        return that;
    };

    /**
     * 控制器 - 暂停的资源播放
     * @param {number} id - 可选 - 资源库资源ID，ID为空则开始播放全部资源
     * @returns {Audio}
     */
    fn.play = function (id) {
        var that = this;
        that._utils.toArr(that.find(id)).forEach(function (value) {
            value.resource.gainNode.connect(that._ctx.destination);
            value.temp.pause = false;
        });
        that.dispatchEvent('play', id);
        return that;
    };

    /**
     * 控制器 - 播放的资源暂停
     * @param {number} id - 可选 - 资源库资源ID，ID为空则暂停播放全部资源
     * @returns {Audio}
     */
    fn.pause = function (id) {
        var that = this;
        that._utils.toArr(that.find(id)).forEach(function (value) {
            value.temp.pause && that.play(value.id);
            value.resource.gainNode.disconnect(that._ctx.destination);
            value.temp.pause = true;
        });
        that.dispatchEvent('pause', id);
        return that;
    };

    /**
     * 控制器 - 开始播放或停止播放的资源播放
     * @param {number} id - 可选 - 资源库资源ID，ID为空则开始播放全部资源
     * @returns {Audio}
     */
    fn.start = function (id) {
        var source = null, control,that = this;
        that._utils.toArr(that.find(id)).forEach(function (value) {
            !value.temp.stop && that.stop(id);
            that._create(value.id);
            source = value.resource.sourceAudio;
            control = value.option.control;
            source.start ? source.start(control.delay, control.start, control.end || undefined) : source.noteOn(control.delay, control.start, control.end || undefined);
            value.temp.stop = false;
        });
        that.dispatchEvent('start', id);
        return that;
    };

    /**
     * 控制器 - 停止播放资源
     * @param {number} id - 可选 - 资源库资源ID，ID为空则停止播放全部资源
     * @returns {Audio}
     */
    fn.stop = function (id) {
        var source = null,that = this;
        that._utils.toArr(that.find(id)).forEach(function (value) {
            source = value.resource.sourceAudio;
            source.stop ? source.stop(0) : source.noteOff(0);
            value.temp.stop = true;
        });
        // 停止事件已经在创建音频资源时绑定
        return that;
    };

    /**
     * 控制器 - 增大资源的音量
     * @param {number} step - 必须 - 增大音量的步长
     * @param {number} id - 可选 - 资源库资源ID，ID为空增大全部资源音量
     * @returns {Audio}
     */
    fn.ascVolume = function (step, id) {
        var that = this;
        that._utils.toArr(that.find(id)).forEach(function (value) {
            that.setVolume(value.option.control.volume +(+step), id);
        });
        return that;
    };

    /**
     * 控制器 - 减小资源的音量
     * @param {number} step - 必须 - 减小音量的步长
     * @param {number} id - 可选 - 资源库资源ID，ID为空减小全部资源音量
     * @returns {Audio}
     */
    fn.decVolume = function (step, id) {
        var that = this;
        that._utils.toArr(that.find(id)).forEach(function (value) {
            that.setVolume(value.option.control.volume - (+step), id);
        });
        return that;
    };

    /**
     * 控制器 - 将资源设置的音量设置为指定数值
     * @param {number} value - 必须 - 音量数值 0为静音 1为无增益
     * @param {number} id - 可选 - 资源库资源ID，ID为空增大全部资源音量
     * @returns {Audio}
     */
    fn.setVolume = function (value, id) {
        var that = this;
        that._utils.toArr(that.find(id)).forEach(function (e) {
            e.option.control.volume = +value;
            e.resource.gainNode.gain.setTargetAtTime(e.option.control.volume, that._ctx.currentTime, 0.015);
        });
        return that;
    };

    /**
     * 控制器 - 将资源静音
     * @param {number} id - 可选 - 资源库资源ID，ID为空静音全部资源音量
     * @returns {Audio}
     */
    fn.mute = function (id) {
        var that = this;
        that._utils.toArr(that.find(id)).forEach(function (value) {
            value.resource.gainNode.gain.setTargetAtTime(0, that._ctx.currentTime, 0.015);
        });
        that.dispatchEvent('mute', id);
        return that;
    };

    /**
     * 控制器 - 将静音资源恢复
     * @param {number} id - 可选 - 资源库资源ID，ID为空将全部静音资源恢复
     * @returns {Audio}
     */
    fn.vocal = function (id) {
        var that = this;
        that._utils.toArr(that.find(id)).forEach(function (value) {
            that.setVolume(value.option.control.volume, id);
        });
        that.dispatchEvent('vocal', id);
        return that;
    };
})();
;(function () {
    /**
     * 事件处理部分
     */
    var fn = Audio.prototype;

    /**
     * 指定ID资源下载完成时触发的事件，ID为空则资源全部加载完成时触发
     * @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
     * @param {number | array} id - 必须 - 资源ID
     * @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
     */
    fn.onLoad = function (cb, id, once) {
        return this.addEventListener('load', cb, id, once === undefined ? true :once);
    };

    /**
     * 指定ID资源解码完成时触发的事件，ID为空则资源全部解码完成时触发
     * @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
     * @param {number | array} id - 必须 - 资源ID
     * @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
     */
    fn.onReady = function (cb, id, once) {
        return this.addEventListener('ready', cb, id, once === undefined ? true :once);
    };

    /**
     * 指定ID资源开始播放时触发的事件，ID为空则资源全部开始播放时触发
     * @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
     * @param {number | array} id - 必须 - 资源ID
     * @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
     */
    fn.onStart = function (cb, id, once) {
        return this.addEventListener('start', cb, id, once);
    };

    /**
     * 指定ID资源停止播放时触发的事件，ID为空则资源全部停止播放时触发
     * @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
     * @param {number | array} id - 必须 - 资源ID
     * @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
     */
    fn.onStop = function (cb, id, once) {
        return this.addEventListener('stop', cb, id, once);

    };

    /**
     * 指定ID资源由暂停转为播放时触发的事件，ID为空则资源全部由暂停转为播放时触发
     * @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
     * @param {number | array} id - 必须 - 资源ID
     * @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
     */
    fn.onPlay = function (cb, id, once) {
        return this.addEventListener('play', cb, id, once);
    };

    /**
     * 指定ID资源由播放转为暂停时触发的事件，ID为空则资源全部由播放转为暂停时触发
     * @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
     * @param {number | array} id - 必须 - 资源ID
     * @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
     */
    fn.onPause = function (cb, id, once) {
        return this.addEventListener('pause', cb, id, once);
    };

    /**
     * 指定ID资源静音时触发的事件，ID为空则资源全部静音时触发
     * @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
     * @param {number | array} id - 必须 - 资源ID
     * @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
     */
    fn.onMute = function (cb, id, once) {
        return this.addEventListener('mute', cb, id, once);
    };

    /**
     * 指定ID资源由静音恢复时触发的事件，ID为空则资源全部由静音恢复时触发
     * @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
     * @param {number | array} id - 必须 - 资源ID
     * @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
     */
    fn.onvocal = function (cb, id, once) {
        return this.addEventListener('vocal', cb, id, once);
    };

    /**
     * 指定ID资源在出错时触发的事件，ID为空则任一出错时触发
     * @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
     * @param {number | array} id - 必须 - 资源ID
     * @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除

     */
    fn.onerror = function (cb, id, once) {
        return this.addEventListener('error', cb, id, once);
    };

    /**
     * 将指定的监听器注册到 eventQ 上，当该对象触发指定的事件时，指定的回调函数就会被执行。
     * @param {string} type - 必须 - 监听事件类型的字符串
     * @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
     * @param {number | array} ids - 必填 - 资源ID
     * @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
     * @param {boolean} protect - 可选 - 表示这个事件资源是受系统保护的，在任何情况下不会被移除，对外只在此函数暴露这个属性，其他事件处理不对外暴露这个属性
     */
    fn.addEventListener = function (type, cb, ids, once, protect) {
        var that = this;
        if (!ids) {
            ids = that.getAllId();
        }
        ids = that._utils.toArr(ids);
        if (type && cb && ids.length) {
            that._eventQ.push({
                id: ids,
                type: type,
                once: once,
                protect: protect,
                callback: cb
            })
        } else {
            that.dispatchEventErr('addEventListener arguments error');
        }
        return that;
    };

    /**
     * 移除指定的事件监听器
     * 同时传入type和id，则移除type和id均匹配的不受系统保护的事件
     * 只传入type则移除所有id上不受系统保护的此类型的事件
     * 只传入id则移除该id上所有不受系统保护的事件
     * @param {number | array} ids - 必须 - 资源ID
     * @param {string} type - 必须 - 监听事件类型的字符串
     */
    fn.removeEventListener = function (ids, type) {
        var that = this;
        if (!ids) {
            ids = that.getAllId();
        }
        ids = that._utils.toArr(ids);
        if (ids.length && type) {
            that._eventQ.forEach(function (value, index, array) {
                if (!value.protect && that._utils.equalArr(value.id, ids) && value.type === type) {
                    array.splice(index, 1);
                }
            })
        }else{
            that.dispatchEventErr('removeEventListener arguments error');
        }
    };

    /**
     * 调试阶段参数错误报告
     * @param {*} data 错误信息等其他辅助信息
     */
    fn.dispatchEventErr = function (data) {
        throw new Error(data);
    };

    /**
     * 事件触发器
     * @param {string} type - 必须 - 监听事件类型的字符串
     * @param {number | array} id - 必须 - 资源ID
     * @param {*} data - 可选 - 在触发事件回调时，向回调函数返回一个data，若未指定data，则返回一个undefined
     */
    fn.dispatchEvent = function (type, id, data) {
        var that = this,
            status = that._status;

        function remove(arr, ids) {
            that._utils.toArr(ids).forEach(function (value) {
                var index = arr.indexOf(value);
                if (index > -1) {
                    arr.splice(index, 1);
                }
            })
        }

        if (!id) {
            id = that.getAllId();
        }

        // 对有互斥关系的事件
        switch (type) {
            case 'start' :
                remove(status['stop'], id);
                break;
            case 'stop' :
                remove(status['start'], id);
                break;
            case 'play' :
                remove(status['pause'], id);
                break;
            case 'pause' :
                remove(status['play'], id);
                break;
            case 'mute' :
                remove(status['vocal'], id);
                break;
            case 'vocal' :
                remove(status['mute'], id);
                break;
        }

        that._utils.toArr(id).forEach(function (value) {
            if(status[type].indexOf(value) === -1){
                status[type].push(value);
            }
        })
        var flag = true;
        that._eventQ.forEach(function (value) {
            if (value.type === type) {
                flag = true;
                value.id.forEach(function (val) {
                    if (status[type].indexOf(val) === -1) {
                        flag = false;
                    }
                });
                if (flag) {
                    value.callback.call(that, data);
                    if (value.once) setTimeout(function () {
                        that.removeEventListener(value.id,value.type)
                    }, 0);
                }
            }
        })
    }
})();
;(function () {
    var fn = Audio.prototype;

    /**
     * 私有方法
     * 初始化函数，用于AudioContext对象的初始化，初始化函数仅供一次内部调用
     * @returns {boolean}
     * @private
     */
    fn._init = function (option) {
        // 提供一个版本前缀对于webkit/Blink浏览器是很重要的，对于Firefox(桌面版/手机版/OS版)是不需要的。
        // 当创建一个新的conText对象时，如果你不提示window对象，Sarari会无效。
        var AduioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext,
            that = this;
        if (!AduioContext) {
            that.dispatchEvent('error', 0, 'unsupport Web Audio API');
            return false;
        }
        // 构建一个AudioContext实例，来创建一个音频图。同样一个文档是可以存在多个audioContext对象的，但是比较浪费。因此在你实例化多个对象时，我们并没有实例化多个AudioContext，而是采用叠加的办法。
        that._ctx = new AduioContext();
        !!(option.visibility || option.visibility === undefined) && that.visibility();
        return true;
    };

    /**
     * 私有方法
     * 核心逻辑处理函数，用于各模块的调度
     * @param {number} id - 必须 - 资源库的资源索引 ID，可以传入一个索引 ID 数组
     * @private
     */
    fn._run = function (id) {
        var that = this;

        function run(id) {
            var source = that.find(id),
                option = source.option,
                loader = option.loader,
                resource = source.resource;
            // 需要加载
            loader.load && that._loader(id);
            loader.load && that.addEventListener('load', function () {
                that._decode(id);
            }, id, true);

            // 需要解码
            if(!loader.load && loader.decode){
                resource.sourceData = option.source;
                that._decode(id);
            }
            loader.decode && that.addEventListener('ready', function () {
                if (option.control.autoPlay && !option.sprite) {
                    // 开始播放
                    that.start(id);
                }
            }, id, true);

            // 不需要加载不需要解码
            if(!loader.load && !loader.decode){
                // 直接将数据源赋值给 buffer 进行播放，前提是数据源已经被加载解码好，否则数据源将不能得到有效的处理
                resource.buffer = option.source.slice(0);
                if (option.control.autoPlay && !option.sprite) {
                    //开始播放
                    that.start(id);
                }
            }
        }

        that._utils.toArr(id).forEach(function (e) {
            run(e);
        })
    };

    fn.visibility = function () {
        // 仅在页面可见状态下播放声音，需要配置项 visibility 为 true
        var that = this;
        document.addEventListener('visibilitychange',function () {
            document.hidden ? that.pause() : that.play();
        });
    }
})();
;(function () {
    /**
     * 私有方法
     * 以解码器传来的资源作为音频源创建相关节点
     * @param {number} id -必须 - 资源库资源ID
     * @returns {Audio}
     * @private
     */
    Audio.prototype._create = function (id) {
        var that = this;
        if (!that.has(id)) {
            that.dispatchEvent('id not found');
            return that;
        }
        var res = that.find(id),
            resource = res.resource,
            option = res.option;
        resource.sourceAudio = that._ctx.createBufferSource();//创建一个音频源 相当于是装音频的容器
        resource.sourceAudio.buffer = resource.buffer;//  告诉音频源 播放哪一段音频
        resource.gainNode = that._ctx.createGain ? that._ctx.createGain() : that._ctx.createGainNode();
        resource.gainNode.gain.setTargetAtTime(option.control.volume, that._ctx.currentTime, 0.015);
        resource.sourceAudio.loop = option.control.loop;
        resource.sourceAudio.loopStart = option.control.loopStart;
        resource.sourceAudio.loopEnd = option.control.loopEnd;
        resource.sourceAudio.connect(resource.gainNode);
        resource.gainNode.connect(that._ctx.destination);
        resource.sourceAudio.onended = function (event) {
            that.dispatchEvent('stop', id, event);
        };
        return that;
    };
})();
;(function () {
    /**
     * 配置项，对象中option为可配置项，其余各项为系统自动配置项
     */
    Audio.prototype.option = {
        id: 0,
        option: {
            name: '',
            loader: {
                model: 'Ajax',
                load: true,
                decode: true
            },
            sprite: false,
            source: {
                url: '',
                data: {},
                header: {}
            },
            control: {
                volume: 1,
                autoPlay: false,
                delay: 0,
                start: 0,
                end: 0,
                loop: false,
                loopStart: 0,
                loopEnd: 0
            }
        },
        temp: {
            stop: true,
            pause: false
        },
        resource: {
            sourceData: null,
            buffer: null,
            sourceAudio: null,
            gainNode: null
        }
    }
})();
;(function () {
    /**
     * 雪碧音频，可以将加载好的音频分成多段进行播放，此操作要求数据源配置必须为 sprite: true, 之后调用 sprite 方法对音频进行切割，切割随不会破坏原始音频，但会在音频切割完成后，删除原始音频
     * @param {number} id - 必须 - 资源库中唯一索引资源ID
     * @param {object} option - 必须 - 资源配置项，其中 start end 应该为必备配置项
     */
    Audio.prototype.sprite = function (id, option) {
        var that = this,
            utils = that._utils

        function run() {
            var options = utils.toArr(option).map(function (value) {
                return {
                    name: value.name || '',
                    loader: {
                        model: 'Buffer',
                        load: false,
                        decode: true
                    },
                    sprite: false,
                    source: that.find(id).resource.sourceData,
                    control: utils.merge(utils.clone(that.option.option.control), value.control)
                };
            });
            that.add(options, function () {
                that.delete(id);
            });
        }

        that.addEventListener('load',run,id,true,false);
    }
})();