const msg = `
    It will not provide any data. You'll need to call its SSE-RPC api.

    For more information, please see https://github.com/nhrones/KvRPC_TreeClient 
    
    This app implements both /routes/api/dispatch.ts and /routes/api/post.ts

    These API handlers are used to examine the DenoKv instance in this app.

    To use this service, with the TreeClient open,add the following url:
    https://fresh-sse-db.deno.dev/
`

export default function Home() {
  return (
    <div>
      <h1>A Simple Fresh-Based SSE-RPC Service Provider</h1>
      <h2>This is a static page!</h2>
      <pre>{msg}</pre>
    </div>
  );
}
