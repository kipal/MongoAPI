require('contour-fw')({
    basePath   : __dirname
});

global.Service = {
    basePath : __dirname + "/api-service"
};

global.Service.deepExtend(require("./api-service/"));

var serverConfig = require(__dirname + '/config/server-config.js');
var dbConfig     = require(__dirname + '/config/db-config.js');

var bootStrap = new Service.Core.Bootstrap();
bootStrap.setCurrentServer(
    new Contour.DB.Http.Server(
        serverConfig.api.mongodb.port,
        new Contour.DB.Http.ResponseHandler()
    )
);

bootStrap.run();