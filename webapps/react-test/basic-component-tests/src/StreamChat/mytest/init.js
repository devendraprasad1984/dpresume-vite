const client = StreamChat.getInstance("dz5f4d5kzrue");
await client.connectUSer({
    id: "cool-paper-4",
    name: "cool",
    image: "https://bit.ly/2u9Vc0r",
}, "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiY29vbC1wYXBlci00IiwiZXhwIjoxNjUxOTM5OTIwfQ.uA_yaGE_Yy4T8o6ghqgYXQPIolRaxkX-taJvMe8eAeg"); // token generated server side
return client;