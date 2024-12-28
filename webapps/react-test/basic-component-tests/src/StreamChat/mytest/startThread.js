const parent = await channel.sendMessage({
    text: 'Episode 1 just blew my mind!',
});

const reply = await channel.sendMessage({
    text: "Stop it, no spoilers please!",
    parent_id: parent.message.id,
    customField: 123, // custom field, you can add as many as you want
});