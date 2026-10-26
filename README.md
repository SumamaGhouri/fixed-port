# Sumama Ghouri: 3D Portfolio (MERN)

React front end + Express/Node API + MongoDB. Visually identical to the original static project:
the same CSS, the same three.js build, the same scene code, videos, images, themes and auto tour.

## Structure
```
client/                 React (Vite)
  public/               videos/, images/, js/three.min.js (unchanged originals)
  src/style.css         original stylesheet, untouched
  src/engine/engine.js  original main.js 3D/theme/tour logic (with cleanup for React)
  src/components/       Background, Hud (nav, HUD, loader, controls), Sections (all page content)
  src/data/             bundled fallback content
server/                 Express API + Mongoose
  routes/portfolio.js   GET /api/portfolio, PUT /api/portfolio (x-admin-key)
  models/Portfolio.js
  data/portfolio.json   seed/fallback content
```

## Run locally
```
npm run install:all
cp server/.env.example server/.env     # add MONGO_URI (optional)
npm run seed                           # copies content into MongoDB (needs MONGO_URI)
npm run dev                            # web http://localhost:5173, api http://localhost:5000
```
Without `MONGO_URI` the API serves the bundled content, and if the API is down the React app uses its own bundled copy, so the site always renders.

## Production
```
npm start      # builds the client and serves it from Express on PORT (default 5000)
```
Deploy the whole repo to Render/Railway (Node), with `MONGO_URI` and `ADMIN_KEY` set.
Or host `client/dist` alone as a static site (it uses the bundled data, no server needed).

### Cloudflare (Workers & Pages, connected to GitHub)
- Build command: `npm install --prefix client && npm run build --prefix client`
- Build output directory: `client/dist`
- Every push to `main` redeploys. Add a custom domain under the project's Custom domains tab.
- The live API is skipped on static deploys. To use it, set `VITE_USE_API=1` and host the server separately.

## Editing content
Edit `server/data/portfolio.json` and run `npm run seed`, or send the full JSON with
`PUT /api/portfolio` and header `x-admin-key: <ADMIN_KEY>`.
Put your CV at `client/public/Sumama_Ghouri_CV.pdf` for the Download CV button.
# fixed-port
