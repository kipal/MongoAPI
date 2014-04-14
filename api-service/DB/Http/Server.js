module.exports = new Module(
    function (AbstractServer, Request) {

        function Server(port, config, responseHandler) {
            AbstractServer.call(this, port, responseHandler);

            var mongoDB = require("mongodb").MongoClient;
            this.handleRequest = function (request, response) {
                mongoDB.connect(
                    config.protocol + "://" + config.host + ":" + config.port,
                    function (err, db) {
                        if (err) {

                            response.end("DB connect error.");
                            return;
                        }

                        var body = '';
                        request.on('data', function (chunk) {
                            body += chunk;
                        });

                        response.writeHeader(200, {"Content-Type" : "application/json"});

                        responseHandler.getResponse(db, Request.parse(body), response.end.bind(response));
                    }
                );
            };
        }

        Server.prototype             = AbstractServer.prototype;
        Server.prototype.constructor = Server;

        return Server;
    }
).dep("Contour.Core.Http.AbstractServer", "Contour.Core.Http.Request");