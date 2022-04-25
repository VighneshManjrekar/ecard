const { initializeApp } = require("firebase/app");
const { doc, updateDoc, getFirestore } = require("firebase/firestore")
initializeApp({
  apiKey: "AIzaSyB3rdSdpboFLC0YcMo2XSNKW-mMyw6vdL4",
  authDomain: "ecard-72ddc.firebaseapp.com",
  projectId: "ecard-72ddc",
  storageBucket: "ecard-72ddc.appspot.com",
  messagingSenderId: "56239962425",
  appId: "1:56239962425:web:f56501de378f77bc5a10e8"
});
const db = getFirestore()
const User = require("../model/userModel")

const resetDocs = async () => {
  try {
    const users = await User.find()
    users.forEach(async user => {
      let category = ["thankYou", "wellDone", "excellence", "attitude", "leader"]
      user.cardsUsed = 0
      user.cardsUsed = []
      category.forEach(cat => {
        user.cardsRecieved[`${cat}`].qty = 0
        user.cardsRecieved[`${cat}`].sentBy = []
      })
      user.cardSent = []
      console.log('ok')
      await user.save()
    })
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }

}

const getMax = async (arr, cat) => {
  let obj
  let max = 0
  arr.forEach(a => {
    if (a.max > max) {
      max = a.max
      obj = a
    }
  })
  if (obj) {
    console.log(obj)
    const winRef = doc(db, "ecard", cat);
    const winnerUser = await User.findById(obj._id)
    await updateDoc(winRef, {
      userName: winnerUser.userName,
      userMail: winnerUser.userMail,
      votes: obj.max
    })
  }
  resetDocs()
}

exports.updateMax = () => {
  let category = ["thankYou", "wellDone", "excellence", "attitude", "leader"]
  category.forEach(async cat => {
    let catWinnerArr = await User.aggregate([
      {
        $group: {
          _id: "$_id",
          max: { $max: `$cardsRecieved.${cat}.qty` }
        }
      }])
    getMax(catWinnerArr, cat)
  })
}