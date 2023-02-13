function bLoader(content, map, meta) {
    console.log("开始执行b-Loader Normal Loader");
    return content + "bLoader->";
}
bLoader.pitch = function (remainingRequest, precedingRequest, data) {
    console.log("开始执行bLoader Pitching Loader");
    console.log(remainingRequest, precedingRequest, data);
};


module.exports = bLoader;