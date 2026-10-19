import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import Child from '../models/Child.js';
import Assessment from '../models/Assessment.js';

const router = Router();

// GET /api/dashboard — all children with their latest assessments
router.get('/', protect, async (req, res) => {
  try {
    const children = await Child.find({ user_id: req.user._id }).sort({ createdAt: -1 });
    const childIds = children.map((c) => c._id);

    const assessments = await Assessment.find({ child_id: { $in: childIds } })
      .sort({ createdAt: -1 })
      .select('-questions');

    const byChild = new Map();
    for (const a of assessments) {
      const key = a.child_id.toString();
      if (!byChild.has(key)) byChild.set(key, []);
      byChild.get(key).push(a);
    }

    const payload = children.map((child) => ({
      ...child.toObject(),
      assessments: byChild.get(child._id.toString()) ?? [],
    }));

    res.json({ children: payload });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
