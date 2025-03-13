const mongoose = require("mongoose");

const mongoUrll = process.env.MONGO_URLL || "mongodb://admin:admin@mongo:27017/mydatabase?authSource=admin";

mongoose.connect(mongoUrll, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
}, {
    collection: 'account'
});

const User = mongoose.model("User", UserSchema);

async function seedDatabase() {
    try {
        const existingUser = await User.findOne({ username: "admin@gmail.com" });

        if (!existingUser) {
            await User.create({
                username: "admin@gmail.com",
                password: "123456"
            });
            console.log(" Tạo tài khoản admin thành công!");
        } else {
            console.log(" Tài khoản admin đã tồn tại!");
        }
    } catch (error) {
        console.error(" Lỗi khi seed dữ liệu:", error);
    } finally {
        mongoose.connection.close();
    }
}

seedDatabase();
