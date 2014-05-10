module.exports = new Module(
    function (ContourBootstrap, Server, ResponseHandler) {

        function Bootstrap(serverConfig, dbConfig) {
            ContourBootstrap.call(this);

            this.setCurrentServer(
                new Server(
                    serverConfig.api.mongodb.port,
                    dbConfig.primary,
                    new ResponseHandler()
                )
            );
        }

        Bootstrap.prototype             = ContourBootstrap.prototype;
        Bootstrap.prototype.constructor = Bootstrap;

        return Bootstrap;
    }
)
.dep(["Contour.Core.Bootstrap", "Service.DB.Http.Server", "Service.DB.Http.ResponseHandler"]);