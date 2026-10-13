import { spawn } from "node:child_process";
const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("Invalid local port");
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "production",
      RPK_LOCAL_PREVIEW: "true",
      PUBLIC_ORIGIN: `http://127.0.0.1:${port}`,
    },
  },
);
child.once("exit", (code) => {
  process.exitCode = code ?? 1;
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.once(signal, () => child.kill(signal));
