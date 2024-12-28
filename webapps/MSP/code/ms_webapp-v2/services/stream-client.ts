import { StreamChat } from "stream-chat";

import appEnvConstants from "./app-env-constants";

const streamClient = StreamChat.getInstance(appEnvConstants.stream.clientKey);

export default streamClient;
