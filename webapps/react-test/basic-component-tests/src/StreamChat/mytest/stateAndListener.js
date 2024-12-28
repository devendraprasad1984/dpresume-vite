channel.on("message.new", event => {
    logEvent(event);
});

await channel.sendMessage({
    text: "What is the medieval equivalent of tabs vs spaces?",
});