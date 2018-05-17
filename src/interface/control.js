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