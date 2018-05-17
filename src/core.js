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