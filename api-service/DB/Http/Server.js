module.exports = new Module(
    function (AbstractServer, Request) {

        function Server(port, config, responseHandler) {
            AbstractServer.call(this, port, responseHandler);

            var mongoDB   = require("mongodb").MongoClient;
            var dbHandler = null;
            mongoDB.connect(
                config.protocol + "://" + config.host + ":" + config.port,
                function (err, db) {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    dbHandler = db;
                }
            );


            this.getDBHandler = function () {
                return dbHandler;
            };

            this.handleRequest = function (request, response) {
                var body = '';
                request.on(
                    'data',
                    function (chunk) {
                        body += chunk;
                });

                response.writeHeader(200, {"Content-Type" : "application/json"});

                request.on(
                    "end",
                    function () {
                        try {
                            responseHandler.getResponse(dbHandler, Request.parse(body), response);
                        } catch (e) {
                            response.end(JSON.stringify({error : e, request : body}));
                        }
                    }.bind(this)
                );
            };
        }

        Server.prototype             = AbstractServer.prototype;
        Server.prototype.constructor = Server;

        return Server;
    }
).dep("Contour.Core.Http.AbstractServer", "Contour.Core.Http.Request");