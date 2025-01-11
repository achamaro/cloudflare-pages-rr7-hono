import type { Context } from "hono";
import type { AppLoadContext } from "react-router";
import type { PlatformProxy } from "wrangler";

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

export interface HonoEnv {
	Bindings: Env;
}

declare module "react-router" {
	interface AppLoadContext {
		cloudflare: Cloudflare;
		hono: {
			context: Context<HonoEnv>;
		};
		isProduction: boolean;
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

	return {
		...context,
		isProduction: env.APP_ENV === "production",
	};
};
