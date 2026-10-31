import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function rsvpDev(env) {
  return {
    name: "rsvp-dev",
    configureServer(server) {
      server.middlewares.use("/api/rsvp", async (req, res) => {
        Object.assign(process.env, env);
        let raw = "";
        for await (const chunk of req) raw += chunk;
        try {
          req.body = raw ? JSON.parse(raw) : {};
        } catch {
          req.body = {};
        }
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (obj) => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(obj));
        };
        const mod = await server.ssrLoadModule("/api/rsvp.js");
        await mod.default(req, res);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return { plugins: [react(), rsvpDev(env)] };
});
