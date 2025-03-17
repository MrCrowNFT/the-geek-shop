import mongoose from "mongoose";

//TODO build the controller and router for this, should only be accesible for the admin
const trackingSchema = new mongoose.Schema({
  tracking_number: {
    type: Number,
  },
  order: {
    order: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
});

const Tracking = mongoose.model("Tracking", trackingSchema);
export default Tracking;
