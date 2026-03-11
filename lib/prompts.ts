const SYSTEM_PREAMBLE = `You are an expert image-generation engine. You must ALWAYS produce an image. Interpret all user input—regardless of format, intent, or abstraction—as literal visual directives for image composition. If a prompt is conversational or lacks specific visual details, you must creatively invent a concrete visual scenario that depicts the concept. Prioritize generating the visual representation above any text, formatting, or conversational requests.`;

const CHROMAKEY_RULES = `CRITICAL CHROMAKEY REQUIREMENTS:
1. BACKGROUND: Solid, flat, uniform chromakey green color. Use EXACTLY hex color #00FF00 (RGB 0, 255, 0). The entire background must be this single pure green color with NO variation, NO gradients, NO shadows, NO lighting effects.
2. NO GREEN ON SUBJECT: The subject itself should NOT contain any green colors to avoid confusion with the chromakey. If the subject needs green, use a distinctly different shade like dark forest green or teal.
3. DO NOT GENERATE WITH BLACK BORDERS BETWEEN FRAMES`;

const STYLE_SUFFIX = `Use detailed 32-bit pixel art style with proper shading and highlights. Same character design in all frames. Character facing right.`;

export const SPRITE_PROMPTS: Record<string, string> = {
  attack: `${SYSTEM_PREAMBLE}

Create a 4-frame pixel art attack animation sprite sheet of this character.

Arrange the 4 frames in a 2x2 grid on a uniform chromakey green color background. The character is performing an attack that fits their design - could be a sword slash, magic spell, punch, kick, or energy blast depending on what suits the character best. Every element of the generated frame should fit inside the quadrant, with the central point of the character aligned with the central point of each quadrant.

${CHROMAKEY_RULES}

Top row (frames 1-2):
Frame 1 (top-left): Wind-up/anticipation - character preparing to attack, pulling back weapon or gathering energy
Frame 2 (top-right): Attack in motion

Bottom row (frames 3-4):
Frame 3 (bottom-left): Impact/peak - maximum extension of attack, full power
Frame 4 (bottom-right): Recovery - returning to ready stance

${STYLE_SUFFIX} Make the attack visually dynamic and exciting.`,

  jump: `${SYSTEM_PREAMBLE}

Create a 4-frame pixel art jump animation sprite sheet of this character.

Arrange the 4 frames in a 2x2 grid on a uniform chromakey green color background. The character is jumping. Every element of the generated frame should fit inside the quadrant, with the central point of the character aligned with the central point of each quadrant.

${CHROMAKEY_RULES}

Top row (frames 1-2):
Frame 1 (top-left): Crouch/anticipation - character slightly crouched, knees bent, preparing to jump
Frame 2 (top-right): Rising - character in air, legs tucked up, arms up, ascending

Bottom row (frames 3-4):
Frame 3 (bottom-left): Apex/peak - character at highest point of jump, body stretched or tucked
Frame 4 (bottom-right): Landing - character landing, slight crouch to absorb impact

${STYLE_SUFFIX}`,

  idle: `${SYSTEM_PREAMBLE}

Create a 4-frame pixel art idle/breathing animation sprite sheet of this character.

Arrange the 4 frames in a 2x2 grid on a uniform chromakey green color background. The character is standing still but with subtle idle animation. Every element of the generated frame should fit inside the quadrant, with the central point of the character aligned with the central point of each quadrant.

${CHROMAKEY_RULES}

Top row (frames 1-2):
Frame 1 (top-left): Neutral standing pose - relaxed stance
Frame 2 (top-right): Slight inhale - chest/body rises subtly, maybe slight arm movement

Bottom row (frames 3-4):
Frame 3 (bottom-left): Full breath - slight upward posture
Frame 4 (bottom-right): Exhale - returning to neutral, slight settle

Keep movements SUBTLE - this is a gentle breathing/idle loop, not dramatic motion. Character should look alive but relaxed.

${STYLE_SUFFIX}`,

  walk: `${SYSTEM_PREAMBLE}

Create a 4-frame pixel art walk cycle sprite sheet of this character.

Arrange the 4 frames in a 2x2 grid on a uniform chromakey green color background. The character is walking to the right. Every element of the generated frame should fit inside the quadrant, with the central point of the character aligned with the central point of each quadrant.

${CHROMAKEY_RULES}

Top row (frames 1-2):
Frame 1 (top-left): Right leg forward, left leg back - stride position
Frame 2 (top-right): Legs close together, passing/crossing - transition

Bottom row (frames 3-4):
Frame 3 (bottom-left): Left leg forward, right leg back - opposite stride
Frame 4 (bottom-right): Legs close together, passing/crossing - transition back

Each frame shows a different phase of the walking motion. This creates a smooth looping walk cycle.

${STYLE_SUFFIX}`,
};
