import { ProfileMenu, OrdersList } from '@components';

import type { ProfileOrdersUIProps } from './type';

import styles from './profile-orders.module.css';

export const ProfileOrdersUI = ({
  orders,
  error,
}: ProfileOrdersUIProps): React.JSX.Element => (
  <main className={`${styles.main}`}>
    <div className={`mt-30 mr-15 ${styles.menu}`}>
      <ProfileMenu />
    </div>
    <div className={`mt-10 ${styles.orders}`}>
      {error && (
        <p className="text text_type_main-default text_color_error mb-4">{error}</p>
      )}
      <OrdersList orders={orders} />
    </div>
  </main>
);
