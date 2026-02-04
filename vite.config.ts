import { fileURLToPath, URL } from "node:url";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { questions } from "./src/data/questions";
import { typeResults } from "./src/data/type-results";

const quizRoutes = Array.from(
	{ length: questions.length },
	(_, index) => `/quiz/${index + 1}`,
);
const resultRoutes = Array.from(
	{ length: typeResults.length },
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
				// @ts-expect-error routes is documented but missing from types
				routes: prerenderRoutes,
			},
		}),
		viteReact(),
	],
});

export default config;
