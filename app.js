const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

let posts = [
    {
        id: uuidv4(),
        username: "Yash Kumar",
        content: "I love aviation!"
    },
    {
        id: uuidv4(),
        username: "Manjeet singh",
        content: "I love coding!"
    },
    {
        id: uuidv4(),
        username: "Vivek walkey",
        content: "I play Guitar!"
    },
];

// ✅ Root route redirects to /posts
app.get("/", (req, res) => {
    res.redirect("/posts");
});

// ✅ Show all posts
app.get("/posts", (req, res) => {
    res.render("index.ejs", { posts });
});

// ✅ Create new post form
app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});

// ✅ Handle new post submission
app.post("/posts", (req, res) => {
    const { username, content } = req.body;
    const id = uuidv4();
    posts.push({ id, username, content });
    res.redirect("/posts");
});

// ✅ Show single post with 404 check
app.get("/posts/:id", (req, res) => {
    const { id } = req.params;
    const post = posts.find((p) => id === p.id);
    if (!post) {
        return res.status(404).send("Post not found");
    }
    res.render("show.ejs", { post });
});

// ✅ Edit post form with 404 check
app.get("/posts/:id/edit", (req, res) => {
    const { id } = req.params;
    const post = posts.find((p) => id === p.id);
    if (!post) {
        return res.status(404).send("Post not found");
    }
    res.render("edit.ejs", { post });
});

// ✅ Update post content
app.patch("/posts/:id", (req, res) => {
    const { id } = req.params;
    const newContent = req.body.content;
    const post = posts.find((p) => id === p.id);
    if (!post) {
        return res.status(404).send("Post not found");
    }
    post.content = newContent;
    res.redirect("/posts");
});

// ✅ Delete post
app.delete("/posts/:id", (req, res) => {
    const { id } = req.params;
    posts = posts.filter((p) => id !== p.id);
    res.redirect("/posts");
});

// ✅ Start server
app.listen(port, () => {
    console.log(`listening to port : ${port}`);
});
