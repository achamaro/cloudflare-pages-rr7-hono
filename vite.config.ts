import adapter from "@hono/vite-dev-server/cloudflare";
import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import serverAdapter from "hono-react-router-adapter/vite";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig((_) => ({
	css: {
		postcss: {
			plugins: [tailwindcss, autoprefixer],
		},
	},
	ssr: {
		target: "webworker",
		noExternal: true,
		resolve: {
			conditions: ["workerd", "browser"],
		},
		optimizeDeps: {
			include: [
				"react",
				"react/jsx-runtime",
				"react/jsx-dev-runtime",
				"react-dom",
				"react-dom/server",
				"react-router",
			],
		},
	},
	plugins: [
		reactRouter(),
		serverAdapter({
			adapter,
			entry: "server/index.ts",
		}),
		tsconfigPaths(),
	],
}));
