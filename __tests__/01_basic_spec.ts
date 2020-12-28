import {
  createFetchStore,
} from '../src/index';

describe('basic spec', () => {
  it('exported function', () => {
    expect(createFetchStore).toBeDefined();
  });
});
