import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Child from '../models/Child.js';
import Assessment from '../models/Assessment.js';
import { generateQuestions } from '../services/groqService.js';

const router = Router();

// GET /api/children — all children for the logged-in user with assessments
router.get('/', protect, async (req, res) => {
  try {
    const children = await Child.find({ user_id: req.user._id }).sort({ createdAt: -1 });

    const childrenWithAssessments = await Promise.all(
      children.map(async (child) => {
        const assessments = await Assessment.find({ child_id: child._id }).sort({ createdAt: -1 });
        return { ...child.toObject(), assessments };
      })
    );

    res.json({ children: childrenWithAssessments });
  } catch (err) {
    console.error('Get children error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/children — create child + generate assessment
router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 255 }),
    body('age').isInt({ min: 5, max: 18 }).withMessage('Age must be between 5 and 18'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    body('interests').trim().notEmpty().withMessage('Interests are required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, age, gender, interests, additional_info } = req.body;
    let child;

    try {
      child = await Child.create({
        user_id: req.user._id,
        name,
        age,
        gender,
        interests,
        additional_info: additional_info || null,
      });

      const questions = await generateQuestions(child.toObject());
      const assessment = await Assessment.create({ child_id: child._id, questions });

      res.status(201).json({ child, assessment });
    } catch (err) {
      if (child?._id) await Child.findByIdAndDelete(child._id);
      console.error('Create child error:', err.message);
      res.status(500).json({ message: err.message || 'Failed to generate assessment questions.' });
    }
  }
);

// GET /api/children/:id — single child with assessments
router.get('/:id', protect, async (req, res) => {
  try {
    const child = await Child.findOne({ _id: req.params.id, user_id: req.user._id });
    if (!child) return res.status(404).json({ message: 'Child not found.' });

    const assessments = await Assessment.find({ child_id: child._id })
      .sort({ createdAt: -1 })
      .select('-questions');

    res.json({ child, assessments });
  } catch (err) {
    console.error('Get child error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/children/:id/new-assessment — generate new assessment for existing child
router.post('/:id/new-assessment', protect, async (req, res) => {
  try {
    const child = await Child.findOne({ _id: req.params.id, user_id: req.user._id });
    if (!child) return res.status(404).json({ message: 'Child not found.' });

    const questions = await generateQuestions(child.toObject());
    const assessment = await Assessment.create({ child_id: child._id, questions });

    res.status(201).json({ assessment });
  } catch (err) {
    console.error('New assessment error:', err.message);
    res.status(500).json({ message: err.message || 'Failed to generate questions.' });
  }
});

export default router;
