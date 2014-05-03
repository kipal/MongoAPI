module.exports = new Module(
    function (BaseRespHandler) {

        function ResponseHandler() {

            BaseRespHandler.call(this);

            var ObjectID = require("mongodb").ObjectID;

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

           this.findAll = function (dbHandler, param, resp) {
               dbHandler.db(param.dbName).collection(param.collectionName).find().toArray(
                       function (err, r) {
                           if (err) {
                               resp("Error in findAll query!");

                               return;
                           }

                           resp(JSON.stringify(r));
                       }
               );
           };

           this.removeById = function (dbHandler, param, resp) {
               dbHandler.db(param.dbName).collection(param.collectionName).remove(
                       {
                           "_id" : ObjectID(param.id)
                       },
                       function (err, r) {
                           if (err) {
                               resp("Error in remove query! -" + err);

                               return;
                           }

                           resp(JSON.stringify(r));
                       }
               );
           };

           this.updateById = function (dbHandler, param, resp) {
               var id   = param.data._id;
               var data = param.data;
               delete data._id;

               dbHandler.db(param.dbName).collection(param.collectionName).findAndModify(
                       {
                           "_id" : ObjectID(id)
                       },
                       {},
                       data,
                       function (err, r) {
                           if (err) {
                               resp("Error in updateById query! -" + err);

                               return;
                           }

                           resp(JSON.stringify(r));
                       }
               );
           };

           this.save = function (dbHandler, param, resp) {
               dbHandler.db(param.dbName).collection(param.collectionName).save(
                       param.data,
                       function (err, r) {
                           if (err) {
                               resp("Error in save query! -" + err);

                               return;
                           }

                           resp(JSON.stringify(r));
                       }
               );
           };
        }

        ResponseHandler.prototype             = BaseRespHandler;
        ResponseHandler.prototype.constructor = ResponseHandler;


        return ResponseHandler;
    }
).dep("Contour.DB.Http.ResponseHandler");