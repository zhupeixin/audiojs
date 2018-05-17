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