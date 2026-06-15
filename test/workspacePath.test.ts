import assert from 'node:assert/strict';
import test from 'node:test';

const { isAllowedStaleCommand, isPathWithinRoots } = require('../out/pathGuards');

test('isPathWithinRoots allows files inside a workspace root', () => {
  const root = '/Users/dev/my-rails-app';
  assert.equal(
    isPathWithinRoots(`${root}/app/models/user.rb`, [root]),
    true
  );
  assert.equal(
    isPathWithinRoots(`${root}/db/structure.sql`, [root]),
    true
  );
});

test('isPathWithinRoots rejects paths outside workspace roots', () => {
  const root = '/Users/dev/my-rails-app';
  assert.equal(
    isPathWithinRoots('/etc/passwd', [root]),
    false
  );
  assert.equal(
    isPathWithinRoots('/Users/dev/other-app/app/models/user.rb', [root]),
    false
  );
});

test('isAllowedStaleCommand accepts only Rails dump commands', () => {
  assert.equal(isAllowedStaleCommand('rails db:structure:dump'), true);
  assert.equal(isAllowedStaleCommand('rails db:schema:dump'), true);
  assert.equal(isAllowedStaleCommand('rm -rf /'), false);
  assert.equal(isAllowedStaleCommand('curl evil.example'), false);
});
