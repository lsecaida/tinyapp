const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

function generateRandomString() {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// POST route to create short URL and redirect
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(); // Generate a new short URL
  const longURL = req.body.longURL; // Get the long URL from the request body

  // Save the shortURL-longURL pair to the urlDatabase
  urlDatabase[shortURL] = longURL;

  // Redirect to the /urls/:id page for the newly created short URL
  res.redirect(`/urls/${shortURL}`);
});

app.use(express.urlencoded({ extended: true }));

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});

// Redirection route
app.get("/u/:id", (req, res) => {
  if (!urlDatabase[req.params.id]) {
    res
      .status(404)
      .send(
        `'${req.params.id}' does not exist in the database. Check /urls for reference.`
      );
  } else {
    const longURL = urlDatabase[req.params.id];
    // Redirects to the actual website that the short URL represents
    res.redirect(longURL);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
