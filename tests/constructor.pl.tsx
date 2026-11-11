import { test, expect } from '@playwright/test';
import userMock from './fixtures/user.json' with { type: 'json' };
import orderMock from './fixtures/order.json' with { type: 'json' };

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('tests/fixtures/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
  });

  await page.goto('/');
});

test.describe('Тестирование конструктора бургера', () => {
  test('Ингредиенты отображаются на странице', async ({ page }) => {
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible();
  });

  test('Добавление булочки в конструктор', async ({ page }) => {
    const bun = page.getByRole('listitem').filter({ hasText: 'Краторная булка N-200i' });

    await bun.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();

    await expect(page.getByText('Краторная булка N-200i (низ)')).toBeVisible();
  });

  test('Добавление котлеты в конструктор', async ({ page }) => {
    const main = page
      .getByRole('listitem')
      .filter({ hasText: 'Говяжий метеорит (отбивная)' });

    await main.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      page
        .locator('.constructor-element__text')
        .filter({ hasText: 'Говяжий метеорит (отбивная)' })
    ).toBeVisible();

    await expect(page.getByText('Выберите начинку')).toBeHidden();
  });

  test('Добавление соуса в конструктор', async ({ page }) => {
    const sauce = page
      .getByRole('listitem')
      .filter({ hasText: 'Соус фирменный Space Sauce' });

    await sauce.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      page
        .locator('.constructor-element__text')
        .filter({ hasText: 'Соус фирменный Space Sauce' })
    ).toBeVisible();

    await expect(page.getByText('Выберите начинку')).toBeHidden();
  });
});

test.describe('Тестирование модального окна', () => {
  test('Открытие модального окна ингредиента', async ({ page }) => {
    await page
      .getByText('Краторная булка N-200i', {
        exact: true,
      })
      .click();

    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Краторная булка N-200i' })
    ).toBeVisible();
  });

  test('Закрытие модального окна ингредиента по клику на крестик', async ({ page }) => {
    await page
      .getByText('Краторная булка N-200i', {
        exact: true,
      })
      .click();

    const modalTitle = page.getByRole('heading', {
      name: 'Детали ингредиента',
    });

    await expect(modalTitle).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();

    await expect(modalTitle).not.toBeVisible();
    await expect(page).toHaveURL('http://localhost:4000/');
  });

  test('Закрытие модального окна ингредиента по клику на оверлей', async ({ page }) => {
    await page
      .getByText('Краторная булка N-200i', {
        exact: true,
      })
      .click();

    const modalTitle = page.getByRole('heading', {
      name: 'Детали ингредиента',
    });

    await expect(modalTitle).toBeVisible();

    await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });

    await expect(modalTitle).not.toBeVisible();
    await expect(page).toHaveURL('http://localhost:4000/');
  });
});

test.describe('Тестирование оформления заказа', () => {
  test('Успешное оформление заказа', async ({ page }) => {
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({ json: userMock });
    });

    await page.route('**/api/orders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({ json: orderMock });
      } else {
        await route.continue();
      }
    });

    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: 'http://localhost:4000',
      },
    ]);

    await page.evaluate(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.reload();

    const bun = page.getByRole('listitem').filter({ hasText: 'Краторная булка N-200i' });

    await bun.getByRole('button', { name: 'Добавить' }).click();

    const main = page
      .getByRole('listitem')
      .filter({ hasText: 'Говяжий метеорит (отбивная)' });

    await main.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();

    await expect(page.getByText('Краторная булка N-200i (низ)')).toBeVisible();

    await expect(
      page
        .locator('.constructor-element__text')
        .filter({ hasText: 'Говяжий метеорит (отбивная)' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByRole('heading', { name: '12345' })).toBeVisible();

    await expect(page.getByText('Выберите булки')).toHaveCount(2);

    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();

    await expect(page.getByText('идентификатор заказа')).not.toBeVisible();
  });
});
