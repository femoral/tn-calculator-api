import { main } from '../src';

describe('index', () => {
  it('should run with no issue, when main is called', () => {
    expect(main()).toBeFalsy();
  });
});
