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