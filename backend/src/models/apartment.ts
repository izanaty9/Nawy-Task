import mongoose, { Schema, Document } from 'mongoose';

export interface IApartment extends Document {
  unitName: string;
  unitNumber: string;
  project: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  images: string[];
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ApartmentSchema: Schema = new Schema({
  unitName: { type: String, required: true },
  unitNumber: { type: String, required: true },
  project: { type: String, required: true },
  price: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: Number, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  amenities: [{ type: String }],
}, { timestamps: true });

ApartmentSchema.index({
  unitName: 'text',
  unitNumber: 'text',
  project: 'text'
});

export default mongoose.model<IApartment>('Apartment', ApartmentSchema);