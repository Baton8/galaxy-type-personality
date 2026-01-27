import { fileURLToPath, URL } from "node:url";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const quizRoutes = Array.from(
	{ length: 10 },
	(_, index) => `/quiz/${index + 1}`,
);
const resultRoutes = Array.from(
	{ length: 8 },
	(_, index) => `/result/${index + 1}`,
);
const prerenderRoutes = ["/", ...quizRoutes, ...resultRoutes];

const config = defineConfig({
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	plugins: [
		devtools(),
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		// this is the plugin that enables path aliases
		viteTsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
		tailwindcss(),
		tanstackStart({
			prerender: {
				enabled: true,
				autoStaticPathsDiscovery: false,
				crawlLinks: true,
				autoSubfolderIndex: true,
				routes: prerenderRoutes,
			},
		}),
		viteReact(),
	],
});

export default config;
