import {NextResponse} from "next/dist/server/web/spec-extension/response";

export const GET = () => {
  return NextResponse.json({
    name: "Test",
    message: "Hello word, dummy api route"
  });
};