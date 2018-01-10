const builder = require('botbuilder');
const restify = require('restify');

const server = restify.createServer();
const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to: ${server.url}`);
});

const saveAndSendMesage = (session, messageText) => {
    // save conversation-id, message-text, timestamp to db
    let _conversationId = session.conversationId;
    let _timestamp = Date.now(); // use moment.js if you need date formatting
    // your save to db function goes here:
    console.log(`[saveMessageAndSend] Saving message with conversationId: ${_conversationId} - messageText: ${messageText} - timestamp: ${_timestamp}`);
    // saveToDatabase(_conversationId, messageText, _timestamp);
    // then send the message
    session.send(messageText);
};

const saveConversationData = (conversationData) => {
    console.log(`Got conversationData as: ${conversationData}`); // Debug
    console.log(`Saving conversationData object...`);
    // save data
    console.log(`Done!`);
}

const bot = new builder.UniversalBot(connector, (session) => {
    // example: save and send message using custom function 
    // instead of logging middleware
    saveAndSendMesage(session, "Save this message and send it...");

    // or call your custom "save conversationData" function before sending message as usual
    saveConversationData(session.conversationData);

    // then send bot response
    session.send("This is a simple bot.");
});

// Middleware for logging
bot.use({
    botbuilder (session, next) {
        console.log(`[BOTBUILDER hook] Got session.message.text as: ${session.message.text}`);
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
