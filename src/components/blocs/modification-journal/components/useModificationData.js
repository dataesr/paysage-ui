import { useMemo } from 'react';
import useFetch from '../../../../hooks/useFetch';

const useModificationData = (days) => {
  const queryDate = useMemo(() => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(), [days]);
  const { data, error } = useFetch(`/dashboard?filters[createdAt][$gte]=${queryDate}`);
  const topUsers = data?.data?.[0]?.byUser.slice(0, 15) || [];
  const userIDs = topUsers.map((item) => item._id);
  return { topUsers, error, userIDs };
};

export default useModificationData;
