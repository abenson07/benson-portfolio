export function splitEmphasis(
  text: string,
  emphasis: string,
): { text: string; emphasized: boolean }[] {
  if (!emphasis) {
    return [{ text, emphasized: false }];
  }

  const index = text.indexOf(emphasis);
  if (index === -1) {
    return [{ text, emphasized: false }];
  }

  const before = text.slice(0, index);
  const after = text.slice(index + emphasis.length);
  const segments: { text: string; emphasized: boolean }[] = [];

  if (before) {
    segments.push({ text: before, emphasized: false });
  }

  segments.push({ text: emphasis, emphasized: true });

  if (after) {
    segments.push({ text: after, emphasized: false });
  }

  return segments;
}
