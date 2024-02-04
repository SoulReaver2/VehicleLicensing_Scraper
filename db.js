const mongoose = require("mongoose");
require("dotenv").config();

const vehicleLicenseSchema = new mongoose.Schema({
  _id: Number,
  legalName: String,
  licenseNumber: String,
  businessType: String,
  tradingNames: [{ type: String }],
  directors: [String],
  licenseType: String,
  licenseStatus: String,
  continuationDate: Date,
  trafficArea: String,
  contactDetails: Object,
  operatingCentres: [Object],
  authorizations: Object,
  transportManagers: [Object]
  //relatedOperatorsLicenses: [{ type: mongoose.Schema.Types.Number, ref: "vehicleLicense" }]
});

const aVehicleObject = {
  _id: 82734,
  legalName: "WINCANTON GROUP LIMITED",
  licenseNumber: "OF0083296",
  businessType: "Limited Company",
  tradingNames: [],
  directors: ["JAMES WROATH", "LYN COLLOFF", "TOM HINTON"],
  licenseType: "Standard International",
  licenseStatus: "valid",
  continuationDate: "30 Apr 2028",
  trafficArea: "East of England",
  contactDetails: {
    address: "WINCANTON FLEET SERVICES, PO BOX 1631, DONCASTER, DN1 9XB, GB"
  },
  operatingCentres: [
    {
      operatingCentre:
        "C/O TEXACO LIMITED, SERVICES COMPOUND, OLIVER ROAD, GRAYS, RM20 3ED, GB",
      heavyGoodVehicles: 12,
      trailers: 12
    },
    {
      operatingCentre:
        "BRITVIC NATIONAL DIST CENTRE, WELLINGTON PARK WAY, MAGNA PARK, LUTTERWORTH, LE17 4XW, GB",
      heavyGoodVehicles: 7,
      trailers: 10
    }
  ],
  authorisations: {
    totalNumberOfHeavyGoodsVehicles: 2381,
    totalNumberOfLightGoodsVehicles: 0,
    totalNumberOfTrailers: 3072
  },
  transportManagers: [
    { name: "Abubakar" },
    { name: "Kim Jong Un" },
    { name: "Hanzo Hazashi" }
  ]
};

const VehicleLicenseModel = mongoose.model(
  "vehicleLicense",
  vehicleLicenseSchema
);

const uri = process.env.MONGO_URI;

const connect = () => {
  return mongoose.connect(uri, {
    dbName: "test_vercel"
  });
};

connect()
  .then(async () => {
    console.log("Successfully connected to MongoDB");

    // empty the collection first
    await VehicleLicenseModel.deleteMany({});
    console.log(`Collection ${VehicleLicenseModel.modelName} cleared!`);

    const doc = await VehicleLicenseModel.create(aVehicleObject);
    console.log(`New listing created with the following id: ${doc._id}`);

    const all = await VehicleLicenseModel.find({});
    console.log(all);

    await mongoose.connection.close();
    console.log("Connection closed");
  })
  .catch((e) => {
    console.log(e.message);
  });
