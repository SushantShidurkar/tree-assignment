import { createD3Tree} from '@/utils/d3tree';
import { vi } from 'vitest';
import { useDataStore } from '@/stores';
import { setActivePinia, createPinia } from 'pinia';
import type { TreeConfig, TreeNode } from '@/models/model';

vi.mock('@/stores', () => ({
  useDataStore: () => ({
    setSelectedNode: vi.fn(),
  }),
}));
vi.mock('@/stores', () => {
  return {
    useDataStore: () => ({
      data: null,
      loading: false,
      error: null,
      selectedNode: null,
      setSelectedNode: vi.fn(),
    }),
  };
});
describe('createD3Tree', () => {
  let element: HTMLElement;
  let dataStoreMock: any;

  beforeAll(() => {
    Object.defineProperty(SVGElement.prototype, 'getBBox', {
      value: vi.fn(() => ({
        width: 100,
        height: 20,
      })),
    });
  });

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
    setActivePinia(createPinia());
    dataStoreMock = useDataStore();
  });

  afterEach(() => {
    element.remove();
    vi.clearAllMocks();
  });

  it('should render the tree correctly for linkType line', () => {
    const data: TreeNode = {
      name: 'Root',
      children: [{ name: 'Child 1' }, { name: 'Child 2' }],
    };

    const config: TreeConfig = {
      width: 600,
      height: 400,
      margin: { top: 20, right: 90, bottom: 30, left: 90 },
    };

    createD3Tree(element, data, config, 'line', vi.fn());
    const nodes = element.querySelectorAll('.node');
    expect(nodes.length).toBe(3);
    expect(nodes[0].querySelector('text')?.textContent).toBe('Root');
    expect(nodes[1].querySelector('text')?.textContent).toBe('Child 1');
    expect(nodes[2].querySelector('text')?.textContent).toBe('Child 2');
  });

  it('should render the tree correctly for linkType path', () => {
    const data: TreeNode = {
      name: 'Root',
      children: [{ name: 'Child 1' }, { name: 'Child 2' }],
    };

    const config: TreeConfig = {
      width: 600,
      height: 400,
      margin: { top: 20, right: 90, bottom: 30, left: 90 },
    };

    createD3Tree(element, data, config, 'path', vi.fn());
    const nodes = element.querySelectorAll('.node');
    expect(nodes.length).toBe(3);
    expect(nodes[0].querySelector('text')?.textContent).toBe('Root');
    expect(nodes[1].querySelector('text')?.textContent).toBe('Child 1');
    expect(nodes[2].querySelector('text')?.textContent).toBe('Child 2');
  });

  it('should highlight the selected node and call onNodeClick', () => {
    const data: TreeNode = {
      name: 'Root',
      children: [{ name: 'Child 1' }, { name: 'Child 2' }],
    };

    const config: TreeConfig = {
      width: 600,
      height: 400,
      margin: { top: 20, right: 90, bottom: 30, left: 90 },
    };

    const onNodeClick = vi.fn();
    createD3Tree(element, data, config, 'line', onNodeClick);

    const firstNode = element.querySelectorAll('.node')[1];
    firstNode?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onNodeClick).toHaveBeenCalledWith({ name: 'Child 1' });
    expect(firstNode?.querySelector('rect')?.getAttribute('fill')).toBe(
      '#ffb300',
    );
  });

  it('should deselect the previous node when a new node is clicked', () => {
    const data: TreeNode = {
      name: 'Root',
      children: [{ name: 'Child 1' }, { name: 'Child 2' }],
    };

    const config: TreeConfig = {
      width: 600,
      height: 400,
      margin: { top: 20, right: 90, bottom: 30, left: 90 },
    };

    const onNodeClick = vi.fn();
    createD3Tree(element, data, config, 'line', onNodeClick);

    const firstNode = element.querySelectorAll('.node')[1];
    const secondNode = element.querySelectorAll('.node')[2];

    firstNode?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(firstNode?.querySelector('rect')?.getAttribute('fill')).toBe(
      '#ffb300',
    );

    secondNode?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(firstNode?.querySelector('rect')?.getAttribute('fill')).toBe(
      '#009688',
    );
    expect(secondNode?.querySelector('rect')?.getAttribute('fill')).toBe(
      '#ffb300',
    );
  });
});
