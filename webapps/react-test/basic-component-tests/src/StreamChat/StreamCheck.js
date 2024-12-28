import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
    Chat,
    Channel,
    ChannelHeader,
    ChannelList,
    MessageList,
    MessageInput,
    Thread,
    Window
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";

const userId = "amin";
const creds= {
    frankfurt: {
        key: "6k9tqsk2ux6g",
        token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYW1pbiJ9.dN0CCAW5CayCq0dsTXxLZvjxhQuZvlaeIfrJmxk9NkU"
    },
    oregon: {
        key: "en3wvjfzfuas",
        token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYW1pbiJ9.JcbaBjFuoOhVcelp51kAFTEA05zLEIpAfGbcez7OATE"
    },
    canada: {
        key: "478rt2pnpzk8",
        token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYW1pbiJ9.PYGEOVvS_aTr0nowrNQq8Bj4qmJpVTIGL2D6ki1B40M"
    },
    frankfurt2: {
        key: "k4yvmmkjsjpp",
        token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYW1pbiJ9.uEvVyL8C0UmfD2cLADA9okG9EOhQUd57DY6tsocIjZ0"
    },
    dublin: {
        key: "ubsg96j7x963",
        token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYW1pbiJ9.RPLSpsq8npUUtCGHyTQFizRpNPOvW4PM7V-ptycHMXw"
    },
    local: {
        key: "892s22ypvt6m",
        token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYW1pbiJ9.KBgV3_Lcnmvo-l1VkeDSoYIheRiqhgzYsckfe-0x3JY",
        baseURL: "http://127.0.0.1:3030"
    }
};

function ChatApp({ client }) {
    return (
        <Chat client={client}>
            <ChannelList
                filters={{ type: "messaging", members: { $in: ["amin"] } }}
                sort={{ last_message_at: -1, updated_at: -1 }}
                options={{ state: true, presence: true, limit: 10 }}
            />
            <Channel>
                <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput focus />
                </Window>
                <Thread />
            </Channel>
        </Chat>
    );
}

export default function ChatAppMain() {
    const [client, setClient] = useState();
    const [region, setRegion] = useState(Object.keys(creds)[0]);

    useEffect(() => {
        const cred = creds[region];
        console.log("region: ", region, cred);
        const c = new StreamChat(cred.key, { timeout: 7000 });
        c.setBaseURL(cred.baseURL || "https://chat.stream-io-api.com");
        c.connectUser({ id: userId }, creds[region].token);
        console.log('client from stream chat after init', c)
        setClient(c);

        //@ts-ignore
        window.client = c;
        return () => {
            c.disconnectUser();
        };
    }, [region]);

    return (
        <div className="container">
            <div>
                <div>
                    StreamChat.getInstance("892s22ypvt6m").setBaseURL("http://127.0.0.1:3030")
                </div>
                <label>App Region:</label>
                <select
                    onChange={(e) => {
                        setRegion(e.target.value);
                        setClient(undefined);
                    }}
                >
                    {Object.keys(creds).map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>

            {client && <ChatApp client={client} />}
        </div>
    );
}
