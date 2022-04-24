const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const Server = require('./serverModel')

const userSchema = new Schema({
    userMail: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    passWord: {
        type: String,
        required: true,
    },
    cardsUsed: [],
    cardSent: {
        details: [
            {
                sentTo: { type: String },
                cardType: { type: String },
                date: { type: Date, default: Date.now }
            }
        ]
    },
    cardsRecieved: {
        thankYou: { qty: { type: Number, default: 0 }, sentBy: [] },
        wellDone: { qty: { type: Number, default: 0 }, sentBy: [] },
        excellence: { qty: { type: Number, default: 0 }, sentBy: [] },
        attitude: { qty: { type: Number, default: 0 }, sentBy: [] },
        leader: { qty: { type: Number, default: 0 }, sentBy: [] },
    }
});

userSchema.methods.addCard = function (sentTo, cardType) {
    let cardDetails = {
        sentTo, cardType
    }
    console.log(cardDetails)
    this.cardsUsed.push(cardType);

    const allCards = [...this.cardSent.details];
    allCards.push(cardDetails);
    this.cardSent.details = allCards
    return this.save();
}

module.exports = mongoose.model("User", userSchema);

// db.users.aggregate({ $group: { _id: "$_id",max: { $max: `$cardsRecieved.thankYou.qty` } } })

