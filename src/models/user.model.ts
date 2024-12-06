import mongoose, { model, Document, Schema } from 'mongoose';
import validator from 'validator';
import { ObjectId } from '../types';
import bcrypt from 'bcryptjs';

interface IManufacturer extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    correctPassword(incomingPassword: string, storedPassword: string): Promise<boolean>;
}

const manufacturerSchema = new Schema<IManufacturer>(
    {
        name: {
            type: String,
            required: [true, 'Please provide your name'],
        },
        email: {
            type: String,
            required: [true, 'Please provide your email address'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false,
        },
    },
    { timestamps: true }
);

manufacturerSchema.pre<IManufacturer>('save', async function (next) {
    //ONly run this function if password was actually modified
    if (!this.isModified('password')) return next();

    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 8);

    next();
});

manufacturerSchema.methods.correctPassword = async function (incomingPassword: string, storedPassword: string) {
    return await bcrypt.compare(incomingPassword, storedPassword);
};

const Manufacturer = model<IManufacturer>('Manufacturer', manufacturerSchema);

export default Manufacturer;
