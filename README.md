# POC: Nextjs + PWA + mui

https://github.com/MariaVla/pwa-nextjs-starter/pull/1
https://pwa-nextjs-starter-kvuocxrq2-mariavla.vercel.app/login

- React Query - fetching library
- React Hook Forms - forms library
- JSON Server for API mock
- Material UI
- i18n

### TODO

- Make login functional
- React Query post example
- Complete i18n

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

## Dependencies

- nvm -v → 0.39.1

- node -v → v18.7.0

- npm -v → 8.15.1

- yarn -v → 1.22.17

## To run JSON server locally (our mock database) - Or use https://my-fake-json-server.herokuapp.com if working

`$ yarn serve-json`

This will create some endpoints define in the `db.json` where you can fetch data.

`http://localhost:4000/superheroes`
`http://localhost:4000/superheroes/:id`
`http://localhost:4000/friends`
`http://localhost:4000/friends/:id`

You can also make `post/put/delete` requests. Example:

```javascript
const createUser = () => {
  axios
    .post('http://localhost:4000/superheroes', {
      id: 4,
      name: 'The Flash',
      alterEgo: 'Barry Allen'
    })
    .then((resp) => {
      console.log(resp.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const updateUser = () => {
  axios
    .put('http://localhost:4000/superheroes/4', {
      name: 'Flash',
      alterEgo: 'Barry Allen'
    })
    .then((resp) => {
      console.log(resp.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const deleteUser = () => {
  axios
    .delete('http://localhost:4000/superheroes/4')
    .then((resp) => {
      console.log(resp.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
```

---

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
