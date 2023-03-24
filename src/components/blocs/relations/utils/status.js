/* eslint-disable no-nested-ternary */
import { getComparableNow } from '../../../../utils/dates';

export function isFinished(relation) {
  return (relation?.active === false) || (relation?.endDate < getComparableNow());
}

export function spreadByStatus(data) {
  const current = data?.filter((el) => (el.startDate <= getComparableNow() || (!el.startDate && !el.endDate)) && !isFinished(el));
  const inactive = data?.filter((el) => isFinished(el));
  const forthcoming = data?.filter((el) => el.startDate > getComparableNow());
  const counts = {
    current: current?.length, inactive: inactive?.length, forthcoming: forthcoming?.length,
  };
  const defaultFilter = counts.current
    ? 'current'
    : counts.inactive
      ? 'inactive'
      : counts.forthcoming
        ? 'forthcoming'
        : 'current';
  return { data: { current, inactive, forthcoming }, counts, defaultFilter };
}
