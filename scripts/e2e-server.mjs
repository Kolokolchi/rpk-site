import { spawn } from "node:child_process";
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3100",
  ],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "production",
      VERCEL: "",
      RPK_LOCAL_PREVIEW: "true",
      PUBLIC_ORIGIN: "http://127.0.0.1:3100",
      ALLOWED_HOSTS: "127.0.0.1:3100",
    },
  },
);
child.once("exit", (code) => {
  process.exitCode = code ?? 1;
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.once(signal, () => child.kill(signal));
