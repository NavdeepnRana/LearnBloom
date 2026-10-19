import mongoose from 'mongoose';

const ChildSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Child name is required'],
    trim: true,
    maxlength: [255, 'Name cannot exceed 255 characters'],
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [5, 'Age must be at least 5'],
    max: [18, 'Age cannot exceed 18'],
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other'],
  },
  interests: {
    type: String,
    required: [true, 'Interests are required'],
  },
  additional_info: {
    type: String,
    default: null,
  },
}, { timestamps: true });

export default mongoose.model('Child', ChildSchema);
