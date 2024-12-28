import { StreamChat } from "stream-chat";
import type { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const { id } = query;

  const serverClient = new StreamChat(
    process.env.NEXT_PUBLIC_STREAM_KEY,
    process.env.NEXT_PUBLIC_STREAM_SECRET
  );

  const token = serverClient.createToken(id as string);

  res.status(200).json({
    token,
  });
};
