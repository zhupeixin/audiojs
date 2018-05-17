;(function () {
    /**
     * Audio内部工具类
     * @constructor
     */
    function Utils() {}

    var fn = Utils.prototype;

    /**
     * 判断参数是否为数组
     * @param {array} arr
     * @returns {boolean}
     */
    fn.isArr = function (arr) {
        return arr && arr.constructor === [].constructor;
    };

    /**
     * 判断参数是否为对象
     * @param {object} obj
     * @returns {boolean}
     */
    fn.isObj = function (obj) {
        return obj && obj.constructor === {}.constructor;
    };

    /**
     * 将参数转换为数组
     * @param {object} obj
     * @returns {array}
     */
    fn.toArr = function(obj){
        var arr = [];
         if(fn.isArr(obj)){
             arr = obj;
         }else{
             arr.push(obj);
         }
        return arr;
    };

    /**
     * 克隆JSON对象，深拷贝
     * @param {object} obj
     * @returns {object}
     */
    fn.clone = function(obj){
        return JSON.parse(JSON.stringify(obj));
    };

    /**
     * 合并两个JSON对象
     * @param {object} json1
     * @param {object} json2
     * @returns {object}
     */
    fn.merge = function(json1,json2){
        for (var i in json2) {
            if (json1.hasOwnProperty(i)) {
                if (fn.isObj(json1[i]) && fn.isObj(json2[i])) {
                    fn.merge(json1[i], json2[i]);
                } else {
                    json1[i] = json2[i];
                }
            }
        }
        return json1;
    };


    fn.equalArr = function(arr1,arr2){
        var flag = true;

        if(!fn.isArr(arr1) || !fn.isArr(arr2) || arr1.length !== arr2.length){
            return false;
        }

        arr1.forEach(function (value) {
            if(arr2.indexOf(value) === -1){
                flag = false;
            }
        })

        return flag;
    }

    Audio.prototype._utils = new Utils();
})();