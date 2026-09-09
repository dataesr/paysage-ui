# Paysage UI

In order to run paysage-ui properly you need to setup the backend by following instructions in https://github.com/dataesr/paysage-api/blob/main/README.md

Once you got it running, use the following command to start the app:

`npm install && npm start`


## Deployment

The version number follows [semver](https://semver.org/).

To deploy in production, simply run this command from your staging branch :

```sh
npm run deploy:[patch|minor|major]
```

:warning: Obviously, only members of the [dataesr organization](https://github.com/dataesr/) have rights to push on the repo.
