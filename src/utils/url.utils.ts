import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

export const useQuery = () => {
  const history = useHistory();

  return useMemo(() => new URLSearchParams(history.location.search), [history]);
};
