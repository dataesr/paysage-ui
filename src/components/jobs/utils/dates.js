export function timeBetween(startDate, endDate) {
  if (!startDate || !endDate) return 'date invalide';
  const ms = endDate - startDate;
  const seconds = (ms / 1000).toFixed(0);
  const minutes = (ms / (1000 * 60)).toFixed(1);
  const hours = (ms / (1000 * 60 * 60)).toFixed(1);
  const days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
  if (seconds < 60) return `${seconds}s`;
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

function time(date) {
  if (!date) return 'date invalide';
  const seconds = Math.abs(Math.floor((new Date() - date) / 1000));
  let interval = seconds / 31536000;
  if (interval > 1) {
    return `${Math.floor(interval)} ans`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} mois`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)} jours`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} heures`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} minutes`;
  }
  return `${Math.floor(seconds)} secondes`;
}

export function timeSince(date) {
  if (!date) return 'date invalide';
  return time(date);
}

export function timeTo(date) {
  if (!date) return 'date invalide';
  return time(date);
}
