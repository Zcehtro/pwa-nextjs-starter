# POC: Nextjs + PWA + mui

Clone the repo and run:

```sh
yarn install
yarn dev
```

## PWA

This example uses `next-pwa` based on Nextjs example -> https://github.com/vercel/next.js/tree/canary/examples/progressive-web-app

### Issues encounter with `next-pwa` latest version: `5.5.5`

Had to downgrade to `next-pwa` `5.5.4`. Source: https://github.com/shadowwalker/next-pwa/issues/383

## Material UI

The project uses [Next.js](https://github.com/vercel/next.js), which is a framework for server-rendered React apps.
It includes `@mui/material` and its peer dependencies, including `emotion`, the default style engine in MUI v5. If you prefer, you can [use styled-components instead](https://mui.com/material-ui/guides/interoperability/#styled-components).

## The link component

Next.js has [a custom Link component](https://nextjs.org/docs/api-reference/next/link).
The example folder provides adapters for usage with MUI.
More information [in the documentation](https://mui.com/material-ui/guides/routing/#next-js).
