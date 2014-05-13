module.exports = new Module(
    function (BaseRespHandler) {

        function ResponseHandler() {

            BaseRespHandler.call(this);

            var ObjectID = require("mongodb").ObjectID;

            this.getResponse = function (dbHandler, request, response) {
                if (
                    undefined === this[request.method]
                    || !(this[request.method] instanceof Function)
                ) {
                    var msg = "Not found '" + request['method'] + "' method!";
                    console.log(msg);

                    responseEnd(JSON.stringify(msg));
                }

                this[request.method](dbHandler, request.params, response);
           };

           var createResponse = function (result) {
               return this.createResponse(result);
           }.bind(this);

           var createErrorResponse = function (result) {
               return this.createResponse({}, result);
           }.bind(this);

           var responseFunction = function (err, result) {
               if (err) {
                   this.end(createErrorResponse(err));
               }

               this.end(createResponse(result));
           };

           this.listDatabases = function (dbHandler, request, resp) {
               dbHandler.admin().listDatabases(responseFunction.bind(resp));
           };

           this.serverStatus = function (dbHandler, request, resp) {
               dbHandler.admin().serverStatus(responseFunction.bind(resp));
           };

           this.collections = function (dbHandler, param, resp) {
               dbHandler.db(param.dbName).collections(
                       function (err, r) {
                           if (err) {
                               resp.end(createErrorResponse(err));

                               return;
                           }

                           result = [];
                           for (var i in r) {
                               var tmpName = r[i].collectionName;
                               if (tmpName) {
                                   result.push(tmpName);
                               }
                           }

                           resp.end(createResponse(result));
                       }
               );
           };

           this.findAll = function (dbHandler, param, resp) {
               dbHandler.db(param.dbName).collection(param.collectionName).find().toArray(responseFunction.bind(resp));
           };

           this.removeById = function (dbHandler, param, resp) {
               dbHandler.db(param.dbName).collection(param.collectionName).remove(
                       {
                           "_id" : ObjectID(param.id)
                       },
                       function (err, r) {
                           if (err) {
                               resp.end(createErrorResponse(err));

                               return;
                           }

                           resp.end(createResponse(r));

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
                               resp.end(createErrorResponse(err));

                               return;
                           }

                           resp.end(createResponse(r));

                       }
               );
           };

           this.save = function (dbHandler, param, resp) {
               dbHandler.db(param.dbName).collection(param.collectionName).save(
                       param.data,
                       function (err, r) {
                           if (err) {
                               resp.end(createErrorResponse(err));

                               return;
                           }

                           resp.end(createResponse(r));

                       }
               );
           };

           this.dropDB = function (dbHandler, param, resp) {
               dbHandler.db(param.dbName).dropDatabase(responseFunction.bind(resp));
           };

           this.addDB = function (dbHandler, param, resp) {
               dbHandler.db(param).createCollection(
                   "system.indexes",
                   {capped:false, size:10000, max:1000, w:1},
                   function (err, r) {
                       if (err) {
                           resp.end(createErrorResponse(err));

                           return;
                       }

                       resp.end(createResponse(true));

                   }
               );
           };

           this.addCollection = function (dbHandler, param, resp) {
               dbHandler.db(param.dbName).createCollection(
                   param.collectionName,
                   {capped:false, size:10000, max:1000, w:1},
                   function (err, r) {
                       if (err) {
                           resp.end(createErrorResponse(err));

                           return;
                       }

                       resp.end(createResponse(true));

                   }
               );
           };

           this.removeCollection = function (dbHandler, param, resp) {
               dbHandler.db(param.dbName).reIndex(param.collectionName, function (err, result) {
                   if (err) {
                       resp.end(createErrorResponse(err));

                       return;
                   }

                   dbHandler.db(param.dbName).collection(param.collectionName).drop(responseFunction.bind(resp));
               });
           };

        }

        ResponseHandler.prototype             = BaseRespHandler;
        ResponseHandler.prototype.constructor = ResponseHandler;


        return ResponseHandler;
    }
).dep("Contour.DB.Http.ResponseHandler");