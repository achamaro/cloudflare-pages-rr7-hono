import adapter from "@hono/vite-dev-server/cloudflare";
import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import serverAdapter from "hono-react-router-adapter/vite";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { getLoadContext } from "./load-context";

export default defineConfig((_) => ({
	css: {
		postcss: {
			plugins: [tailwindcss, autoprefixer],
		},
	},
	ssr: {
		resolve: {
			externalConditions: ["workerd", "worker"],
		},
	},
	plugins: [
		reactRouter(),
		serverAdapter({
			adapter,
			entry: "server/index.ts",
			getLoadContext,
		}),
		tsconfigPaths(),
	],
}));
