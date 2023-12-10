// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $SSERPC_kvRegistration from "./routes/SSERPC/kvRegistration.ts";
import * as $SSERPC_kvRequest from "./routes/SSERPC/kvRequest.ts";
import * as $SSERPC_remoteProcedures from "./routes/SSERPC/remoteProcedures.ts";
import * as $_app from "./routes/_app.tsx";
import * as $index from "./routes/index.tsx";

import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/SSERPC/kvRegistration.ts": $SSERPC_kvRegistration,
    "./routes/SSERPC/kvRequest.ts": $SSERPC_kvRequest,
    "./routes/SSERPC/remoteProcedures.ts": $SSERPC_remoteProcedures,
    "./routes/_app.tsx": $_app,
    "./routes/index.tsx": $index,
  },
  islands: {},
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
