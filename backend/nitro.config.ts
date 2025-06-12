//https://nitro.unjs.io/config
export default defineNitroConfig({
  experimental: {
    database: true,
  },
  devDatabase: {
    default: {
      connector: "postgresql",
      options: {
        url: "postgresql://postgres:postgres@localhost:5431/over_todo",
      },
    },
  },
  srcDir: "server",
  compatibilityDate: "2025-06-12",
});
