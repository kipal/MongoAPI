module.exports = new Module(
    function (AbstractServer, Request) {

        function Server(port, config, responseHandler) {
            AbstractServer.call(this, port, responseHandler);

            var mongoDB    = require("mongodb").MongoClient;
            var dbHandler  = null;
            var connectErr = null;

            var mongoConnect = function () {
                mongoDB.connect(
                    config.protocol + "://" + config.host + ":" + config.port,
                    {
                        server : {
                            "auto_reconnect" : true
                        }
                    },
                    function (err, db) {
                        if (err) {

                            console.log(err);
                            connectErr = err;

                            return;
                        }

                        connectErr = null;
                        dbHandler  = db;
                    }.bind(this)
                );
            }.bind(this);

            mongoConnect();


            var getDBHandler = function () {
                if (dbHandler) {

                    return dbHandler;
                }

                if (connectErr) {
                    mongoConnect();
                    throw 'Database connection interrupted!';
                }

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
                            var dbHandler = getDBHandler();

                            responseHandler.getResponse(dbHandler, Request.parse(body), response);
                        } catch (e) {
                            response.end(JSON.stringify({error : e, request : body}));
                        }
                    }
                );

                response.setTimeout(
                    1000,
                    function () {
                        if (null !== connectErr) {
                            response.end(JSON.stringify({error : "Database connection interrupted!", request : body}));
                        } else {
                            response.end(JSON.stringify({error : "Connection timeout!", request : body}));
                        }
                        mongoConnect();
                    }
                );
            };
        }

        Server.prototype             = AbstractServer.prototype;
        Server.prototype.constructor = Server;

        return Server;
    }
).dep("Contour.DB.Http.Server", "Contour.Core.Http.Request");