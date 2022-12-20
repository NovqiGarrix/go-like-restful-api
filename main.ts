import "@dotenv";

import { novo } from "@deps";
import createServer from "@app";
import logger from "@utils/logger.ts";

const abortController = new AbortController();

const PORT = +(Deno.env.get("PORT") || 4000);

const app = createServer();

const signals = ["SIGINT", "SIGTERM"];
for (let systemSignal of signals) {
    if (Deno.build.os === "windows" && systemSignal === "SIGTERM") {
        systemSignal = "SIGBREAK";
    }

    Deno.addSignalListener(systemSignal as Deno.Signal, () => {
        logger.warning(`Received ${systemSignal}, exiting...`.toUpperCase());
    });
}

globalThis.addEventListener("unload", () => {
    abortController.abort();
});

app.addEventListener("listen", async ({ hostname, port, serverType }) => {
    try {
        logger.info(`🔥 Connecting to Database 🚀`);
        await novo.connect(Deno.env.get("DATABASE_URL")!);

        logger.info(
            `Listening on ${hostname}:${port} with ${serverType} SERVER`
                .toUpperCase(),
        );
    } catch (error) {
        logger.error(`An error occurred in main.ts: ${error.message}`);
        Deno.exit(1);
    }
});

await app.listen({ port: PORT, signal: abortController.signal });
