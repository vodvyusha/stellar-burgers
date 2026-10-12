import { AppHeaderUI } from '@ui';

import { selectUserName } from '@services/selectors';
import { useSelector } from '@services/store';

export const AppHeader = (): React.JSX.Element => {
  const userName = useSelector(selectUserName);

  return <AppHeaderUI userName={userName} />;
};
