import { newE2EPage } from '@stencil/core/dist/testing';

describe('bruit-modal', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<bruit-modal></bruit-modal>');
    const element = await page.find('bruit-modal');
    expect(element).toHaveClass('hydrated');
  });
});
