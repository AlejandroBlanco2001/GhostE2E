import { FullConfig } from "@playwright/test";
import { startGhostAndSetup } from "./e2e-playwright/util/util";

async function globalSetup(config: FullConfig) {
    await startGhostAndSetup();
}

export default globalSetup;