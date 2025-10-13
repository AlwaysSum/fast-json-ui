import { describe, it, expect } from 'vitest';
import { toPreview, stripWrapper } from '../JsonTransformFactory';
import ComponentManager, { registerTypeWrapper } from '../ComponentManager';
import type { ComponentConfig } from '../../types';

describe('JsonTransformFactory', () => {
  it('toPreview 应为每个节点包裹 ComponentRenderer，且不修改输入', () => {
    const input: ComponentConfig = {
      type: 'container',
      children: [
        { type: 'text', text: 'Hello' },
      ],
    } as any;

    const original = JSON.parse(JSON.stringify(input));
    const preview = toPreview(input, { isEditor: true });

    // 根节点被包裹
    expect(preview.type).toBe('ComponentRenderer');
    const rootChild = (preview as any).child;
    expect(rootChild.type).toBe('container');

    // 子节点也被包裹
    expect(Array.isArray(rootChild.children)).toBe(true);
    expect(rootChild.children[0].type).toBe('ComponentRenderer');
    expect((rootChild.children[0] as any).child.type).toBe('text');

    // 输入未被修改（无副作用）
    expect(input).toEqual(original);
  });

  it('stripWrapper 应恢复为原始编辑 JSON 结构', () => {
    const input: ComponentConfig = {
      type: 'row',
      children: [
        { type: 'text', text: 'A' },
        { type: 'text', text: 'B' },
      ],
    } as any;

    const preview = toPreview(input, { isEditor: false });
    const stripped = stripWrapper(preview)!;

    expect(stripped.type).toBe('row');
    expect(Array.isArray((stripped as any).children)).toBe(true);
    expect((stripped as any).children[0].type).toBe('text');
    expect((stripped as any).children[1].type).toBe('text');
  });

  it('支持为指定类型注册包装策略', () => {
    registerTypeWrapper('special', (child, options) => ({
      type: 'ComponentRenderer',
      child,
      isEditor: options.isEditor,
      path: options.path || [],
      special: true,
    } as any));

    const input: ComponentConfig = {
      type: 'container',
      children: [
        { type: 'special', foo: 1 } as any,
      ],
    } as any;

    const preview = toPreview(input, { isEditor: true });
    const rootChild = (preview as any).child;
    const wrapped = rootChild.children[0];
    expect(wrapped.type).toBe('ComponentRenderer');
    expect((wrapped as any).special).toBe(true);
  });
});