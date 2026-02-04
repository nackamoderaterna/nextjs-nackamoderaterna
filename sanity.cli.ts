import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "0vagy5jk",
    dataset: "production",
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  deployment: { autoUpdates: true },
});
