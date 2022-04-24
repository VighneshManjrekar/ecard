const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const winnerSchema = new Schema({
    thankYou: { userName: { type: String, default: "" }, userMail: { type: String, default: "" } },
    wellDone: { userName: { type: String, default: "" }, userMail: { type: String, default: "" } },
    excellence: { userName: { type: String, default: "" }, userMail: { type: String, default: "" } },
    attitude: { userName: { type: String, default: "" }, userMail: { type: String } },
});


module.exports = mongoose.model("Winner", winnerSchema);

