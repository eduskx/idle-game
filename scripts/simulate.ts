/**
 * Headless balance simulation: a simple bot plays the game and reports pacing.
 * Usage: npm run simulate -- [hours=48]
 */
import { CREATURE_BY_ID } from '../src/data/creatures';
import { TALENTS, UPGRADES } from '../src/data/progression';
import {
  buyTalent,
  buyUpgrade,
  canRebloom,
  checkAchievements,
  createInitialState,
  creatureLevelMult,
  globalModifiers,
  rebloom,
  rebloomReward,
  setTeam,
  simulate,
  summon,
  talentCost,
  upgradeLevelCost,
  type GameState,
} from '../src/engine';

const hours = Number(process.argv[2] ?? 48);
const s: GameState = createInitialState(0, 12345);

function power(id: string): number {
  const def = CREATURE_BY_ID[id]!;
  const lv = creatureLevelMult(s.creatures[id]!);
  return def.baseAtk * lv.atk * def.speed * Math.sqrt(def.baseHp * lv.hp);
}

function bot(): void {
  // Upgrades: always buy the cheapest affordable one.
  for (let i = 0; i < 200; i++) {
    const options = UPGRADES.filter((u) => s.upgrades[u.id] < u.maxLevel).sort(
      (a, b) => upgradeLevelCost(s, a.id) - upgradeLevelCost(s, b.id),
    );
    const cheapest = options[0];
    if (!cheapest || !buyUpgrade(s, cheapest.id)) break;
  }
  while (summon(s)) {
    /* spend all essence */
  }
  for (let i = 0; i < 200; i++) {
    const options = TALENTS.filter((t) => s.talents[t.id] < t.maxLevel).sort(
      (a, b) => talentCost(s, a.id) - talentCost(s, b.id),
    );
    if (!options.some((t) => buyTalent(s, t.id))) break;
  }
  const slots = globalModifiers(s).teamSlots;
  const best = Object.keys(s.creatures)
    .sort((a, b) => power(b) - power(a))
    .slice(0, slots);
  setTeam(s, best);
  checkAchievements(s);
}

const milestones = [10, 25, 50, 100, 150, 200, 300, 400, 500, 750, 1000, 1500, 2000];
const reached: Record<number, number> = {};
let lastProgressAt = 0;
let lastHighest = 1;
const step = 10;
const total = hours * 3600;

for (let t = 0; t < total; t += step) {
  simulate(s, step, 0.2);
  bot();
  if (s.runHighestStage > lastHighest) {
    lastHighest = s.runHighestStage;
    lastProgressAt = t;
  }
  for (const m of milestones) {
    if (reached[m] === undefined && s.lifetime.highestStage >= m) reached[m] = t;
  }
  const stuck = t - lastProgressAt;
  if (stuck > 60 && t % 60 === 0) s.battle.autoAdvance = true;
  if (stuck > 15 * 60 && canRebloom(s)) {
    const reward = rebloomReward(s);
    rebloom(s);
    console.log(
      `[${(t / 3600).toFixed(2)}h] rebloom #${s.lifetime.reblooms} at stage ${lastHighest} -> +${reward} seeds`,
    );
    lastHighest = s.runHighestStage;
    lastProgressAt = t;
  }
}

const fmt = (sec: number) => `${(sec / 3600).toFixed(2)}h`;
console.log('\nMilestones (highest stage -> time):');
for (const m of milestones)
  console.log(`  ${String(m).padStart(5)}: ${reached[m] !== undefined ? fmt(reached[m]) : '-'}`);
console.log('\nFinal:', {
  highest: s.lifetime.highestStage,
  stage: s.battle.stage,
  creatures: Object.keys(s.creatures).length,
  reblooms: s.lifetime.reblooms,
  seeds: s.currencies.seeds,
  achievements: s.achievements.length,
  team: s.team.map((id) => `${id} L${s.creatures[id]!.level} *${s.creatures[id]!.stars}`),
});
