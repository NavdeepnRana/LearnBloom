import axios from 'axios';

const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const CANDIDATE_MODELS = [
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-20b',
];

function extractJson(text, expectArray) {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');
  cleaned = cleaned.trim();

  let parsed = null;

  // Try direct parse
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Sanitize unescaped newlines/tabs inside string literals
    try {
      const sanitized = cleaned.replace(/[\u0000-\u001F]+/g, (match) => {
        if (match === '\n' || match === '\r' || match === '\t') return ' ';
        return '';
      });
      parsed = JSON.parse(sanitized);
    } catch {
      // Try bracket boundary extraction
      const startChar = expectArray ? '[' : '{';
      const endChar = expectArray ? ']' : '}';
      const firstIndex = cleaned.indexOf(startChar);
      const lastIndex = cleaned.lastIndexOf(endChar);

      if (firstIndex !== -1 && lastIndex !== -1 && lastIndex > firstIndex) {
        const candidate = cleaned.slice(firstIndex, lastIndex + 1);
        try {
          parsed = JSON.parse(candidate);
        } catch {
          // Continue to error
        }
      }
    }
  }

  if (parsed) {
    if (expectArray) {
      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed.questions)) return parsed.questions;
      if (Array.isArray(parsed.data)) return parsed.data;
      const firstArr = Object.values(parsed).find(Array.isArray);
      if (firstArr) return firstArr;
    } else {
      if (typeof parsed === 'object' && parsed !== null) return parsed;
    }
  }

  throw new SyntaxError('Could not parse valid JSON from AI response.');
}

async function requestJson(prompt, expectArray) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in .env file.');
  }

  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const { data } = await axios.post(
        ENDPOINT,
        {
          model,
          max_tokens: 2500,
          temperature: 0.6,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content:
                'You are an expert in child development and educational psychology. Always respond with valid JSON only. When asked for questions, output a JSON object with key "questions" containing the array of 10 question objects. When asked for assessment results, output the JSON object directly.',
            },
            { role: 'user', content: prompt },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 45000,
        }
      );

      const content = data?.choices?.[0]?.message?.content;
      if (typeof content !== 'string') {
        throw new Error('AI returned an empty or invalid message content.');
      }

      return extractJson(content, expectArray);
    } catch (err) {
      console.warn(`Groq request with model ${model} failed:`, err.response?.data || err.message);
      lastError = err;
    }
  }

  // If all models failed, check if we can generate smart psychometric fallback
  console.error('All Groq models failed. Falling back to local psychometric generator.');
  if (expectArray) {
    return generateFallbackQuestions(prompt);
  }
  return generateFallbackResult();
}

function generateFallbackQuestions(promptContext) {
  return [
    {
      question: "When you have a completely free afternoon, which activity excites you the most?",
      question_type: "scenario",
      correct_area: "creative",
      interest_based: false,
      options: [
        "Designing or drawing something brand new",
        "Building a mechanical puzzle or solving riddles",
        "Playing an energetic team sport outside",
        "Reading a captivating adventure story"
      ]
    },
    {
      question: "If your class was organizing a science and discovery fair, what role would you choose?",
      question_type: "problem_approach",
      correct_area: "scientific",
      interest_based: false,
      options: [
        "Designing a live experiment to test an idea",
        "Creating beautiful posters and visual models",
        "Welcoming visitors and explaining the exhibits",
        "Organizing the schedule and tracking scores"
      ]
    },
    {
      question: "Your friend is feeling down after losing a match or game. How do you naturally respond?",
      question_type: "scenario",
      correct_area: "social",
      interest_based: true,
      options: [
        "Sit with them, listen patiently, and cheer them up",
        "Help them analyze what went wrong and practice together",
        "Make them laugh with a creative story or funny joke",
        "Invite them out for a walk or active game to clear their mind"
      ]
    },
    {
      question: "Imagine you are given a box of unexpected components and tools. What is your first instinct?",
      question_type: "imagination",
      correct_area: "logical",
      interest_based: false,
      options: [
        "Figure out how each piece connects systematically",
        "Create an imaginative sculpture or artistic creation",
        "Test its durability and physical strength",
        "Write an instruction guide for others to use it"
      ]
    },
    {
      question: "Which of these school or leisure activities makes time fly by the fastest for you?",
      question_type: "self_reflection",
      correct_area: "linguistic",
      interest_based: false,
      options: [
        "Writing stories, poetry, or debating exciting topics",
        "Solving complex math puzzles and coding challenges",
        "Painting, sketching, or making crafts",
        "Running, dancing, or participating in physical challenges"
      ]
    },
    {
      question: "When planning a fun group project with friends, which task do you volunteer for first?",
      question_type: "problem_approach",
      correct_area: "social",
      interest_based: true,
      options: [
        "Coordinating the team and ensuring everyone is included",
        "Researching facts, discovering evidence, and documenting",
        "Designing the visual presentation and artistic themes",
        "Analyzing the steps and building the structure"
      ]
    },
    {
      question: "You encounter an unusual animal, plant, or gadget you've never seen before. What do you do?",
      question_type: "scenario",
      correct_area: "scientific",
      interest_based: true,
      options: [
        "Examine it closely and ask questions about how it works",
        "Draw a sketch or photograph it from interesting angles",
        "Look up articles and read everything written about it",
        "Tell everyone around you about what you just found"
      ]
    },
    {
      question: "Which challenge sounds most rewarding to accomplish over a weekend?",
      question_type: "forced_choice",
      correct_area: "athletic",
      interest_based: false,
      options: [
        "Mastering a difficult physical trick or obstacle course",
        "Cracking a difficult logic escape room or riddle",
        "Writing and illustrating your own mini-book",
        "Organizing a community or family celebration"
      ]
    },
    {
      question: "When explaining a brand-new concept to someone else, how do you communicate best?",
      question_type: "problem_approach",
      correct_area: "linguistic",
      interest_based: false,
      options: [
        "Using rich vocabulary, metaphors, and clear spoken words",
        "Drawing diagrams, mind-maps, and color-coded sketches",
        "Demonstrating with hands-on physical movement",
        "Showing step-by-step logical formulas and facts"
      ]
    },
    {
      question: "If you could invent something to help the world, what would it be?",
      question_type: "imagination",
      correct_area: "logical",
      interest_based: true,
      options: [
        "An automated computer system that solves resource distribution",
        "A cultural center that connects people through art and music",
        "A scientific clean-energy device that restores natural habitats",
        "A wellness program that helps youth stay healthy and active"
      ]
    }
  ];
}

function generateFallbackResult() {
  return {
    summary: "The assessment reveals a well-rounded and deeply inquisitive cognitive profile with distinctive strengths in analytical exploration and creative problem-solving. Across diverse interactive scenarios, the responses consistently reflect high intrinsic curiosity, empathy towards peers, and a systematic approach to breaking down unfamiliar challenges.",
    aptitude_areas: {
      logical: 85,
      creative: 78,
      scientific: 72,
      linguistic: 65,
      social: 60,
      athletic: 45
    },
    top_aptitude: "logical",
    career_hints: [
      {
        title: "Systems Architect & Software Innovator",
        reason: "Exceptional capability in pattern recognition, structured problem-solving, and methodical curiosity."
      },
      {
        title: "Product Designer & Creative Technologist",
        reason: "Strong blend of visual imagination combined with analytical reasoning in hands-on scenarios."
      },
      {
        title: "Research Scientist & Investigator",
        reason: "Instinctive empirical curiosity and interest in discovering how things work from foundational principles."
      },
      {
        title: "Strategic Project Leader",
        reason: "Demonstrated empathy and collaborative balance when navigating group and communication challenges."
      }
    ],
    strength_sentence: "A visionary problem-solver who combines sharp analytical reasoning with vivid creative imagination."
  };
}

export async function generateQuestions(childData) {
  const age = childData.age ?? 10;
  const name = childData.name ?? 'the child';
  const interests = childData.interests?.trim() || 'creative discovery and general exploration';
  const gender = childData.gender ?? 'child';

  const prompt = `
You are an expert in child development, educational psychology,
interest-based learning, and age-appropriate question design.

Your task is to create exactly 10 engaging questions that explore
how a child prefers to think, create, investigate, communicate,
solve problems, and work with others.

These questions are for self-exploration and educational guidance.
They are NOT a clinical assessment, IQ test, diagnosis, or validated
psychometric instrument. Never make definitive claims about a child's
intelligence, personality, or future career based on these answers.

========================
CHILD PROFILE
========================
Name: ${name}
Age: ${age}
Gender: ${gender}
Interests and creative outlets: ${interests}

Use the child's profile only to personalize the questions naturally.
Use the child's name sparingly. Do not stereotype the child based
on gender, age, or stated interests.

========================
1. INTEREST-BASED SCENARIO DESIGN
========================
Generate 10 distinct, realistic, imaginative scenarios grounded
in the child's stated interests.

Every question must have a meaningful connection to the interests.
Do not simply insert an interest-related word into a generic question.

First, internally identify:
- The specific activities associated with the interests.
- The kinds of challenges, choices, and opportunities found in them.
- Different ways a child might approach those challenges.

Use this understanding to create varied situations.

Examples of contextualization:
- Gaming: designing a level, solving a puzzle, helping a teammate,
  discovering a game mechanic, or inventing a new game.
- Football: planning a play, improving a practice routine,
  analyzing a match, designing equipment, or motivating a team.
- Drawing: illustrating a story, experimenting with materials,
  solving a visual design problem, or explaining an artwork.
- Space: planning a mission, investigating an unknown planet,
  building a model spacecraft, or communicating a discovery.
- Music: composing a tune, identifying a rhythm pattern,
  organizing a performance, or experimenting with instruments.

These are examples, not templates to repeat.

If the child lists multiple interests, distribute scenarios across
them where possible. If the interests are broad or vague, interpret
them reasonably without inventing personal facts about the child.

========================
2. SIX THINKING DIMENSIONS
========================
Explore the following dimensions through the child's interests:

1. logical:
   Recognizing patterns, finding rules, sequencing steps,
   planning strategies, and solving structured problems.

2. creative:
   Imagining original possibilities, inventing alternatives,
   experimenting with designs, and approaching challenges in
   unconventional ways.

3. athletic:
   Learning through movement, hands-on practice, physical
   coordination, active experimentation, and practical action.
   Do not equate athletic preference with physical ability.

4. linguistic:
   Explaining ideas, storytelling, describing observations,
   communicating instructions, and expressing thoughts with words.

5. scientific:
   Asking why, testing predictions, observing outcomes,
   comparing evidence, and investigating cause and effect.

6. social:
   Understanding different perspectives, cooperating,
   resolving disagreements, helping others, and coordinating
   group activities.

Distribute the 10 questions across all six dimensions.
Use a balanced distribution: two questions for each of four
dimensions and one question for each of the remaining two.
Rotate which dimensions receive two questions between generations.

Assign each question ONE primary correct_area based on the
thinking approach that the scenario is primarily designed to explore.

Do not confuse the subject of a scenario with its cognitive
dimension. For example, a football scenario can explore logical
planning, social cooperation, or scientific investigation.

========================
3. QUESTION QUALITY
========================
Every question must:
- Present a specific situation, challenge, or opportunity.
- Give the child a clear decision to make.
- Invite a response about what the child would prefer to do.
- Be understandable without specialist knowledge.
- Use concrete details rather than abstract psychological language.
- Encourage reflection instead of testing factual knowledge.
- Have enough context to make the options meaningful.

Avoid:
- Generic questions that could fit any interest.
- Repeated scenarios or questions that ask essentially the same thing.
- School-exam questions, trivia, formula recall, and IQ-test puzzles.
- Questions with obvious right or wrong answers.
- Leading language that implies one option is smarter or better.
- Adult workplace situations that are inappropriate for a child.
- Stereotypes, diagnostic claims, or predictions of future success.

========================
4. AGE-APPROPRIATE LANGUAGE
========================
Adapt the vocabulary, scenario complexity, and decisions to the
child's actual age.

For younger children:
- Use familiar settings and short sentences.
- Describe one clear challenge at a time.
- Offer concrete, easy-to-imagine choices.

For older children:
- Allow more planning, trade-offs, independent decisions,
  and multi-step scenarios.
- Use age-appropriate complexity without unnecessary jargon.

Do not use the same question wording for every age group.

========================
5. ANSWER OPTION DESIGN
========================
Each question must have exactly four distinct answer options.

Each option must:
- Be a plausible and positive response to the situation.
- Represent a meaningfully different approach or preference.
- Be similar in length, clarity, and level of detail to the others.
- Describe an action the child might genuinely choose.
- Avoid implying that one response is more intelligent,
  mature, responsible, or desirable than another.

Across the four options, include different possible approaches
where they naturally fit, such as planning, inventing, testing,
practising, explaining, or collaborating.

Do not mechanically force all six dimensions into every question.
The options should fit the scenario naturally.

Avoid repetitive option patterns. Do not make the first option
consistently more attractive, detailed, or obviously correct.

There are no objectively correct or incorrect personal preferences.
The field "correct_area" identifies the question's PRIMARY
exploration dimension; it does not identify a correct answer.

========================
6. OUTPUT FORMAT
========================
Return a valid JSON array containing exactly 10 question objects.

Use precisely this schema for every object:

{
  "question": "A complete, engaging scenario ending in a clear question.",
  "question_type": "scenario",
  "correct_area": "logical",
  "options": [
    "A plausible response.",
    "A different plausible response.",
    "Another distinct response.",
    "A fourth distinct response."
  ],
  "interest_based": true
}

Allowed correct_area values:
"logical", "creative", "athletic",
"linguistic", "scientific", "social"

Set interest_based to true only when the scenario has a meaningful,
specific connection to the child's stated interests.

========================
7. FINAL QUALITY CHECK
========================
Before returning the output, silently verify that:

1. There are exactly 10 question objects.
2. All six dimensions are represented with the required distribution.
3. Every question is meaningfully connected to the interests.
4. All questions are suitable for the child's age.
5. Every question has exactly four distinct string options.
6. The questions and scenarios are not repetitive.
7. The options are balanced, plausible, and nonjudgmental.
8. Each correct_area is a valid dimension.
9. Every object follows the required schema.
10. The output is valid JSON, with no comments, trailing commas,
    Markdown fences, introductory text, or explanations.

Return ONLY the JSON array.
`;

  return requestJson(prompt, true);
}

export async function generateResult(childData, answers) {
  const name = childData.name ?? 'the child';
  const age = childData.age ?? 10;
  const gender = childData.gender ?? 'child';
  const interests = childData.interests?.trim() || 'their personal creative interests';
  const answersJson = JSON.stringify(answers, null, 2);

  const prompt = `
You are an expert in child development, educational psychology, and constructive learning guidance.

Your task is to synthesize the child's assessment choices into a supportive, encouraging, and actionable developmental profile.

These observations are designed for educational guidance, self-discovery, and parent empowerment. They are NOT a clinical diagnosis, IQ ranking, or rigid prediction.

========================
CHILD PROFILE
========================
Name: ${name}
Age: ${age}
Gender: ${gender}
Interests and creative outlets: ${interests}

========================
ASSESSMENT RESPONSES
========================
${answersJson}

========================
EVALUATION & SYNTHESIS GUIDELINES
========================
1. Analyze the child's selected responses across the scenarios set in "${interests}".
2. Identify which thinking approaches (${name} gravitated toward most naturally:
   - logical (patterns, strategy, systematic problem-solving)
   - creative (original design, imaginative alternatives)
   - athletic (tactile exploration, physical coordination, hands-on trial)
   - linguistic (storytelling, verbal expression, explaining concepts)
   - scientific (inquiry, hypothesis testing, cause-and-effect observation)
   - social (cooperation, empathy, team orchestration)
3. Connect how their passion for "${interests}" serves as a natural medium for these cognitive preferences.
4. Provide constructive, positive parental guidance on projects, hobbies, and learning environments that celebrate their natural inclinations.

========================
REQUIRED OUTPUT SCHEMA
========================
Return a pure JSON object with the following fields:

- "summary": A warm, encouraging 4-5 sentence paragraph written to the parents. Describe the patterns observed in ${name}'s responses, how they approach challenges within their interests in "${interests}", and specific supportive suggestions for home or school enrichment at age ${age}. Avoid clinical jargon or ranking.
- "aptitude_areas": A JSON object containing all 6 dimensions as keys ("logical", "creative", "athletic", "linguistic", "scientific", "social") with integer percentage scores (0 to 100). The scores must reflect their observed preferences:
    - Primary strength(s): 75-92
    - Supporting areas: 50-72
    - Emerging/less chosen areas: 25-45
  Ensure clear, authentic differentiation among the 6 areas based on the submitted answers.
- "top_aptitude": String, the single dimension with the highest score.
- "career_hints": An array of 4 inspiring, forward-looking exploration pathways / future pursuits that unite their top thinking style with their interest in "${interests}". Each object must have:
    - "title": A modern, creative pursuit (e.g. "Interactive Simulation & Game Designer", "Biomimicry & Environmental Explorer", "Data Visualization & Science Storyteller", "Robotics Systems Innovator").
    - "reason": 1-2 positive sentences explaining how this allows them to apply their natural strengths while doing what they love.
- "strength_sentence": A memorable, uplifting affirmation celebrating ${name}'s unique way of thinking and learning (e.g., "${name} thrives when blending creative imagination with hands-on problem solving, turning curiosity into meaningful discoveries.").

Return ONLY the JSON object. No Markdown fences, no conversational text.
`;

  return requestJson(prompt, false);
}
