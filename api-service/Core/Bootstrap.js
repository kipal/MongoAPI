module.exports = new Module(
    function (ContourBootstrap, BodyWidget, HeadWidget) {

        function Bootstrap() {
            ContourBootstrap.call(this);
        }

        Bootstrap.prototype             = ContourBootstrap.prototype;
        Bootstrap.prototype.constructor = Bootstrap;

        return Bootstrap;
    }
)
.dep("Contour.Core.Bootstrap");