export const formatCLP = (val: number | null | undefined): string => {
  if (val == null) return "$0 CLP";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(val) + " CLP";
};

export const formatCompactCLP = (val: number | null | undefined): string => {
  if (val == null) return "$0";
  if (Math.abs(val) >= 1_000_000) {
    return `$${(val / 1_000_000).toFixed(val % 1_000_000 === 0 ? 0 : 1)}M CLP`;
  }
  return formatCLP(val);
};