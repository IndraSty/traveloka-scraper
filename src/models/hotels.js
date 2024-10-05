import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    title: { type: String, required: true },
    addr: { type: String, required: true },
    originalPrice: { type: String, required: true },
    price: { type: String, required: true },
    rate: { type: String, required: true },
    review: { type: String, required: true },
    image: { type: String, required: true },
    userId: { type: String, required: true }
});

hotelSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

hotelSchema.set('toJSON', {
    virtuals: true
});

const Hotels = mongoose.model("Hotels", hotelSchema);

export default Hotels;
