import mongoose from 'mongoose';

const AssessmentSchema = new mongoose.Schema({
  child_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true,
    index: true,
  },
  questions: {
    type: Array,
    default: [],
  },
  answers: {
    type: Array,
    default: [],
  },
  result_summary: {
    type: String,
    default: null,
  },
  aptitude_areas: {
    type: Object,
    default: null,
  },
  top_aptitude: {
    type: String,
    default: null,
  },
  career_hints: {
    type: Array,
    default: null,
  },
  strength_sentence: {
    type: String,
    default: null,
  },
}, { timestamps: true });

export default mongoose.model('Assessment', AssessmentSchema);
