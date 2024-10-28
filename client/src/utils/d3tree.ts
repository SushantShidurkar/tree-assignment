import * as d3 from 'd3';
import { useDataStore } from '@/stores';
import type { HierarchyPointNode } from 'd3';
import type{ TreeNode, TreeConfig } from '@/models/model';

export function createD3Tree(
  element: HTMLElement,
  data: TreeNode,
  config: TreeConfig,
  linkType: 'line' | 'path',
  onNodeClick: (nodeData: TreeNode) => void,
) {
  const dataStore = useDataStore();
  const { width, height, margin } = config;
  let lastSelectedNode: SVGGElement | null = null;

  d3.select(element).selectAll('*').remove();
  const svg = d3
    .select(element)
    .append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const treeLayout = d3.tree<TreeNode>().size([height, width]);

  const root = d3.hierarchy<TreeNode>(data);

  const nodes = treeLayout(root);

  const links = svg.selectAll('.link').data(nodes.links()).enter();

  if (linkType === 'line') {
    links
      .append('line')
      .attr('class', 'link')
      .attr('x1', (d) => d.source.y)
      .attr('y1', (d) => d.source.x)
      .attr('x2', (d) => d.target.y)
      .attr('y2', (d) => d.target.x)
      .style('fill', 'none')
      .style('stroke', '#b0bec5')
      .style('stroke-width', 1.5);
  } else if (linkType === 'path') {
    links
      .append('path')
      .attr('class', 'link')
      .attr('d', (d) => {
        const sourceX = d.source.x;
        const sourceY = d.source.y;
        const targetX = d.target.x;
        const targetY = d.target.y;
        return `M ${sourceY},${sourceX} C ${(sourceY + targetY) / 2},${sourceX} ${(sourceY + targetY) / 2},${targetX} ${targetY},${targetX}`;
      })
      .style('fill', 'none')
      .style('stroke', '#b0bec5')
      .style('stroke-width', 1.5);
  }

  const node = svg
    .selectAll('.node')
    .data(nodes.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', (d) => `translate(${d.y},${d.x})`)
    .style('cursor', 'pointer');

  node
    .append('text')
    .attr('dy', '0.35em')
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('font-weight', 'bold')
    .style('fill', '#ffffff')
    .text((d) => d.data.name);

  node
    .append('rect')
    .attr('width', function () {
      const textElement = this.parentNode?.querySelector(
        'text',
      ) as SVGTextElement | null;
      const textWidth = textElement ? textElement.getBBox().width : 0;
      return textWidth + 20;
    })
    .attr('height', 30)
    .attr('x', function () {
      const textElement = this.parentNode?.querySelector(
        'text',
      ) as SVGTextElement | null;
      const textWidth = textElement ? textElement.getBBox().width : 0;
      return -textWidth / 2 - 10;
    })
    .attr('y', -15)
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('fill', (d) => (d.children ? '#00796b' : '#009688'))
    .attr('stroke', '#004d40')
    .style('stroke-width', '1.5px');

  node.selectAll('rect').lower();

  node.on('click', (event, d) => {
    deSelectNode();
    d3.select(event.currentTarget).select('rect').attr('fill', '#ffb300');
    lastSelectedNode = event.currentTarget as SVGGElement;
    dataStore.setSelectedNode(d.data);
    onNodeClick(d.data);
  });

  const deSelectNode = () => {
    if (lastSelectedNode) {
      const lastNodeData = d3
        .select(lastSelectedNode)
        .data()[0] as HierarchyPointNode<TreeNode>;
      const fillColor = lastNodeData.children ? '#00796b' : '#009688';
      d3.select(lastSelectedNode).select('rect').attr('fill', fillColor);
    }
  };

  return {
    deSelectNode,
  };
}
