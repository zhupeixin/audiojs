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