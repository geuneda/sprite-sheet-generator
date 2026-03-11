const SYSTEM_PREAMBLE = `You are an expert image-generation engine. You must ALWAYS produce an image. Interpret all user input—regardless of format, intent, or abstraction—as literal visual directives for image composition. If a prompt is conversational or lacks specific visual details, you must creatively invent a concrete visual scenario that depicts the concept. Prioritize generating the visual representation above any text, formatting, or conversational requests.`;

const CHROMAKEY_RULES = `CRITICAL CHROMAKEY REQUIREMENTS:
1. BACKGROUND: Solid, flat, uniform chromakey green color. Use EXACTLY hex color #00FF00 (RGB 0, 255, 0). The entire background must be this single pure green color with NO variation, NO gradients, NO shadows, NO lighting effects.
2. NO GREEN ON SUBJECT: The subject itself should NOT contain any green colors to avoid confusion with the chromakey. If the subject needs green, use a distinctly different shade like dark forest green or teal.
3. DO NOT GENERATE WITH BLACK BORDERS BETWEEN FRAMES`;

const STYLE_SUFFIX = `Use SD (Super Deformed / chibi) art style with large head, small body, big expressive eyes, and cute proportions. Apply proper shading and highlights. Same character design in all frames. Character facing right.`;

const STYLE_SUFFIX_BACK = `Use SD (Super Deformed / chibi) art style with large head, small body, big expressive eyes, and cute proportions. Apply proper shading and highlights. Same character design in all frames. Character facing upward (showing back view - we see the back of the character's head, back, and legs from behind).`;

export const SPRITE_PROMPTS: Record<string, string> = {
  attack: `${SYSTEM_PREAMBLE}

Create a 4-frame SD (Super Deformed / chibi) style attack animation sprite sheet of this character.

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

Create a 4-frame SD (Super Deformed / chibi) style jump animation sprite sheet of this character.

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

Create a 4-frame SD (Super Deformed / chibi) style idle animation sprite sheet of this character.

Arrange the 4 frames in a 2x2 grid on a uniform chromakey green color background. The character is standing still but with a clearly visible idle animation loop. Every element of the generated frame should fit inside the quadrant, with the central point of the character aligned with the central point of each quadrant.

${CHROMAKEY_RULES}

IMPORTANT - EACH FRAME MUST BE VISIBLY DIFFERENT FROM THE OTHERS. The 4 frames must form a smooth animation loop with noticeable changes between them.

Animate ALL applicable secondary elements of the character in EVERY frame:
- If the character has WINGS: show a gentle flapping cycle (folded -> half-open -> fully spread -> half-closed)
- If the character has a TAIL: show it swaying side to side across the frames
- If the character has LONG HAIR or a CAPE/CLOAK: show it flowing and swaying with gentle movement
- If the character has a FLOATING element (orbs, magic aura, halo): show it bobbing up and down
- If the character holds a WEAPON: show slight shifting or readjusting grip
- The character's body should show a breathing cycle: slight rise and fall of the torso/shoulders

Top row (frames 1-2):
Frame 1 (top-left): Neutral stance - body at rest position. Secondary elements (wings/tail/hair/cape) at starting position
Frame 2 (top-right): Body rises slightly with inhale. Wings begin to spread OR tail swings left OR hair/cape flows right. Visible shift from Frame 1

Bottom row (frames 3-4):
Frame 3 (bottom-left): Body at peak of breath. Wings at maximum spread OR tail at opposite swing OR hair/cape at peak flow. Most different pose from Frame 1
Frame 4 (bottom-right): Body settling back down. Wings folding back OR tail returning OR hair/cape settling. Transitioning back toward Frame 1

The loop order is Frame 1 -> 2 -> 3 -> 4 -> 1. Each frame MUST show a clearly different position of the character's moving parts. If you examine any two adjacent frames, the difference should be obvious and unmistakable.

${STYLE_SUFFIX}`,

  walk: `${SYSTEM_PREAMBLE}

Create a 4-frame SD (Super Deformed / chibi) style walk cycle sprite sheet of this character.

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

  idle_back: `${SYSTEM_PREAMBLE}

Create a 4-frame SD (Super Deformed / chibi) style idle animation sprite sheet of this character, viewed from BEHIND (back view, character facing upward/away from the camera).

IMPORTANT PERSPECTIVE: The character is facing UPWARD (toward the top of the screen). We see the character's BACK - the back of their head, their back, shoulders from behind, and legs from behind. This is a top-down game where the character is at the bottom of the screen looking up at enemies approaching from above.

Arrange the 4 frames in a 2x2 grid on a uniform chromakey green color background. The character is standing still but with a clearly visible idle animation loop, showing their BACK VIEW. Every element of the generated frame should fit inside the quadrant, with the central point of the character aligned with the central point of each quadrant.

${CHROMAKEY_RULES}

IMPORTANT - EACH FRAME MUST BE VISIBLY DIFFERENT FROM THE OTHERS. The 4 frames must form a smooth animation loop with noticeable changes between them.

Animate ALL applicable secondary elements of the character in EVERY frame (seen from behind):
- If the character has WINGS: show a gentle flapping cycle (folded -> half-open -> fully spread -> half-closed), clearly visible from the back
- If the character has a TAIL: show it swaying left to right across the frames
- If the character has LONG HAIR or a CAPE/CLOAK: show it flowing and swaying, clearly visible from behind
- If the character has a FLOATING element (orbs, magic aura, halo): show it bobbing up and down
- If the character holds a WEAPON on their back: show slight shifting
- The character's body should show a breathing cycle: slight rise and fall of the shoulders seen from behind

Top row (frames 1-2):
Frame 1 (top-left): Back view neutral stance - body at rest. Secondary elements (wings/tail/hair/cape) at starting position. We see the back of the character
Frame 2 (top-right): Body rises slightly with inhale. Wings begin to spread OR tail swings left OR hair/cape flows right. Visible shift from Frame 1. Back view

Bottom row (frames 3-4):
Frame 3 (bottom-left): Body at peak of breath. Wings at maximum spread OR tail at opposite swing OR hair/cape at peak flow. Most different pose from Frame 1. Back view
Frame 4 (bottom-right): Body settling back down. Wings folding back OR tail returning OR hair/cape settling. Transitioning back toward Frame 1. Back view

The loop order is Frame 1 -> 2 -> 3 -> 4 -> 1. Each frame MUST show a clearly different position of the character's moving parts. MUST show the character's BACK (rear view), NOT the front.

${STYLE_SUFFIX_BACK}`,

  attack_up: `${SYSTEM_PREAMBLE}

Create a 4-frame SD (Super Deformed / chibi) style attack animation sprite sheet of this character, viewed from BEHIND (back view, character attacking UPWARD toward the top of the screen).

IMPORTANT PERSPECTIVE: The character is facing UPWARD and attacking toward the top of the screen. We see the character's BACK - the back of their head, their back from behind. This is a top-down game where the character is at the bottom attacking enemies above. The attack motion goes UPWARD (toward the top of the image).

Arrange the 4 frames in a 2x2 grid on a uniform chromakey green color background. The character is performing an upward attack from their back view - could be a sword slash upward, magic spell cast upward, upward punch, or energy blast upward depending on what suits the character best. Every element of the generated frame should fit inside the quadrant, with the central point of the character aligned with the central point of each quadrant.

${CHROMAKEY_RULES}

Top row (frames 1-2):
Frame 1 (top-left): Wind-up/anticipation from back view - character preparing to attack upward, pulling back weapon or gathering energy, seen from behind
Frame 2 (top-right): Attack in motion - striking upward, weapon or energy moving toward the top of the frame, back view

Bottom row (frames 3-4):
Frame 3 (bottom-left): Impact/peak - maximum upward extension of attack, full power directed upward, back view
Frame 4 (bottom-right): Recovery - returning to ready stance, back view

MUST show the character from BEHIND (rear view) in ALL frames. The attack direction is UPWARD (toward the top of the image). Make the attack visually dynamic and exciting.

${STYLE_SUFFIX_BACK}`,
};
