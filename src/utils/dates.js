export function validDate(d) {
  return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/g.test(d);
}

export function fromApproximativeDate(d) {
  if (!validDate(d)) return null;
  if (d.length === 4) return `${d}-01-01`;
  if (d.length === 7) return `${d}-01`;
  return d;
}

export function toString(date, time = false) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  if (time) return new Date(date).toLocaleString('fr-FR', { ...options, timeOptions });
  return new Date(date).toLocaleDateString('fr-FR', options);
}

export function reverseDate(d) {
  const arrDate = d.split('-');
  switch (arrDate.length) {
  case 2:
    return `${arrDate[1]}/${arrDate[0]}`;

  case 3:
    return `${arrDate[2]}/${arrDate[1]}/${arrDate[0]}`;

  default:
    return d;
  }
}

export function formatDescriptionDates(startDate = null, endDate = null) {
  if (!startDate && !endDate) { return null; }
  if (!startDate && endDate) {
    if (endDate.split('-').length === 1) {
      return `jusqu'à ${toString(endDate)}`;
    }
    return `jusqu'au ${toString(endDate)}`;
  }
  if (startDate && !endDate) {
    if (startDate.split('-').length === 1) {
      return `depuis ${toString(startDate)}`;
    }
    return `depuis le ${toString(startDate)}`;
  }
  if (startDate && endDate) {
    let ret = '';
    if (startDate.split('-').length === 1) {
      ret = `de ${toString(startDate)} `;
    } else {
      ret = `du ${toString(startDate)} `;
    }
    if (endDate.split('-').length === 1) {
      ret += `à ${toString(endDate)} `;
    } else {
      ret += `au ${toString(endDate)}`;
    }
    return ret;
  }
  return null;
}
