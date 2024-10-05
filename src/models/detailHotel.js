import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    facilities: { type: [String], required: true },
    images: { type: [String], required: true },
    userId: { type: String, required: true }
});

hotelSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

hotelSchema.set('toJSON', {
    virtuals: true
});

const Hotel = mongoose.model("Detail-Hotel", hotelSchema);

export default Hotel;
