const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

// New POST route to handle URL deletions
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;

  // Check if the URL with the given id exists in the database
  if (urlDatabase[id]) {
    // Delete the URL from the database
    delete urlDatabase[id];
    res.redirect("/urls"); // Redirect to the list of URLs after deletion
  } else {
    res.status(404).send("URL not found"); // Handle the case where the URL doesn't exist
  }
});

app.post("/urls/:id/update", (req, res) => {
  const id = req.params.id; // Get the ID from the URL parameter
  const newLongURL = req.body.newLongURL; // Get the new long URL from the form data

  // Check if the ID exists in the database
  if (urlDatabase[id]) {
    // Update the URL in the database with the newLongURL
    urlDatabase[id] = newLongURL;

    // Redirect to the page displaying the updated URL (you can choose an appropriate route)
    res.redirect("/urls/" + id);
  } else {
    // Handle the case where the ID doesn't exist (e.g., show an error page)
    res.status(404).send("URL not found");
  }
});

app.use((req, res, next) => {
  if (req.cookies && req.cookies.username) {
    res.locals.username = req.cookies.username;
  }
  next();
});

app.use((req, res, next) => {
  res.locals.username = req.cookies.username;
  next();
});

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

app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    // ... any other vars
  };
  res.render("urls_index", templateVars);
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

app.post("/login", (req, res) => {
  const username = req.body.username; // Get the username from the request body
  res.cookie("username", username); // Set the username in a cookie
  res.redirect("/urls"); // Redirect back to the /urls page
});

app.post("/logout", (req, res) => {
  // Clear the username cookie
  res.clearCookie("username");

  // Redirect the user back to the /urls page (or any other desired page)
  res.redirect("/urls");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
