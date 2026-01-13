import mongoose, { Document, Schema } from 'mongoose';

export interface IRating extends Document {
  user: mongoose.Types.ObjectId;
  movieId: number; // TMDB movie/show ID
  mediaType: 'movie' | 'tv'; // Type of media
  rating: number; // Rating value (1-10)
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new Schema<IRating>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A rating must belong to a user']
  },
  movieId: {
    type: Number,
    required: [true, 'A rating must have a movie/show ID']
  },
  mediaType: {
    type: String,
    enum: ['movie', 'tv'],
    required: [true, 'A rating must have a media type']
  },
  rating: {
    type: Number,
    required: [true, 'A rating must have a value'],
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating must be at most 10']
  }
}, {
  timestamps: true
});

// Compound index to ensure one rating per user per movie/show
ratingSchema.index({ user: 1, movieId: 1, mediaType: 1 }, { unique: true });

// Index for faster queries
ratingSchema.index({ user: 1 });
ratingSchema.index({ movieId: 1, mediaType: 1 });

const Rating = mongoose.model<IRating>('Rating', ratingSchema);
export default Rating;
