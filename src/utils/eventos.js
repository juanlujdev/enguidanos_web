export const MES_ABBR = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];

export function parseEvDate(date) {
  const [y, m, d] = String(date).split("-").map(Number);
  const mi = (m || 1) - 1;
  return { y, mi, day: d || null, abbr: MES_ABBR[mi] };
}

export function expandEventos(list) {
  const out = [];
  for (const e of list) {
    if (e.dias && e.dias.length) {
      e.dias.forEach((dia, i) => out.push({
        ...e,
        date: dia.date,
        dayLabel: dia.label,
        items: dia.items || [],
        when: dia.label,
        multi: true,
        key: e.title + "|" + dia.date + "|" + i,
      }));
    } else {
      out.push({ ...e, items: e.items || null, key: e.title + "|" + e.date });
    }
  }
  return out;
}
