module.exports = new Module(
    function (BaseRespHandler) {

        function ResponseHandler() {
            BaseRespHandler.call(this);
        }

        ResponseHandler.prototype             = BaseRespHandler;
        ResponseHandler.prototype.constructor = ResponseHandler;


        return ResponseHandler;
    }
).dep("Contour.DB.Http.ResponseHandler");