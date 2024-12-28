const channel = client.channel('messaging', 'the-small-council_83KUgfpBYV', {
    name: "Private Chat About the Kingdom",
    image: "https://bit.ly/2F3KEoM",
    members: ["cool-paper-4"],
    session: 8 // custom field, you can add as many as you want
});

await channel.watch();

return channel;