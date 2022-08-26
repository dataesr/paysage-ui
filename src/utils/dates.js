/* eslint-disable prefer-regex-literals */
export function getDayFromAPIDate(APIDate) {
  if (APIDate) {
    // return APIDate.substr(8, 2);
    return APIDate.split('-')[2];
  }

  return '';
}

export function getMonthFromAPIDate(APIDate) {
  if (APIDate) {
    // return APIDate.substr(5, 2);
    return APIDate.split('-')[1];
  }

  return '';
}

export function getYearFromAPIDate(APIDate) {
  if (APIDate) {
    // return APIDate.substr(0, 4);
    return APIDate.split('-')[0];
  }

  return '';
}

export function validDate(d) {
  const reg = new RegExp(
    /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
    'g',
  );

  return reg.test(d);
}

export function getApproximativeDate(d) {
  if (!d) return null;

  const dd = d.split('-')[2];
  const mm = d.split('-')[1];
  const yyyy = d.split('-')[0];
  const months = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'aout',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ];

  if (dd === '01' && mm === '01') return yyyy;
  if (dd === '01') return `${months[mm - 1]} ${yyyy}`;

  return `${dd} ${months[mm - 1]} ${yyyy}`;
}

export function toString(date, time = false) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  if (time) return new Date(date).toLocaleString('fr-FR', options);
  return new Date(date).toLocaleDateString('fr-FR', options);
}
