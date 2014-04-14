module.exports = new Module(
    function (BaseRespHandler) {

        function ResponseHandler() {

            BaseRespHandler.call(this);

            this.getResponse = function (dbHandler, request, responseEnd) {
                if (
                    undefined === this[request.method]
                    || !(this[request.method] instanceof Function)
                ) {
                    var msg = "Not found '" + request['method'] + "' method!";
                    console.log(msg);

                    return new Response().setBody(undefined, msg);
                }

                this[request.method](dbHandler, responseEnd);
           };

           this.listDatabases = function (dbHandler, resp) {
               dbHandler.admin().listDatabases(
                   function (err, db) {
                       if (err) {
                           resp("Error in listDatabases query!");

                           return;
                       }

                       resp(JSON.stringify(db));
                   }
               );
           }
        }

        ResponseHandler.prototype             = BaseRespHandler;
        ResponseHandler.prototype.constructor = ResponseHandler;


        return ResponseHandler;
    }
).dep("Contour.DB.Http.ResponseHandler");