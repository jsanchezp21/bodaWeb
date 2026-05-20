import mongoose from 'mongoose';

const companionSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const guestResponseSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    attendance: {
      type: String,
      enum: ['yes', 'no'],
      required: true,
    },
    companionsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    companions: {
      type: [companionSchema],
      default: [],
    },
    busOption: {
      type: String,
      enum: ['round_trip', 'only_go', 'only_return', 'no_bus'],
      required: true,
    },
    allergies: {
      type: String,
      default: '',
      trim: true,
    },
    foodPreference: {
      type: String,
      enum: ['none', 'vegetarian', 'vegan'],
      default: 'none',
    },
    mustPlaySong: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const GuestResponse = mongoose.model('GuestResponse', guestResponseSchema);
