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