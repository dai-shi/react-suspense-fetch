import {
  prepare,
  run,
  prefetch,
} from '../src/index';

describe('basic spec', () => {
  it('exported function', () => {
    expect(prepare).toBeDefined();
    expect(run).toBeDefined();
    expect(prefetch).toBeDefined();
  });
});
