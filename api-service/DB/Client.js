module.exports = new Module(
    function (BaseClient) {
        function Client(config) {
            BaseClient.call(this);

            var mongoDB = require("mongodb");
            this.client = mongoDB.MongoClient;
            this.server = mongoDB.MongoServer;

            this.exec = function (callback) {

                this.client.connect(
                    config.protocol + "://" + config.host + ":" + config.port,
                    function (err, db) {
                        if (err) {
                            throw 'Error in mongodb connection!';
                        }

                        callback(db);
                    }.bind(this)
                );
            };

        }

        Client.prototype             = BaseClient;
        Client.prototype.constructor = Client;

        return Client;
    }
).dep("Contour.DB.Client");