module.exports = new Module(
    function (BaseRespHandler) {

        function ResponseHandler(dbHandler) {
            dbHandler.connect();

            var cursorChecker = function () {
                console.log('Waiting for db cursor!');
                if (!dbHandler.cursor) {
                    setTimeout(cursorChecker, 1000);
                }
            }.bind(this);

            cursorChecker();

            BaseRespHandler.call(this);


        }

        ResponseHandler.prototype             = BaseRespHandler;
        ResponseHandler.prototype.constructor = ResponseHandler;


        return ResponseHandler;
    }
).dep("Contour.DB.Http.ResponseHandler");