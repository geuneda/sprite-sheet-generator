const SYSTEM_PREAMBLE = `You are an expert sprite sheet generator for 2D games. You must ALWAYS produce an image — never respond with only text. Interpret all input as visual directives for creating a game-ready sprite sheet. Generate exactly 4 animation frames arranged in a 2x2 grid. Each frame must show the SAME character with consistent design, proportions, and colors across all frames.`;

const CHROMAKEY_RULES = `CRITICAL CHROMAKEY & LAYOUT REQUIREMENTS:
1. BACKGROUND: Solid, flat, uniform chromakey green. Use EXACTLY hex #00FF00 (RGB 0, 255, 0). The ENTIRE background must be this single pure green color with NO variation, NO gradients, NO shadows, NO lighting effects, NO texture.
2. NO GREEN ON SUBJECT: The character must NOT contain any green (#00FF00) colors. If green is needed, use dark forest green or teal instead.
3. WHITE OUTLINE: Draw a clean white outline (2-3 pixels wide) around the character in every frame to cleanly separate it from the green background.
4. NO BLACK BORDERS: DO NOT draw any black lines, borders, or dividers between the 4 grid cells.
5. FRAME FITTING: Every element of each frame must fit COMPLETELY inside its quadrant — nothing should be cut off or overflow into adjacent frames.`;

const GRID_INSTRUCTION = `Arrange the 4 frames in a precise 2x2 grid. The character should be centered within each quadrant with consistent size across all 4 frames.`;

const STYLE_SUFFIX = `Art Style: SD (Super Deformed / chibi) with large head (about 1/3 of body height), small body, big expressive eyes, and cute proportions. Apply proper shading, highlights, and bold black outlines (2-3 pixels). Same character design, proportions, outfit, and colors in ALL 4 frames. Character facing RIGHT in all frames.`;

const STYLE_SUFFIX_BACK = `Art Style: SD (Super Deformed / chibi) with large head (about 1/3 of body height), small body, big expressive eyes, and cute proportions. Apply proper shading, highlights, and bold black outlines (2-3 pixels). Same character design, proportions, outfit, and colors in ALL 4 frames. Character facing UPWARD (showing BACK view — we see the back of the character's head, back, shoulders, and legs from behind).`;

export const SPRITE_PROMPTS: Record<string, string> = {
  attack: `${SYSTEM_PREAMBLE}

Create a 4-frame attack animation sprite sheet of this character. ${GRID_INSTRUCTION}

${CHROMAKEY_RULES}

The character is performing a powerful attack. Based on the character's design, choose the most fitting attack type:
- Sword/weapon wielder: slash attack with a visible arc trail
- Magic user: energy spell with glowing projectile
- Martial artist: powerful strike with impact shockwave
- Ranged character: projectile launch with muzzle flash

IMPORTANT — ATTACK EFFECTS: Each frame MUST include visible VFX (visual effects) that match the attack type. The effects are an integral part of the animation, not optional. Effects include: motion blur lines, energy glow, slash arcs, impact sparks, or shockwaves.

Top row (frames 1-2):
Frame 1 (top-left): WIND-UP — Character pulls back weapon/arm or gathers energy. A subtle glow, aura, or energy gathering effect appears around the weapon or hands. Body leans back in anticipation. The effect is small and building.
Frame 2 (top-right): SWING/CAST — Attack in motion. Weapon swings forward or energy launches. A bright, visible slash trail / energy streak / motion arc extends from the attack point. Speed lines radiate from the motion direction. The effect is mid-size and dynamic.

Bottom row (frames 3-4):
Frame 3 (bottom-left): IMPACT — Maximum extension of attack. Large, dramatic VFX at the point of impact: bright slash arc with sparks, energy explosion burst, shockwave ring, or impact flash. This frame has the BIGGEST and most dramatic effect. The character's body is at full extension.
Frame 4 (bottom-right): RECOVERY — Character returns to ready stance. Effects are fading/dissipating: slash trail fading out, sparks scattering, energy wisps dissolving. The effect is small and diminishing.

${STYLE_SUFFIX}`,

  jump: `${SYSTEM_PREAMBLE}

Create a 4-frame jump animation sprite sheet of this character. ${GRID_INSTRUCTION}

${CHROMAKEY_RULES}

Top row (frames 1-2):
Frame 1 (top-left): CROUCH — Character crouches low, knees deeply bent, arms down, preparing to jump. Body compressed downward. Slight dust puff at feet from the push-off.
Frame 2 (top-right): RISING — Character launches upward, legs tucked underneath, arms raised. Body ascending with slight upward motion lines. Hair/cape/accessories trail downward from the upward motion.

Bottom row (frames 3-4):
Frame 3 (bottom-left): APEX — Character at the highest point. Body stretched out or in a dynamic mid-air pose. Arms and legs in a natural airborne position. Hair/cape floating freely.
Frame 4 (bottom-right): LANDING — Character descends, legs extending downward for landing, slight crouch to absorb impact. Small dust cloud at feet upon landing.

Each frame shows a distinctly different phase. Hair, cape, and accessories should react to the motion (flowing up during rise, floating at apex, falling during descent).

${STYLE_SUFFIX}`,

  idle: `${SYSTEM_PREAMBLE}

Create a 4-frame idle (breathing) animation sprite sheet of this character. ${GRID_INSTRUCTION}

${CHROMAKEY_RULES}

CRITICAL: Each of the 4 frames MUST be VISIBLY DIFFERENT from the others. The frames form a smooth animation loop. If you compare any two adjacent frames side by side, the difference must be obvious and unmistakable.

Animate ALL applicable secondary elements in EVERY frame:
- WINGS: gentle flapping cycle (folded -> half-open -> fully spread -> half-closed)
- TAIL: swaying side to side across frames
- LONG HAIR / CAPE / CLOAK: flowing and swaying with gentle movement
- FLOATING elements (orbs, magic aura, halo): bobbing up and down
- WEAPON: slight shifting or grip readjustment
- BODY: visible breathing cycle — rise and fall of torso and shoulders

Top row (frames 1-2):
Frame 1 (top-left): NEUTRAL — Body at rest position, shoulders relaxed. Secondary elements (wings/tail/hair/cape) at starting position. This is the baseline pose.
Frame 2 (top-right): INHALE — Body rises slightly, shoulders lift. Wings begin to spread OR tail swings left OR hair/cape flows right. Clearly different from Frame 1.

Bottom row (frames 3-4):
Frame 3 (bottom-left): PEAK — Body at peak of breath, chest expanded. Wings at maximum spread OR tail at opposite swing OR hair/cape at peak flow. This is the MOST different pose from Frame 1.
Frame 4 (bottom-right): EXHALE — Body settling back down, shoulders lowering. Wings folding back OR tail returning OR hair/cape settling. Transitioning back toward Frame 1.

Loop order: Frame 1 -> 2 -> 3 -> 4 -> 1 (repeating). The animation must loop smoothly.

${STYLE_SUFFIX}`,

  walk: `${SYSTEM_PREAMBLE}

Create a 4-frame walk cycle sprite sheet of this character walking to the right. ${GRID_INSTRUCTION}

${CHROMAKEY_RULES}

Top row (frames 1-2):
Frame 1 (top-left): RIGHT CONTACT — Right leg forward (heel touching ground), left leg back. Arms swing opposite to legs (left arm forward, right arm back). Body upright.
Frame 2 (top-right): RIGHT PASSING — Right leg straight under body bearing weight, left leg passing through (mid-swing). Arms at sides. Body at highest point.

Bottom row (frames 3-4):
Frame 3 (bottom-left): LEFT CONTACT — Left leg forward (heel touching ground), right leg back. Arms swing opposite (right arm forward, left arm back). Mirror of Frame 1.
Frame 4 (bottom-right): LEFT PASSING — Left leg straight under body bearing weight, right leg passing through (mid-swing). Arms at sides. Body at highest point. Mirror of Frame 2.

Each frame shows a distinctly different phase of the walk cycle. Hair, cape, and accessories should sway with the walking motion. This creates a smooth looping walk cycle: Frame 1 -> 2 -> 3 -> 4 -> 1.

${STYLE_SUFFIX}`,

  idle_back: `${SYSTEM_PREAMBLE}

Create a 4-frame idle (breathing) animation sprite sheet of this character viewed from BEHIND (BACK VIEW). ${GRID_INSTRUCTION}

PERSPECTIVE: The character faces UPWARD (toward the top of the screen). We see the character's BACK — the back of their head, back, shoulders from behind, and legs from behind. This is for a top-down game where the character is at the bottom of the screen facing upward.

${CHROMAKEY_RULES}

CRITICAL: Each of the 4 frames MUST be VISIBLY DIFFERENT from the others. ALL frames show the character from BEHIND (rear view), NOT the front. The frames form a smooth animation loop.

Animate ALL applicable secondary elements (seen from behind) in EVERY frame:
- WINGS: gentle flapping cycle visible from behind (folded -> half-open -> fully spread -> half-closed)
- TAIL: swaying left to right across frames
- LONG HAIR / CAPE / CLOAK: flowing and swaying, clearly visible from behind
- FLOATING elements (orbs, magic aura, halo): bobbing up and down
- WEAPON on back: slight shifting
- BODY: visible breathing cycle — rise and fall of shoulders as seen from behind

Top row (frames 1-2):
Frame 1 (top-left): NEUTRAL (back view) — Body at rest. Secondary elements at starting position. We see the BACK of the character.
Frame 2 (top-right): INHALE (back view) — Body rises slightly, shoulders lift. Wings spread OR tail swings OR hair flows. Clearly different from Frame 1.

Bottom row (frames 3-4):
Frame 3 (bottom-left): PEAK (back view) — Body at peak of breath. Wings at maximum spread OR tail at opposite swing OR hair at peak flow. Most different from Frame 1.
Frame 4 (bottom-right): EXHALE (back view) — Body settling down. Wings folding OR tail returning OR hair settling. Transitioning back toward Frame 1.

Loop order: Frame 1 -> 2 -> 3 -> 4 -> 1. ALL frames MUST show the character's BACK (rear view).

${STYLE_SUFFIX_BACK}`,

  attack_up: `${SYSTEM_PREAMBLE}

Create a 4-frame upward attack animation sprite sheet of this character viewed from BEHIND (BACK VIEW, attacking UPWARD). ${GRID_INSTRUCTION}

PERSPECTIVE: The character faces UPWARD and attacks toward the TOP of the screen. We see the character's BACK. This is for a top-down game where the character attacks enemies approaching from above.

${CHROMAKEY_RULES}

Based on the character's design, choose the most fitting upward attack:
- Sword/weapon wielder: upward slash with a visible arc trail
- Magic user: energy spell cast upward with glowing projectile
- Martial artist: upward strike with impact shockwave
- Ranged character: projectile fired upward with muzzle flash

IMPORTANT — ATTACK EFFECTS: Each frame MUST include visible VFX matching the attack type. Effects are integral to the animation: energy glow, slash arcs, impact sparks, motion lines, or shockwaves. All effects move UPWARD (toward the top of the image).

Top row (frames 1-2):
Frame 1 (top-left): WIND-UP (back view) — Character pulls back weapon or gathers energy, seen from behind. A subtle glow or energy-gathering effect appears around hands/weapon. Body leans slightly, preparing to strike upward.
Frame 2 (top-right): SWING/CAST (back view) — Attack launches upward. Weapon swings toward the top OR energy fires upward. A bright slash trail / energy streak extends UPWARD from the attack point. Speed lines radiate upward.

Bottom row (frames 3-4):
Frame 3 (bottom-left): IMPACT (back view) — Maximum upward extension. Large, dramatic VFX above the character: bright slash arc, energy explosion, shockwave, or impact flash ABOVE the character. This frame has the BIGGEST effect. Character's arms/weapon are fully extended upward.
Frame 4 (bottom-right): RECOVERY (back view) — Character returns to ready stance. Effects are fading: slash trail dissolving, sparks scattering upward, energy wisps dissipating. Character settling back to neutral.

ALL frames MUST show the character from BEHIND. Attack direction is UPWARD.

${STYLE_SUFFIX_BACK}`,
};
