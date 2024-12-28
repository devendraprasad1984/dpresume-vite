const messageId = "56b863ed-362a-46a8-a974-ef1d9b26efa0";

const reaction = await channel.sendReaction(messageId, {
    type: "love"
});

return reaction;