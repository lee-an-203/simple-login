const express = require("express");
const session = require("express-session");
const path = require("path");
const mysql = require("mysql2");

const app = express();


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "simple_login",
});


app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
    session({
        secret: "secret-key",
        resave: false,
        saveUninitialized: true,
    })
);

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return res.redirect("/success");
    }
    next();
}

app.get("/", isAuthenticated, (req, res) => {
    res.render("login", { error: null });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(query, [username, password], (err, results) => {
        if (err) {
            return res.send("Lỗi hệ thống!");
        }
        if (results.length > 0) {
            req.session.user = username;
            return res.redirect("/success");
        }
        res.render("login", { error: "Sai tên đăng nhập hoặc mật khẩu!" });
    });
});


app.get("/success", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/");
    }
    res.render("success", { username: req.session.user });
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(3000, () => {
    console.log(`Server đang chạy tại http://localhost:3000`);
});
