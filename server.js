const express = require("express");
const session = require("express-session");
const path = require("path");
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");


const app = express();

const mongoUrl = process.env.MONGO_URL || "mongodb://admin:admin@mongo:27017/mydatabase?authSource=admin";
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("kết nối thành côngcông MongoDB");
}).catch(err => {
    console.error(" Lỗi kết nối MongoDB:", err);
    process.exit(1);
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { collection: 'account' });

const User = mongoose.model("User", UserSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({ secret: "secret-key", resave: false, saveUninitialized: true }));

function isAuthenticated(req, res, next) {
    if (req.session.user) return res.redirect("/success");
    next();
}

app.get("/", isAuthenticated, (req, res) => {
    res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        console.log(user)
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render("login", { error: "Thông tin không chính xác!" });
        }

        req.session.user = username;
        res.redirect("/success");
    } catch (err) {
        console.error(" Lỗi khi tìm người dùng:", err);
        res.send("Lỗi hệ thống!");
    }
});

app.get("/success", (req, res) => {
    if (!req.session.user) return res.redirect("/");
    res.render("success", { username: req.session.user });
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

app.get("/users", async (req, res) => {
    const user = await User.find(); 

    res.send(user);
});



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(3000, () => {
    console.log(` Server đang chạy tại http://localhost:3000`);
});
