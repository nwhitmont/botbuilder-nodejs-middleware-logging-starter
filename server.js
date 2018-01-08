const builder = require('botbuilder');
const restify = require('restify');

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to: ${server.url}`);
});

const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

server.post('/api/messages', connector.listen());

const saveAndSendMesage = (session) => {
    // save conversation-id, message-text, timestamp to db
    let _timestamp = Date.now();
    let _conversationId = session.conversationId;
    let _messageTxt = session.message.text;
};

const bot = new builder.UniversalBot(connector, (session) => {
    session.send("This is a simple bot.");
});

// Middleware for logging
bot.use({
    botbuilder (session, next) {
        console.log(`[BOTBUIDLER hook] Got session.message.text as: ${session.message.text}`);
        next();
      },
    receive: function (event, next) {
        console.log(`[RECEIVE hook] Got message: ${event.text} - From user.name: ${event.address.user.name}`);
        next();
    },
    send: function (event, next) {
        console.log(`[SEND hook] Got message: ${event.text} - From user.name: ${event.address.user.name}`);
        next();
    }
});

// END OF LINE
