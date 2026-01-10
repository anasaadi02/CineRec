import List from '../models/List';
import { Types } from 'mongoose';

export const createDefaultLists = async (userId: Types.ObjectId) => {
  const defaultLists = [
    {
      name: 'Watchlist',
      user: userId,
      isDefault: true,
      listType: 'watchlist',
      movies: []
    },
    {
      name: 'Liked',
      user: userId,
      isDefault: true,
      listType: 'liked',
      movies: []
    },
    {
      name: 'Rated',
      user: userId,
      isDefault: true,
      listType: 'rated',
      movies: []
    }
  ];

  // Check if default lists already exist for this user
  const existingLists = await List.find({ user: userId, isDefault: true });
  if (existingLists.length > 0) {
    return; // Default lists already exist
  }

  await List.insertMany(defaultLists);
};
