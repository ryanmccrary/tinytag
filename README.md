# tinytag

This is a use-at-your-own-risk super-lightweight javascript SDK for use with RudderStack or Segment (and maybe works with others). Minimal functionality, intentionally so. Goal is to load and run super fast to only serverside destinations (mostly data warehouse)

### Does
- Support standard (`page`, `track`, `identify`, `group`) APIs
- Handle retries
- Use 1st party (client set) cookies for `anonymousId`, `userId`, and `traits`
- Use RudderStack or Segment cookies if they exist
- Send to any cloud mode (server-to-server) destination

### Does not
- Support device mode (client-side) integrations
- Handle sessions
- Handle consent
- Come with any support (but you can make a PR)

## Setup
Run your install
`npm install`

Normal tasks in `package.json` include:

`npm run build` to build from src
`npm test` to run test suite (it's thin for now)

## Usage
Install and customize and build whatever you want, or you can use the most recent from CDN:
`https://d1naog1jhl3jaq.cloudfront.net/tt.js`

To use on your website:
```
A snippet will go here
Eventually
```

Use your own RudderStack or Segment `writeKey` and `dataPlaneUrl` in the `init` and you're off to the races with the standard API spec.

- `window.tt.page()`
- `window.tt.track('event_name', { properties: 'here' })`
- `window.tt.identify('userId', { traits: 'here' })`
- `window.tt.group()`

For now, it reads Segment cookies and uses if they exist. Also checks RudderStack but (TODO) needs to decrypt/decode both types. 

## TODO
- [ ] Support reset()
- [ ] Read traits from localstorage
- [ ] Store traits to localstorage?
- [ ] Explore adding queue to localstorage (for durability)
- [ ] Probably should prepend cookies with something
- [ ] Need to decrypt and decode both RS cookies (don't want to include in core library)
- [ ] Actually manage sendEvent failures