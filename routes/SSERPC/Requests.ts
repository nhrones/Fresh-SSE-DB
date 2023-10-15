import { HandlerContext } from "$fresh/server.ts";

const DEBUG = true

export const  handler = async (_req: Request, _ctx: HandlerContext): Promise<Response> => {
    const dataObject = await _req.json();
        if (DEBUG) console.info('Client Posted:', dataObject)
        const BC = new BroadcastChannel("sse-rpc");
        BC.postMessage(dataObject);
        BC.close();
        return new Response("",
        {
            status: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
        }
    );
  };