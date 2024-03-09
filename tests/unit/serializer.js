const jestSerializerVueTJW = require('jest-serializer-vue-tjw');

const helpers = {
    isHtmlString: function (received) {
        return (
            typeof (received) === 'string' &&
            (
                received.startsWith('<') ||
                received.startsWith('"<')
            )
        );
    },
    isVueWrapper: function (received) {
        return (
            typeof (received) === 'object' &&
            typeof (received.html) === 'function'
        );
    }
};

module.exports = {
    test: function (received) {
        return helpers.isHtmlString(received) || helpers.isVueWrapper(received);
    },
    print: function (received) {
        // force to a string
        received = received?.html && received?.html() || received;
        return jestSerializerVueTJW.print(received);
    }
};