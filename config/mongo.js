const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () =>
  console.log("Woot !!! Mongodb connected :)")
);

mongoose.connection.on("error", () =>
  console.log("Vtfe !!! db connection error :(")
);

