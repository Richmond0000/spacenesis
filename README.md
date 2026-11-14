# SPACENESIS

SPACENESIS is a spaceflight health monitoring prototype built with React, Vite, and Three.js. It presents sample physiological, behavioral, bone-health, and spacecraft-environment indicators with crew self-report and review flows.

## Run locally

1. Install [Node.js](https://nodejs.org/).
2. In this folder, run `npm install`.
3. Run `npm run dev` and open the local address printed in the terminal.

To create a production build, run `npm run build`.

## Data and safety

The displayed readings are illustrative demo data. The prototype is not connected to NASA data feeds, spacecraft sensors, or clinical systems, and it does not provide medical advice.

## Collaboration and deployment

Keep `.env.local`, `.env*` files, `.vercel`, `node_modules`, and `dist` out of Git. Once this repository is connected to the SPACENESIS Vercel project, pushes to the production branch can deploy the site and pull requests can receive preview deployments.
