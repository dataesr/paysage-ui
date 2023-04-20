export function toString(date, time = false, isCompact = false) {
  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  let options = dateOptions;
  if (time) options = { ...options, ...timeOptions };
  if (isCompact) options.month = 'numeric';
  if (date?.length === 4) {
    delete options.month;
    delete options.day;
  } else if (date?.length === 7) {
    delete options.day;
  }
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

export function fromApproximativeDate(d) {
  if (d?.length === 4) return `${d.toString()}-01-01`;
  if (d?.length === 7) return `${d.toString()}-01`;
  return d;
}

export function getComparableNow() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function formatDescriptionDatesForMandateAndPrizes({ startDate = null, endDate = null, endDatePrevisional = null, active = null }) {
  if (!startDate && !endDate && !endDatePrevisional && !active) { return null; }

  if (startDate && !endDate) {
    if (startDate > getComparableNow()) {
      let ret = '';
      if (startDate.length === 10) {
        ret += ` à partir du ${toString(startDate)}`;
      }
      if (startDate.length < 10) {
        ret += ` à partir de ${toString(startDate)}`;
      }
      return ret;
    }
    if (startDate < getComparableNow() && active === false && !endDate && !endDatePrevisional) {
      let ret = '';
      if (startDate.length === 10) {
        ret += ` du ${toString(startDate)} jusqu'à une date inconnue`;
      }
      if (startDate.length < 10) {
        ret += ` de ${toString(startDate)} jusqu'à une date inconnue`;
      }
      return ret;
    }
    let ret = '';
    if (startDate.length === 10) {
      ret += ` depuis le ${toString(startDate)}`;
    }
    if (startDate.length < 10) {
      ret += ` depuis ${toString(startDate)}`;
    }
    if (endDatePrevisional) {
      if (endDatePrevisional.length === 10) {
        ret += ` (fin de mandat le ${toString(endDatePrevisional)})`;
      }
      if (endDatePrevisional.length < 10) {
        ret += ` (fin de mandat en ${toString(endDatePrevisional)})`;
      }
    }
    return ret;
  }
  if (!startDate && endDate) {
    let ret = '';
    if (endDate.length === 10) {
      ret += ` jusqu'au ${toString(endDate)}`;
    }
    if (endDate.length < 10) {
      ret += ` jusqu'en ${toString(endDate)}`;
    }
    return ret;
  }
  if (startDate && endDate) {
    let ret = '';
    if (startDate.length < 10) {
      ret = ` de ${toString(startDate)} `;
    } else {
      ret = ` du ${toString(startDate)} `;
    }
    if (endDate.length < 10) {
      ret += ` à ${toString(endDate)} `;
    } else {
      ret += ` au ${toString(endDate)}`;
    }
    return ret;
  }

  return null;
}

export function formatDescriptionDates(startDate = null, endDate = null) {
  if (!startDate && !endDate) { return null; }
  if (!startDate && endDate) {
    if (endDate.split('-').length === 1) {
      return ` jusqu'à ${toString(endDate)}`;
    }
    if (endDate.split('-').length === 2) {
      return `jusqu'en ${toString(endDate)}`;
    }
    return ` jusqu'au ${toString(endDate)}`;
  }
  if (startDate && !endDate) {
    if (startDate.split('-').length !== 3) {
      return ` depuis ${toString(startDate)}`;
    }
    return ` depuis le ${toString(startDate)}`;
  }
  if (startDate && endDate) {
    let ret = '';
    if (startDate.split('-').length !== 3) {
      ret = ` de ${toString(startDate)} `;
    } else {
      ret = ` du ${toString(startDate)} `;
    }
    if (endDate.split('-').length === 1) {
      ret += ` à ${toString(endDate)} `;
    } else {
      ret += ` au ${toString(endDate)}`;
    }
    return ret;
  }
  return null;
}
