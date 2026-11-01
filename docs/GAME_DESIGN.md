# Game Design – Hollowbloom

## Pitch

A cozy-meets-creepy idle battler. Two realms share one world: **Hearth** (warm, cute, mushrooms and teacups)
and **Umbra** (ghosts, bones, abyss). Players choose their mood: pure-realm teams are strong fighters,
mixed teams are better farmers. Nobody is forced into the aesthetic they do not like.

## Core loop (seconds → minutes)

1. Team auto-fights enemies. 5 kills clear a stage; every 10th stage is a boss with a 30 s timer.
2. Kills give **gold** (upgrades), **XP** (creature levels) and sometimes **essence** (summons).
3. Losing pushes the team one stage back and switches to _farming_; the player re-enables _auto-advance_ when stronger.

## Mid loop (hours)

- **Summoning** for new creatures; duplicates → shards → stars (raise stats, level cap and ability strength).
- **Team building**: front position matters (takes hits), Taunt overrides it, elements counter enemies,
  synergies reward realm choices, support abilities (gold/XP/essence/haste) compete with fighters for slots.

## Long loop (days → months)

- **Rebloom** (prestige) from stage 60: reset run, gain **seeds** = floor((stage / 30)^1.7) × bonuses.
- **Talents** (12 nodes, tree with prerequisites) give multiplicative permanent power, offline time, head start, extra team slot.
- **Achievements** give +3 % damage each.
- **Endless zones**: after 12 zones the world loops with ×4 difficulty per cycle, so there is no hard cap.

## Pacing targets (bot simulation, `npm run simulate`)

| Milestone     | Time (bot) |
| ------------- | ---------- |
| Stage 100     | ~7 min     |
| First rebloom | ~30 min    |
| Stage 200     | ~6.5 h     |
| Stage 300     | ~1 day     |
| Stage 400     | ~3 days    |

A real player is slower than the bot (not always online, imperfect choices), which roughly doubles these times.
Long-term content (relics, expeditions, more zones) should extend the curve to months – see ROADMAP.md.

## Monetization stance

Currently none. If added later: **cosmetics and supporter perks only, never pay-to-win**. See docs/LEGAL.md
for what has to happen before any money is involved.
