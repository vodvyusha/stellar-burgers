import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('tests/fixtures/api.har', {
    url: '**/api/**',
    update: false,
    notFound: 'abort',
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
  test('Отображение данных выбранных ингредиентов', async ({ page }) => {
    const modal = page.getByRole('dialog', {
      name: 'Детали ингредиента',
    });

    const bun = page.getByRole('listitem').filter({ hasText: 'Краторная булка N-200i' });

    await bun.getByRole('link').click();

    await expect(modal).toBeVisible();

    await expect(
      modal.getByRole('heading', { name: 'Краторная булка N-200i' })
    ).toBeVisible();

    const calories = modal.getByRole('listitem').filter({ hasText: 'Калории, ккал' });

    await expect(calories.getByText('420', { exact: true })).toBeVisible();

    await modal.getByRole('button', { name: 'Закрыть' }).click();

    await expect(modal).not.toBeVisible();

    const sauce = page
      .getByRole('listitem')
      .filter({ hasText: 'Соус фирменный Space Sauce' });

    await sauce.getByRole('link').click();

    await expect(modal).toBeVisible();

    await expect(
      modal.getByRole('heading', { name: 'Соус фирменный Space Sauce' })
    ).toBeVisible();

    await expect(calories.getByText('14', { exact: true })).toBeVisible();

    await expect(
      modal.getByRole('heading', { name: 'Краторная булка N-200i' })
    ).toHaveCount(0);
  });

  test('Закрытие модального окна по клику на крестик', async ({ page }) => {
    const bun = page.getByRole('listitem').filter({ hasText: 'Краторная булка N-200i' });

    await bun.getByRole('link').click();

    const modal = page.getByRole('dialog', {
      name: 'Детали ингредиента',
    });

    await expect(modal).toBeVisible();

    await modal.getByRole('button', { name: 'Закрыть' }).click();

    await expect(modal).not.toBeVisible();
    await expect(page).toHaveURL('http://localhost:4000/');
  });

  test('Закрытие модального окна по клику на оверлей', async ({ page }) => {
    const bun = page.getByRole('listitem').filter({ hasText: 'Краторная булка N-200i' });

    await bun.getByRole('link').click();

    const modal = page.getByRole('dialog', {
      name: 'Детали ингредиента',
    });

    await expect(modal).toBeVisible();

    await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });

    await expect(modal).not.toBeVisible();
    await expect(page).toHaveURL('http://localhost:4000/');
  });
});

test.describe('Тестирование оформления заказа', () => {
  test('Успешное оформление заказа', async ({ page }) => {
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

    const har = JSON.parse(readFileSync('tests/fixtures/api.har', 'utf8'));

    const orderEntry = har.log.entries.find(
      (entry: { request: { method: string; url: string } }) =>
        entry.request.method === 'POST' && entry.request.url.endsWith('/api/orders')
    );

    if (!orderEntry?.response?.content?.text) {
      throw new Error('В HAR не найден ответ на создание заказа');
    }

    const orderResponse = JSON.parse(orderEntry.response.content.text);

    const expectedOrderNumber = String(orderResponse.order.number);

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

    const orderModal = page.getByRole('dialog', {
      name: 'Информация о заказе',
    });

    await expect(orderModal).toBeVisible();

    await expect(
      orderModal.getByRole('heading', {
        name: expectedOrderNumber,
        exact: true,
      })
    ).toBeVisible();

    await expect(orderModal.getByText('идентификатор заказа')).toBeVisible();

    await expect(page.getByText('Выберите булки')).toHaveCount(2);

    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await orderModal.getByRole('button', { name: 'Закрыть' }).click();

    await expect(orderModal).not.toBeVisible();
  });
});
