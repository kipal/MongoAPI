module.exports = new Module(
    function (BaseClient) {
        function Client(config) {
            BaseClient.call(this);

            var mongoDB = require("mongodb");
            this.client = mongoDB.MongoClient;
            this.server = mongoDB.MongoServer;

            this.cursor = null;

            this.setCursor = function (cursor) {
                this.cursor = cursor;
                console.log('Cursor on.');
            };

            this.connect = function () {
                this.client.connect(
                    config.protocol + "://" + config.host + ":" + config.port,
                    function (err, cursor) {
                        if (err) {
                            throw 'Error in mongodb connection!';
                        }

                        this.setCursor(cursor);
                    }.bind(this)
                );
            };

        }

        Client.prototype             = BaseClient;
        Client.prototype.constructor = Client;

        return Client;
    }
).dep("Contour.DB.Client");