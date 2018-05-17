;(function () {
    /**
     * 事件处理部分
     */
    var fn = Audio.prototype;

    /**
     * 指定ID资源下载完成时触发的事件
     * @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
     * @param {number | array} id - 必须 - 资源ID
     * @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
     */
    fn.onLoad = function (cb, id, once) {
        return this.addEventListener('load', cb, id, once === undefined ? true :once);
    };

    /**
     * 指定ID资源解码完成时触发的事件
     * @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
     * @param {number | array} id - 必须 - 资源ID
     * @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
     */
    fn.onReady = function (cb, id, once) {
        return this.addEventListener('ready', cb, id, once === undefined ? true :once);
    };

    /**
     * 指定ID资源开始播放时触发的事件
     * @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
     * @param {number | array} id - 必须 - 资源ID
     * @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
     */
    fn.onStart = function (cb, id, once) {
        return this.addEventListener('start', cb, id, once);
    };

    /**
     * 指定ID资源停止播放时触发的事件
     * @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
     * @param {number | array} id - 必须 - 资源ID
     * @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
     */
    fn.onStop = function (cb, id, once) {
        return this.addEventListener('stop', cb, id, once);

    };

    /**
     * 指定ID资源由暂停转为播放时触发的事件
     * @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
     * @param {number | array} id - 必须 - 资源ID
     * @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
     */
    fn.onPlay = function (cb, id, once) {
        return this.addEventListener('play', cb, id, once);
    };

    /**
     * 指定ID资源由播放转为暂停时触发的事件
     * @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
     * @param {number | array} id - 必须 - 资源ID
     * @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
     */
    fn.onPause = function (cb, id, once) {
        return this.addEventListener('pause', cb, id, once);
    };

    /**
     * 指定ID资源静音时触发的事件
     * @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
     * @param {number | array} id - 必须 - 资源ID
     * @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
     */
    fn.onMute = function (cb, id, once) {
        return this.addEventListener('mute', cb, id, once);
    };

    /**
     * 指定ID资源由静音恢复时触发的事件
     * @param {function} cb - 必须 - 当所监听的事件类型触发时，回调函数
     * @param {number | array} id - 必须 - 资源ID
     * @param {boolean} once - 可选 - 表示回调函数在添加之后最多只调用一次。如果是 true，回调函数会在其被调用之后自动移除。如果是false，那么这个事件将会是被保护的，不会被删除
     */
    fn.onvocal = function (cb, id, once) {
        return this.addEventListener('vocal', cb, id, once);
    };

    /**
     * 指定ID资源在出错时触发的事件
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