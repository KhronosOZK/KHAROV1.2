// Duration based pricing and operator earnings helpers

export const DURATIONS = [
  { weeks: 4, label: "4 weeks" },
  { weeks: 8, label: "8 weeks" },
  { weeks: 12, label: "12 weeks" },
  { weeks: 26, label: "26 weeks" },
  { weeks: 52, label: "52 weeks" },
];

export function discountForWeeks(weeks) {
  if (weeks >= 52) return 0.10;
  if (weeks >= 26) return 0.08;
  if (weeks >= 12) return 0.06;
  if (weeks >= 4) return 0.03;
  return 0;
}

export function weeklyForWeeks(base, weeks) {
  return +(base * (1 - discountForWeeks(weeks))).toFixed(2);
}

export const PRICING_TIERS = [
  { label: "Flexible", sub: "1 to 3 weeks", weeks: 1 },
  { label: "Standard", sub: "4 to 11 weeks", weeks: 4 },
  { label: "Long term", sub: "12 weeks or more", weeks: 12 },
];

// Rough operator earnings estimate (gross, before Caro's 10% fee)
export function estimateOperatorAnnual(fleetSizeLabel) {
  const midpoint = { "1-5": 3, "6-15": 10, "16-30": 22, "30+": 40 }[fleetSizeLabel] || 10;
  const avgWeekly = 255;
  const utilisation = 0.85;
  const perCarYear = Math.round(avgWeekly * 52 * utilisation);
  return { perCarYear, fleetYear: perCarYear * midpoint, cars: midpoint };
}
