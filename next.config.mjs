// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs")); // skipcq: JS-0093

import withMarkdoc from "@markdoc/next.js";

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    swcMinify: true,
    i18n: {
        locales: ["en"],
        defaultLocale: "en",
    },
    images: {
        domains: ["cdn.discordapp.com"],
        loader: "custom",
        loaderFile: "./src/image-loader.js",
    },
    async redirects() {
        return [
            {
                source: "/invite",
                destination: "/api/invite",
                permanent: true,
            },
            {
                source: "/support",
                destination: "/api/support",
                permanent: true,
            },
        ];
    },
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    experimental: {
        scrollRestoration: true,
    },
};

export default withMarkdoc({
    mode: "static",
})(config);
