import mongoose from "mongoose";

//TODO build the controller and router for this, should only be accesible for the admin
//this is up for change
const trackingSchema = new mongoose.Schema({
  tracking_number: {
    type: Number,
    required: true,
  },
  order: {
    order: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
});

const Tracking = mongoose.model("Tracking", trackingSchema);
export default Tracking;
