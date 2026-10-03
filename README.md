# Paws Home - Pet Adoption Platform (MERN)

A learning project. Visitors browse pets (breed, age, location), and submit adoption requests.
A shelter admin adds pets and approves or rejects requests.

Every code file has a comment on (almost) every line. Read them in the order given in "Reading order".

---

## 1. What is MERN? (in plain words)

Think of a restaurant.

| Letter | Tool | Restaurant role | Where in this project |
|---|---|---|---|
| M | MongoDB | The pantry: stores all ingredients (data) | `server/models/*` define what is stored |
| E | Express | The waiter: takes an order (request), brings back a dish (response) | `server/server.js`, `routes/`, `controllers/` |
| R | React | The dining room: what the customer sees and touches | everything in `client/src` |
| N | Node.js | The kitchen building: lets JavaScript run outside a browser, on a server | runs `server.js` |

JavaScript is the one language used in all four, which is why MERN is popular for learners.

---

## 2. Architecture

```
 BROWSER (React, port 5173)            SERVER (Node + Express, port 5000)         DATABASE
+---------------------------+  HTTP   +----------------------------------+      +-----------+
| pages / components        | ------> | routes -> controllers -> models  | ---> | MongoDB   |
| api.js  (fetch calls)     | <------ | (JSON in, JSON out)              | <--- | pets      |
+---------------------------+  JSON   +----------------------------------+      | requests  |
                                                                                 +-----------+
```

- **HTTP** = the language browser and server speak. Each message has a *method* (GET = read, POST = create,
  PUT/PATCH = change, DELETE = remove) and a *URL*.
- **JSON** = text format for data: `{"name":"Bruno","age":3}`.
- **API** = the list of URLs the server offers (see section 6).

---

## 3. Folder map

```
pet-adoption/
  server/
    server.js                  entry point: starts Express, connects DB, mounts routes
    seed.js                    fills DB with sample pets
    config/db.js               connects to MongoDB
    models/Pet.js              shape of a pet record
    models/AdoptionRequest.js  shape of a request record
    routes/                    URL -> controller function
    controllers/               the logic (validate, save, update)
  client/
    index.html                 the single HTML page
    src/main.jsx               starts React
    src/App.jsx                header + which page for which URL
    src/api.js                 all calls to the backend
    src/pages/                 PetList, PetDetail, AdminDashboard
    src/components/            PetCard, AdoptionForm
    src/index.css              styling
```

---

## 4. Run it

Requirements: Node.js 18+ and MongoDB (local install, or a free MongoDB Atlas URL).

```bash
# Terminal 1 - backend
cd server
cp .env.example .env        # then edit MONGO_URI if needed
npm install
npm run seed                # optional: adds 4 sample pets
npm run dev                 # http://localhost:5000

# Terminal 2 - frontend
cd client
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

Quick check: open http://localhost:5000/api/pets - you should see the pets as JSON.

---

## 5. Data model

**Pet**: name, species, breed, age, gender, location, description, imageUrl, status (`Available` | `Adopted`)

**AdoptionRequest**: pet (id of a Pet), applicantName, email, phone, message,
status (`Pending` | `Approved` | `Rejected`)

The `pet` field is a *reference*: the request stores only the pet's id, and `populate("pet")` swaps in the full pet
when the admin page needs the pet's name.

Business rules coded in `requestController.js`:
1. You cannot request a pet that does not exist or is already `Adopted`.
2. Approving a request marks the pet `Adopted`.
3. Approving also auto-rejects the other `Pending` requests for that pet.

---

## 6. API reference

| Method | URL | Purpose |
|---|---|---|
| GET | `/api/pets?species=Dog&breed=lab&location=nagpur` | list / filter pets |
| GET | `/api/pets/:id` | one pet |
| POST | `/api/pets` | add pet |
| PUT | `/api/pets/:id` | edit pet |
| DELETE | `/api/pets/:id` | delete pet + its requests |
| POST | `/api/requests` | submit adoption request |
| GET | `/api/requests` | list requests (with pet details) |
| PATCH | `/api/requests/:id` | body `{"status":"Approved"}` |

Try them without the website (replace IDs with real ones from the first command):

```bash
curl http://localhost:5000/api/pets
curl -X POST http://localhost:5000/api/requests -H "Content-Type: application/json" \
  -d '{"pet":"PET_ID","applicantName":"Asha","email":"asha@example.com","message":"I have a garden"}'
curl -X PATCH http://localhost:5000/api/requests/REQUEST_ID -H "Content-Type: application/json" \
  -d '{"status":"Approved"}'
```

---

## 7. How the program flows (step by step)

### Flow A - Server starts
1. `node server.js` runs. `dotenv` loads `.env` so `PORT` and `MONGO_URI` are known.
2. `connectDB()` opens the MongoDB connection (`config/db.js`).
3. Middleware is registered: `cors()` (allow the React site), `express.json()` (understand JSON bodies).
4. Routers are mounted at `/api/pets` and `/api/requests`.
5. `app.listen` waits for requests.

### Flow B - Visitor opens the home page and searches "Dog" in "Nagpur"
1. Browser loads `index.html`, which loads `main.jsx`; React draws `<App />` inside `<div id="root">`.
2. Router sees URL `/` and renders `PetList`.
3. `useEffect` in `PetList` runs on first display and calls `fetchPets(filters)` from `api.js`.
4. `fetch` sends `GET /api/pets?` to the server. (Empty filters are removed.)
5. Express matches `/api/pets` -> `petRoutes` -> `getPets` in `petController`.
6. `Pet.find({})` asks MongoDB for all pets; results return as JSON.
7. React stores them with `setPets`, which triggers a re-draw: one `PetCard` per pet.
8. The visitor picks "Dog" and types "Nagpur". `setFilters` changes state; `useEffect` depends on `[filters]`
   so it runs again, now calling `GET /api/pets?species=Dog&location=Nagpur`.
   `getPets` builds `{species:"Dog", location:/Nagpur/i}` and MongoDB returns only matches.

### Flow C - Visitor views a pet and submits an adoption request
1. Clicking a card changes the URL to `/pets/<id>`; `PetDetail` reads the id with `useParams`.
2. It calls `GET /api/pets/<id>` and shows breed, age, gender, location, description and status.
3. If status is `Available`, `AdoptionForm` appears. Each keystroke calls `handleChange`, updating the `form` state
   (this is a *controlled input*: React always knows the text).
4. On submit, `handleSubmit` calls `submitRequest({...form, pet: petId})` -> `POST /api/requests`.
5. `createRequest` checks the pet exists and is not `Adopted`, then `AdoptionRequest.create(...)`.
   Mongoose validates (valid email, name present). Status starts as `Pending`.
6. Server replies `201`; the form shows "Request sent". If validation fails, the server replies `400` with a
   message and `api.js` throws it, so the form shows the error in red.

### Flow D - Admin manages pets and requests (`/admin`)
1. Page load: `loadAll()` fetches pets and requests at the same time with `Promise.all`.
2. **Add pet**: form -> `POST /api/pets` -> saved -> `loadAll()` refreshes the list.
3. **Approve request**: button -> `PATCH /api/requests/<id>` with `{"status":"Approved"}`. Server:
   - sets the request to `Approved`
   - sets the pet to `Adopted`
   - sets all other `Pending` requests for the same pet to `Rejected`
4. **Delete pet**: `DELETE /api/pets/<id>` also deletes the pet's requests so nothing points to a missing pet.

### Request life-cycle in one picture
```
Click "Send adoption request"
   -> handleSubmit (AdoptionForm.jsx)
   -> submitRequest (api.js)  --HTTP POST-->  server.js (cors, express.json)
   -> requestRoutes.js  -> createRequest (requestController.js)
   -> Pet.findById + AdoptionRequest.create (Mongoose)  -> MongoDB
   <- JSON 201  <- res.status(201).json(request)
   -> setStatus("Request sent!")  -> React re-draws the message
```

---

## 8. Core concepts cheat-sheet

| Concept | One-line meaning | Seen in |
|---|---|---|
| Component | A function that returns a piece of screen | every `.jsx` |
| JSX | HTML-looking syntax inside JavaScript | `return (<div>...</div>)` |
| Props | Inputs given by a parent component | `<PetCard pet={pet} />` |
| State (`useState`) | Data that, when changed, re-draws the screen | `PetList`, `AdoptionForm` |
| `useEffect` | "Run this code after drawing / when X changes" | loading data |
| Router | Different URL -> different component, no page reload | `App.jsx` |
| Middleware | Code that runs before every route | `cors()`, `express.json()` |
| Route | URL + method -> function | `routes/` |
| Controller | The function containing the logic | `controllers/` |
| Schema / Model | Blueprint / tool for a MongoDB collection | `models/` |
| Validation | Refusing bad data | `required`, `enum`, `min`, `match` |
| `async/await` | Wait for slow work without freezing | controllers, `api.js` |
| CORS | Server permission for another site to call it | `server.js` |
| Environment variables | Settings kept outside code (`.env`) | `dotenv`, `VITE_API_URL` |
| Populate | Replace an id with the full linked document | `getRequests` |
| Status codes | 200 OK, 201 Created, 400 bad input, 404 not found, 500 server error | controllers |

---

## 9. Reading order (recommended)

1. `server/server.js` -> 2. `config/db.js` -> 3. `models/Pet.js` -> 4. `routes/petRoutes.js` ->
5. `controllers/petController.js` -> 6. `models/AdoptionRequest.js` -> 7. `controllers/requestController.js` ->
8. `client/src/main.jsx` -> 9. `App.jsx` -> 10. `api.js` -> 11. `pages/PetList.jsx` ->
12. `components/PetCard.jsx` -> 13. `pages/PetDetail.jsx` -> 14. `components/AdoptionForm.jsx` ->
15. `pages/AdminDashboard.jsx`

JSON files (`package.json`) cannot hold comments: `dependencies` lists libraries to install, `scripts` are
shortcuts (`npm run dev`).

---

## 10. Known simplifications (ideas for your next step)

- The admin page has **no login**; anyone can open `/admin`. Next step: add JWT authentication and an `admin` role.
- No image upload; photos are links. Next: Multer + cloud storage.
- No pagination. Next: `limit` and `skip` in `getPets`.
- No automated tests. Next: Jest + Supertest for the API.
