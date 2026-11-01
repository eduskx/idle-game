import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AVATAR_ITEMS, DEFAULT_AVATAR } from '../../data/avatar';
import { Avatar, PIECE_VIEWBOX } from './Avatar';
import { BACK_VIEW_BY_SLOT, HAIR_BACK_VIEW } from './parts';

const pieces = AVATAR_ITEMS.filter((i) => i.id !== 'none');

describe('avatar back view', () => {
  it('has a back piece for every hair style and item', () => {
    for (const item of AVATAR_ITEMS) {
      if (item.slot === 'hair') expect(HAIR_BACK_VIEW[item.id], item.id).toBeTypeOf('function');
      else expect(BACK_VIEW_BY_SLOT[item.slot][item.id], item.id).toBeDefined();
    }
  });

  it('renders every item from behind without the face', () => {
    const front = renderToStaticMarkup(<Avatar avatar={DEFAULT_AVATAR} />);
    const back = renderToStaticMarkup(<Avatar avatar={DEFAULT_AVATAR} view="back" />);
    // the eyes' sparkles are the only white circles of the front view
    expect(front).toContain('fill="#fff"');
    expect(back).not.toContain('r="2.3"');
    for (const item of pieces) {
      const avatar = { ...DEFAULT_AVATAR, items: { ...DEFAULT_AVATAR.items, [item.slot]: item.id } };
      expect(renderToStaticMarkup(<Avatar avatar={avatar} view="back" />), item.id).toContain('<svg');
    }
  });
});

describe('wardrobe piece crops', () => {
  it('gives every piece a square crop', () => {
    for (const item of pieces) {
      const box = PIECE_VIEWBOX[item.id]?.split(' ').map(Number);
      expect(box, item.id).toHaveLength(4);
      expect(box![2]).toBe(box![3]);
      expect(box![2]).toBeGreaterThan(20);
    }
  });
});
