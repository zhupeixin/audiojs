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