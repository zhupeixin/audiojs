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