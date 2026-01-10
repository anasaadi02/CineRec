import mongoose, { Document, Schema } from 'mongoose';

export interface IMovieItem {
  movieId: number; // TMDB movie ID
  title: string;
  posterPath?: string;
  releaseDate?: string;
  addedAt: Date;
}

export interface IList extends Document {
  name: string;
  user: mongoose.Types.ObjectId;
  movies: IMovieItem[];
  isDefault: boolean; // true for watchlist, liked, rated
  listType?: 'watchlist' | 'liked' | 'rated' | 'custom'; // Type of default list
  createdAt: Date;
  updatedAt: Date;
}

const movieItemSchema = new Schema<IMovieItem>({
  movieId: { type: Number, required: true },
  title: { type: String, required: true },
  posterPath: { type: String },
  releaseDate: { type: String },
  addedAt: { type: Date, default: Date.now }
}, { _id: false });

const listSchema = new Schema<IList>({
  name: {
    type: String,
    required: [true, 'A list must have a name'],
    trim: true,
    maxlength: [100, 'List name cannot exceed 100 characters']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A list must belong to a user']
  },
  movies: {
    type: [movieItemSchema],
    default: []
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  listType: {
    type: String,
    enum: ['watchlist', 'liked', 'rated', 'custom'],
    default: 'custom'
  }
}, {
  timestamps: true
});

// Index for faster queries
listSchema.index({ user: 1, name: 1 });
listSchema.index({ user: 1, listType: 1 });

// Prevent duplicate movies in the same list
listSchema.pre('save', function(next) {
  if (this.isModified('movies')) {
    const seen = new Set<number>();
    this.movies = this.movies.filter(movie => {
      if (seen.has(movie.movieId)) {
        return false;
      }
      seen.add(movie.movieId);
      return true;
    });
  }
  next();
});

const List = mongoose.model<IList>('List', listSchema);
export default List;
