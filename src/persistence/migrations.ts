/**
 * Save migrations. When the save format changes:
 * 1. bump SAVE_VERSION in engine/state.ts
 * 2. add a function here that converts version N-1 to N
 * 3. add a test with a real old save in persistence.test.ts
 */
type Migration = (data: Record<string, unknown>) => Record<string, unknown>;

const MIGRATIONS: Record<number, Migration> = {
  // 2: (d) => ({ ...d, version: 2, newField: 0 }),
};

export function migrate(raw: unknown): unknown {
  if (typeof raw !== 'object' || raw === null) return raw;
  let data = raw as Record<string, unknown>;
  let version = typeof data.version === 'number' ? data.version : 0;
  while (MIGRATIONS[version + 1]) {
    data = MIGRATIONS[version + 1]!(data);
    version += 1;
  }
  return data;
}
