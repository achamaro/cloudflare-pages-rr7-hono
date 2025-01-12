import type { Context } from "hono";
import type { AppLoadContext } from "react-router";
import type { PlatformProxy } from "wrangler";
import { SessionCookie } from "./app/cookie.server";

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

export interface HonoEnv {
	Variables: {
		userName?: string;
	};
	Bindings: Env;
}

declare module "react-router" {
	interface AppLoadContext {
		cloudflare: Cloudflare;
		hono: {
			context: Context<HonoEnv>;
		};
		isProduction: boolean;
		sessionCookie: {
			serialize: ReturnType<typeof SessionCookie>["serialize"];
		};
	}
}

type GetLoadContext = (args: {
	request: Request;
	context: {
		cloudflare: Cloudflare;
		hono: { context: Context<HonoEnv> };
	};
}) => AppLoadContext;

export const getLoadContext: GetLoadContext = ({ context }) => {
	const {
		cloudflare: { env },
	} = context;

	const isProduction = env.APP_ENV === "production";

	return {
		...context,
		isProduction,
		sessionCookie: {
			serialize: async (value, options) => {
				return await SessionCookie(
					env.SESSION_COOKIE_SECRETS,
					isProduction,
				).serialize(value, options);
			},
		},
	};
};
