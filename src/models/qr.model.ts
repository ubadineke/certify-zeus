import mongoose, { model, Document, Schema } from 'mongoose';
import { ObjectId } from '../types';

interface IQrCode extends Document {
    _id: ObjectId;
    manufacturer: ObjectId;
    link: string;
}

const qrCodeSchema = new Schema<IQrCode>(
    {
        manufacturer: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Please provide manufacturer's id"],
        },
        link: {
            type: String,
            required: [true, 'Please provide base64 for qrcode'],
        },
    },
    { timestamps: true }
);

const Qr = model<IQrCode>('Qr', qrCodeSchema);

export default Qr;
