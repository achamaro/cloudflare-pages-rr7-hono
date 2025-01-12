// functions/[[path]].ts
import handle from "hono-react-router-adapter/cloudflare-pages";
import * as build from "../build/server";
import { getLoadContext } from "../load-context";
import server from "../server";

export const onRequest = handle(build, server, { getLoadContext });
