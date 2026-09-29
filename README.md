# Ahmed Khaled Mahmoud — Portfolio

Personal portfolio for Ahmed Khaled Mahmoud, built with React, Vite, and TypeScript.

## Run locally

Requirements: Node.js and pnpm.

```sh
pnpm install --filter @workspace/ahmed-khaled-portfolio...
PORT=25482 BASE_PATH=/ pnpm --filter @workspace/ahmed-khaled-portfolio run dev
```

Open http://localhost:25482. To create a production build, run:

```sh
PORT=25482 BASE_PATH=/ NODE_ENV=production pnpm --filter @workspace/ahmed-khaled-portfolio run build
```

The portfolio source is in `artifacts/ahmed-khaled-portfolio`. The small workspace manifests and `lib/api-client-react` package are included to preserve its pnpm workspace setup.
