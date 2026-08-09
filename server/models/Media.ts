import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  title: string;
  category: 'Kalyanam' | '28-Kett' | 'Corporate' | 'Stage Decor' | 'Cultural';
  mediaType: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  description?: string;
  createdAt: Date;
}

const MediaSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Kalyanam', '28-Kett', 'Corporate', 'Stage Decor', 'Cultural'] 
  },
  mediaType: { type: String, required: true, enum: ['image', 'video'] },
  url: { type: String, required: true },
  thumbnailUrl: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);
