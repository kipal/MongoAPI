require('contour-fw')({
    basePath   : __dirname
});

global.Service = {
    basePath : __dirname + "/api-service"
};

global.Service.deepExtend(require("./api-service/"));

var serverConfig = require(__dirname + '/config/NodeMongoAdmin-CONFIG/server-config.js');
var dbConfig     = require(__dirname + '/config/db-config.js');


new Service.Core.Bootstrap(serverConfig, dbConfig).run();