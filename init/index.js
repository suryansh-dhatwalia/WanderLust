const mongoose = require("mongoose");
const initData = require("./data.js"); // Data imported
const Listing = require("../models/listing.js"); // Schema imported

async function main() {
  mongoose.connect("mongodb://localhost:27017/wanderlust");
}
main()
  .then((res) => console.log("Connection Successful"))
  .catch((err) => console.log(err));

const initDb = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "685b776054790d85e1f045b3",
  }));
  await Listing.insertMany(initData.data);
};
initDb();
