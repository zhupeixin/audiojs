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