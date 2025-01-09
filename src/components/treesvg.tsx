import React, { useRef, useEffect, useMemo, useState } from 'react';
import { treemap, hierarchy } from 'd3-hierarchy';

interface TreemapData {
  name: string;
  value?: number;
  children?: TreemapData[];
}

interface TreemapProps {
  data: TreemapData;
  width: number;
  height: number;
  enableMeasure?: boolean;
}

const levelColors = [
  '#64B5F6',
  '#2196F3',
  '#1976D2',
  '#1565C0',
  '#0D47A1',
];

const titleColors = [
  '#1565C0',
  '#0D47A1',
  '#0A367A',
  '#072654',
  '#051B3B',
];

export const Treemap: React.FC<TreemapProps> = ({ data, width = 2000, height = 1400, enableMeasure = false }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const selectedElements = useRef(new WeakSet<SVGGElement>());
  const selectedTitle = useRef(new WeakSet<SVGGElement>());

  const tree = useMemo(() => {
    const treemapLayout = treemap()
      .size([width, height])
      .paddingOuter(1)
      .paddingInner(1)
      .round(true);

    const root = hierarchy(data)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    return treemapLayout(root);
  }, [data, width, height]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    svg.innerHTML = '';

    const renderNode = (node: any, parentGroup: SVGGElement | SVGElement) => {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('class', 'node');

      if (node.children) {
        group.setAttribute('class', 'internal-node');
        group.setAttribute('data-name', node.data.name);

        const titleBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        titleBg.setAttribute('x', node.x0.toString());
        titleBg.setAttribute('y', node.y0.toString());
        titleBg.setAttribute('width', (node.x1 - node.x0).toString());
        titleBg.setAttribute('height', '30');
        titleBg.setAttribute('fill', titleColors[Math.min(node.depth, titleColors.length - 1)]);
        group.appendChild(titleBg);

        const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        title.setAttribute('x', (node.x0 + 8).toString());
        title.setAttribute('y', (node.y0 + 15).toString());
        title.setAttribute('font-size', '12px');
        title.setAttribute('font-weight', 'bold');
        title.textContent = node.data.name + (node.value ? ` (${node.value}m)` : '');
        group.appendChild(title);

        node.children.forEach((child: any) => renderNode(child, group));
      } else {
        group.setAttribute('class', 'leaf-node');
        group.setAttribute('data-name', node.data.name);

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', node.x0.toString());
        rect.setAttribute('y', node.y0.toString());
        rect.setAttribute('width', (node.x1 - node.x0).toString());
        rect.setAttribute('height', (node.y1 - node.y0).toString());
        rect.setAttribute('fill', levelColors[Math.min(node.depth, levelColors.length - 1)]);
        group.appendChild(rect);

        if (enableMeasure) {
          const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          valueText.setAttribute('x', (node.x0 + (node.x1 - node.x0) / 2).toString());
          valueText.setAttribute('y', (node.y0 + (node.y1 - node.y0) / 2 + 15).toString());
          valueText.setAttribute('text-anchor', 'middle');
          valueText.textContent = `${node.value}m`;
          group.appendChild(valueText);
        }

        const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        nameText.setAttribute('x', (node.x0 + (node.x1 - node.x0) / 2).toString());
        nameText.setAttribute('y', (node.y0 + (node.y1 - node.y0) / 2 - 10).toString());
        nameText.setAttribute('text-anchor', 'middle');
        nameText.textContent = node.data.name;
        group.appendChild(nameText);
      }

      group.addEventListener('click', (e: MouseEvent) => {
        e.stopPropagation();
        if (group.classList.contains('leaf-node')) {
          if (selectedElements.current.has(group)) {
            selectedElements.current.delete(group);
            group.style.opacity = '1';
          } else {
            selectedElements.current.add(group);
            group.style.opacity = '0.7';
          }
        } else {
          if (selectedTitle.current.has(group)) {
            selectedTitle.current.delete(group);
            group.style.opacity = '1';
          } else {
            selectedTitle.current.add(group);
            group.style.opacity = '0.7';
          }
        }
      });

      parentGroup.appendChild(group);
    };

    tree.each((node: any) => renderNode(node, svg));
  }, [tree, enableMeasure]);

  return (
    <svg ref={svgRef} width={width} height={height} style={{ border: '1px solid #ccc' }}>
      {/* Lasso selection and other interactions can be added here */}
    </svg>
  );
};

export default Treemap;