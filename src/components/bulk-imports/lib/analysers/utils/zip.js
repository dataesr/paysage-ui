export default function zip(headers, row, parsingFunctions = {}) {
  return headers.reduce((acc, current, index) => {
    if (typeof current === 'undefined' || !row[index]) return acc;
    const parser = parsingFunctions[current];
    if (!parser) return { ...acc, [current]: row[index] };
    return { ...acc, [current]: parser(row[index]) };
  }, {});
}
