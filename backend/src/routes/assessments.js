import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { protect } from '../middleware/auth.js';
import Assessment from '../models/Assessment.js';
import Child from '../models/Child.js';
import { generateResult } from '../services/groqService.js';

const router = Router();

// GET /api/assessments/:id — get a single assessment (owner only)
router.get('/:id', protect, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('child_id');
    if (!assessment) return res.status(404).json({ message: 'Assessment not found.' });

    if (assessment.child_id.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    res.json({
      assessment,
      child: assessment.child_id,
      aptitude_areas: assessment.aptitude_areas,
      top_aptitude: assessment.top_aptitude,
      career_hints: assessment.career_hints,
      strength_sentence: assessment.strength_sentence,
      result_summary: assessment.result_summary,
    });
  } catch (err) {
    console.error('Get assessment error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/assessments/:id/results — get results for assessment
router.get('/:id/results', protect, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('child_id');
    if (!assessment) return res.status(404).json({ message: 'Assessment not found.' });

    if (assessment.child_id.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    res.json({
      assessment,
      child: assessment.child_id,
      aptitude_areas: assessment.aptitude_areas,
      top_aptitude: assessment.top_aptitude,
      career_hints: assessment.career_hints,
      strength_sentence: assessment.strength_sentence,
      result_summary: assessment.result_summary,
    });
  } catch (err) {
    console.error('Get results error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/assessments/:id/submit — submit answers + AI result
router.post('/:id/submit', protect, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('child_id');
    if (!assessment) return res.status(404).json({ message: 'Assessment not found.' });

    if (assessment.child_id.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    const { answers } = req.body;
    const questions = assessment.questions;

    if (!Array.isArray(answers) || answers.length !== questions.length) {
      return res.status(422).json({
        message: `Expected ${questions.length} answers, got ${answers?.length ?? 0}.`,
      });
    }

    const answerPayload = questions.map((question, index) => ({
      question: question.question ?? null,
      options: question.options ?? [],
      correct_area: question.correct_area ?? null,
      interest_based: question.interest_based ?? false,
      selected_answer: answers[index],
    }));

    const result = await generateResult(assessment.child_id.toObject(), answerPayload);

    const aptitudeAreas = result.aptitude_areas ?? {};
    let topAptitude = result.top_aptitude ?? null;

    if (!topAptitude && Object.keys(aptitudeAreas).length > 0) {
      topAptitude = Object.keys(aptitudeAreas).reduce((a, b) =>
        aptitudeAreas[a] > aptitudeAreas[b] ? a : b
      );
    }

    assessment.answers = answerPayload;
    assessment.result_summary = result.summary ?? 'Summary unavailable.';
    assessment.aptitude_areas = aptitudeAreas;
    assessment.top_aptitude = topAptitude;
    assessment.career_hints = result.career_hints ?? null;
    assessment.strength_sentence = result.strength_sentence ?? null;
    await assessment.save();

    res.json({ assessment });
  } catch (err) {
    console.error('Submit assessment error:', err.message);
    res.status(500).json({ message: err.message || 'Failed to generate results.' });
  }
});

// GET /api/assessments/:id/report — download PDF report
router.get('/:id/report', protect, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('child_id');
    if (!assessment) return res.status(404).json({ message: 'Assessment not found.' });

    if (assessment.child_id.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    if (!assessment.result_summary) {
      return res.status(400).json({ message: 'Assessment not completed yet.' });
    }

    const child = assessment.child_id;
    const filename = `aptitude-report-${child.name.replace(/\s+/g, '-')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc.fontSize(22).text('MindBloom Aptitude Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Child: ${child.name} · Age ${child.age} · ${child.gender}`);
    doc.moveDown();
    doc.fontSize(16).text(`Top aptitude: ${assessment.top_aptitude ?? 'N/A'}`);
    if (assessment.strength_sentence) {
      doc.fontSize(12).text(`"${assessment.strength_sentence}"`);
    }
    doc.moveDown();
    doc.fontSize(14).text('Summary');
    doc.fontSize(11).text(assessment.result_summary ?? '', { align: 'justify' });
    doc.moveDown();
    doc.fontSize(14).text('Aptitude Areas');
    for (const [area, score] of Object.entries(assessment.aptitude_areas ?? {})) {
      doc.fontSize(11).text(`${area}: ${score}%`);
    }
    doc.moveDown();
    doc.fontSize(14).text('Future Pathways');
    for (const hint of assessment.career_hints ?? []) {
      doc.fontSize(12).text(hint.title ?? '');
      doc.fontSize(10).text(hint.reason ?? '');
      doc.moveDown(0.5);
    }

    doc.end();
  } catch (err) {
    console.error('Report error:', err);
    res.status(500).json({ message: 'Could not generate report.' });
  }
});

export default router;
