import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    define: {
      "process.env.ACCU_WEATHER_API_KEY": JSON.stringify(
        process.env.ACCU_WEATHER_API_KEY
      ),
      "process.env.IP_INFO_TOKEN": JSON.stringify(process.env.IP_INFO_TOKEN),
    },
  },
});
