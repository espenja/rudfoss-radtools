# React-IMO

An opinionated stack for React and Node.

## Comparison with NextJs

- No custom router
- No magic page components
- No `next.config.js` that magically maps to some webpack stuff and something else
- No magic `getStaticPageProps` and other such functions
- No magic handling of "some" TypeScript config

- Just pure React with any routing library you wish (or none if you don't need one)
- Fast development
- Immediately debuggable from VSCode (my preferred IDE)
- TypeScript all the way (including configuration)
- Can be easily run from command line (node)
- Minimal plumbing
- Full support for mono-repo solutions
- Uses well supported tools: React, webpack, TypeScript, ExpressJS
- Fully bundled client and server (no need to deploy 100k files in node_modules)

## Guidelines

Anything related to the request should be attached to the `req` object. This means internal state, session, loggers, instance vars and other data. `req` binds it all together.

## Run dev environment

The dev environment supports hot-reloading of client assets through the webpack-dev-server.
