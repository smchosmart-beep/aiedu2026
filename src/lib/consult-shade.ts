export function consultShade(count: number) {
  const step = Math.max(0, Math.min(4, count));
  return {
    step,
    bg: `var(--consult-navy-${step})`,
    fg: step >= 3 ? "var(--consult-navy-fg-dark)" : "var(--consult-navy-fg-light)",
  };
}
