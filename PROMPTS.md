# Project Prompts

A chronological record of the prompts used to build **SG BusTiming**.

## Prompt 1 — Frontend Application

```text
1.build me a singapore based bus application that tracks real time bus arrivals times and include search bar to input bus stop code for quick access to arrival data and favorites functionality.2. build just the front end for now, i will establish an api connect later.
```

## Prompt 2 — LTA DataMall v3 Serverless API Connection

```text
1. add a serverless connection that pulls pulls data from lta data mall using the following end points: 
# Next buses at a stop (v3, the current version; refreshes every 20 seconds):
https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=04121
# To ask about one service only, add &ServiceNo=7
# Every request needs the header:  AccountKey: <LTA_ACCOUNT_KEY>
2.store this in /apiat project root level (not the src file)
3. include a /health.ts and /busarrival.ts within the same subfolder
4.Do not hardcode any key, I will input them manually
```

## Prompt 3 — Vercel Deployment Dependency Fix

```text
fix deployment error in vercel 10:19:48.314 Running build in Washington, D.C., USA (East) – iad1
10:19:48.314 Build machine configuration: 2 cores, 8 GB
10:19:48.435 Cloning github.com/Yerebek/bus-when-lta (Branch: main, Commit: fe37d63)
10:19:48.436 Previous build caches not available.
10:19:48.693 Cloning completed: 257.000ms
10:19:49.908 Running "vercel build"
10:19:49.919 Vercel CLI 66.6.0
10:19:50.846 Installing dependencies...
10:19:51.689 npm warn Unknown env config "cache-dir". This will stop working in the next major version of npm. See `npm help npmrc` for supported config options.
10:20:04.817 npm error code ERESOLVE
10:20:04.818 npm error ERESOLVE could not resolve
10:20:04.818 npm error
10:20:04.818 npm error Found: esbuild@0.25.12
10:20:04.819 npm error node_modules/esbuild
10:20:04.819 npm error   dev esbuild@"^0.25.0" from the root project
10:20:04.819 npm error
10:20:04.819 npm error Could not resolve dependency:
10:20:04.819 npm error peerOptional esbuild@"^0.27.0 || ^0.28.0" from vite@8.4.0
10:20:04.819 npm error node_modules/vite
10:20:04.819 npm error   vite@"^8.3.0" from the root project
10:20:04.819 npm error   peer vite@"^5.2.0 || ^6 || ^7 || ^8" from @tailwindcss/vite@4.3.5
10:20:04.819 npm error   node_modules/@tailwindcss/vite
10:20:04.819 npm error     @tailwindcss/vite@"^4.3.3" from the root project
10:20:04.819 npm error   1 more (@vitejs/plugin-react)
10:20:04.819 npm error
10:20:04.819 npm error Conflicting peer dependency: esbuild@0.28.2
10:20:04.819 npm error node_modules/tsx/node_modules/esbuild
10:20:04.819 npm error   peerOptional esbuild@"^0.27.0 || ^0.28.0" from vite@8.4.0
10:20:04.819 npm error   node_modules/vite
10:20:04.819 npm error     vite@"^8.3.0" from the root project
10:20:04.819 npm error     peer vite@"^5.2.0 || ^6 || ^7 || ^8" from @tailwindcss/vite@4.3.5
10:20:04.819 npm error     node_modules/@tailwindcss/vite
10:20:04.819 npm error       @tailwindcss/vite@"^4.3.3" from the root project
10:20:04.820 npm error     1 more (@vitejs/plugin-react)
10:20:04.820 npm error
10:20:04.820 npm error Fix the upstream dependency conflict, or retry this command with --force or --legacy-peer-deps to accept an incorrect (and potentially broken) dependency resolution.
10:20:04.820 npm error
10:20:04.820 npm error
10:20:04.820 npm error For a full report see:
10:20:04.820 npm error /vercel/.npm/_logs/2026-11-27T02_19_51_152Z-eresolve-report.txt
10:20:04.917 npm error A complete log of this run can be found in: /vercel/.npm/_logs/2026-11-27T02_19_51_152Z-debug-0.log
10:20:05.053 Error: [BUILD_UTILS_SPAWN_1] Command "npm install" exited with 1
```

## Prompt 4 — Collate Prompts

```text
collate all prompts and store them in PROMPTS.md
```
