export const formatCNIC = (value) => {
  const digits = value?.replace(/\D/g, '').slice(0, 13) ?? '';
  const part1 = digits.slice(0, 5);
  const part2 = digits.slice(5, 12);
  const part3 = digits.slice(12, 13);
  let formatted = part1;
  if (part2) formatted += `-${part2}`;
  if (part3) formatted += `-${part3}`;
  return formatted;
};