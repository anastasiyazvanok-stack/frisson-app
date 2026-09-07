import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { verifyRecording } from '../scripts/preserve-audio.mjs';

test('audio preservation refuses changed or truncated bytes', () => {
  const original = Buffer.from('synthetic audio');
  const entry = { file: 'test.mp3', bytes: original.length,
    sha256: createHash('sha256').update(original).digest('hex') };
  assert.doesNotThrow(() => verifyRecording(original, entry));
  assert.throws(() => verifyRecording(original.subarray(1), entry), /integrity/);
  assert.throws(() => verifyRecording(Buffer.from('different audio'), entry), /integrity/);
});
