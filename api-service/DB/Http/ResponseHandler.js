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

                    responseEnd(JSON.stringify(msg));
                }

                this[request.method](dbHandler, request.params, responseEnd);
           };

           this.listDatabases = function (dbHandler, request, resp) {
               dbHandler.admin().listDatabases(
                   function (err, db) {
                       if (err) {
                           resp("Error in listDatabases query!");

                           return;
                       }

                       resp(JSON.stringify(db));
                   }
               );
           };

           this.serverStatus = function (dbHandler, request, resp) {
               dbHandler.admin().serverStatus(
                   function (err, db) {
                       if (err) {
                           resp("Error in serverStatus query!");

                           return;
                       }

                       resp(JSON.stringify(db));
                   }
               );
           };

           this.collections = function (dbHandler, param, resp) {
               dbHandler.db(param.dbName).collections(
                       function (err, r) {
                           if (err) {
                               resp("Error in collections query!");

                               return;
                           }

                           result = [];
                           for (var i in r) {
                               var tmpName = r[i].collectionName;
                               if (tmpName) {
                                   result.push(tmpName);
                               }
                           }

                           resp(JSON.stringify(result));
                       }
               );
           };

        }

        ResponseHandler.prototype             = BaseRespHandler;
        ResponseHandler.prototype.constructor = ResponseHandler;


        return ResponseHandler;
    }
).dep("Contour.DB.Http.ResponseHandler");