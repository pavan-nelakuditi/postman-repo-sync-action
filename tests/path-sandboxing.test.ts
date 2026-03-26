import { describe, expect, it } from 'vitest';
import { assertPathWithinCwd } from '../src/index.js';

describe('assertPathWithinCwd', () => {
  it('allows relative paths within repo root', () => {
    expect(() => assertPathWithinCwd('postman', 'artifact-dir')).not.toThrow();
    expect(() => assertPathWithinCwd('.github/workflows/ci.yml', 'ci-workflow-path')).not.toThrow();
    expect(() => assertPathWithinCwd('nested/deep/dir', 'artifact-dir')).not.toThrow();
  });

  it('rejects paths that traverse above repo root', () => {
    expect(() => assertPathWithinCwd('../out', 'artifact-dir')).toThrow(
      'artifact-dir must stay within the repository root; received ../out'
    );
    expect(() => assertPathWithinCwd('../../etc/passwd', 'ci-workflow-path')).toThrow(
      'ci-workflow-path must stay within the repository root'
    );
    expect(() => assertPathWithinCwd('postman/../../out', 'artifact-dir')).toThrow(
      'artifact-dir must stay within the repository root'
    );
  });

  it('rejects absolute paths', () => {
    expect(() => assertPathWithinCwd('/etc/passwd', 'artifact-dir')).toThrow(
      'artifact-dir must stay within the repository root; received /etc/passwd'
    );
    expect(() => assertPathWithinCwd('/tmp/output', 'ci-workflow-path')).toThrow(
      'ci-workflow-path must stay within the repository root; received /tmp/output'
    );
  });

  it('allows current directory reference', () => {
    expect(() => assertPathWithinCwd('.', 'artifact-dir')).not.toThrow();
    expect(() => assertPathWithinCwd('./postman', 'artifact-dir')).not.toThrow();
  });
});
