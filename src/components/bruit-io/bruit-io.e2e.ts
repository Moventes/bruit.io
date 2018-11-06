import { newE2EPage } from '@stencil/core/testing';

describe('bruit-io', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<bruit-io></bruit-io>');
    const element = await page.find('bruit-io');
    expect(element).toHaveClass('hydrated');
  });
});
