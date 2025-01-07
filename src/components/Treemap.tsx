import React, { useEffect, useRef } from 'react';
import Snap from 'snapsvg-cjs';
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
}

const colors = [
  '#2196F3', '#4CAF50', '#FFC107', '#E91E63',
  '#9C27B0', '#00BCD4', '#F44336', '#3F51B5',
  '#FF9800', '#795548', '#009688', '#673AB7'
];

export const Treemap: React.FC<TreemapProps> = ({ data, width = 1000, height = 700 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const snapRef = useRef<Snap.Paper | null>(null);
  const selectedElements = useRef<Set<Snap.Element>>(new Set());

  useEffect(() => {
    if (!svgRef.current) return;

    snapRef.current = Snap(svgRef.current);
    const paper = snapRef.current;
    paper.clear();

    const treemapLayout = treemap<TreemapData>()
      .size([width, height])
      .paddingTop(20)
      .paddingRight(2)
      .paddingBottom(2)
      .paddingLeft(2)
      .round(true);

    const root = hierarchy(data)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const tree = treemapLayout(root);

    // Draw all nodes including internal nodes
    tree.each((node) => {
      if (!node.children) {
        // Leaf nodes
        const rect = paper.rect(
          node.x0,
          node.y0,
          node.x1 - node.x0,
          node.y1 - node.y0
        );

        const depth = node.depth;
        rect.attr({
          fill: colors[depth % colors.length],
          stroke: '#fff',
          strokeWidth: 1,
          cursor: 'pointer'
        });

        // Get full hierarchy path
        const path = [];
        let current = node;
        while (current.parent) {
          path.unshift(current.data.name);
          current = current.parent;
        }
        path.unshift(current.data.name);

        // Add text label
        const text = paper.text(
          node.x0 + (node.x1 - node.x0) / 2,
          node.y0 + (node.y1 - node.y0) / 2,
          node.data.name
        );

        text.attr({
          'text-anchor': 'middle',
          'dominant-baseline': 'middle',
          fill: '#fff',
          'font-size': '12px'
        });

        // Create group
        const group = paper.group();
        group.add(rect);
        group.add(text);

        // Add title on hover
        const title = paper.text(
          node.x0 + 5,
          node.y0 + 15,
          path.join(' > ')
        ).attr({
          'font-size': '10px',
          fill: '#fff',
          opacity: 0
        });

        group.hover(
          () => title.attr({ opacity: 1 }),
          () => title.attr({ opacity: 0 })
        );

        group.click(() => {
          if (selectedElements.current.has(group)) {
            selectedElements.current.delete(group);
            rect.attr({ opacity: 1 });
          } else {
            selectedElements.current.add(group);
            rect.attr({ opacity: 0.7 });
          }
        });
      } else {
        // Internal nodes - add titles
        paper.text(
          node.x0,
          node.y0 + 15,
          node.data.name
        ).attr({
          'font-size': '14px',
          'font-weight': 'bold',
          fill: '#333'
        });
      }
    });

    // Lasso selection
    let isDrawing = false;
    let lassoPath: Snap.Element | null = null;
    let startPoint = { x: 0, y: 0 };

    paper.mousedown((e) => {
      isDrawing = true;
      startPoint = getMousePosition(e);
      
      if (lassoPath) lassoPath.remove();
      
      lassoPath = paper.rect(startPoint.x, startPoint.y, 0, 0).attr({
        stroke: '#000',
        strokeWidth: 2,
        fill: 'rgba(0,0,0,0.1)',
        'stroke-dasharray': '5,5'
      });
    });

    paper.mousemove((e) => {
      if (!isDrawing || !lassoPath) return;
      const currentPoint = getMousePosition(e);
      
      // Calculate rectangle dimensions
      const width = currentPoint.x - startPoint.x;
      const height = currentPoint.y - startPoint.y;
      
      // Update rectangle position and size
      if (width >= 0) {
        lassoPath.attr({ x: startPoint.x, width });
      } else {
        lassoPath.attr({ x: currentPoint.x, width: Math.abs(width) });
      }
      
      if (height >= 0) {
        lassoPath.attr({ y: startPoint.y, height });
      } else {
        lassoPath.attr({ y: currentPoint.y, height: Math.abs(height) });
      }
    });

    paper.mouseup(() => {
      isDrawing = false;
      if (lassoPath) {
        const bbox = lassoPath.getBBox();

        paper.selectAll('g').forEach((element) => {
          const elementBBox = element.getBBox();
          const center = {
            x: elementBBox.cx,
            y: elementBBox.cy
          };

          if (center.x >= bbox.x && 
              center.x <= bbox.x + bbox.width &&
              center.y >= bbox.y && 
              center.y <= bbox.y + bbox.height) {
            selectedElements.current.add(element);
            element.select('rect').attr({ opacity: 0.7 });
          }
        });

        setTimeout(() => {
          if (lassoPath) lassoPath.remove();
        }, 1000);
      }
    });

    function getMousePosition(event: MouseEvent) {
      const rect = svgRef.current?.getBoundingClientRect();
      return {
        x: event.clientX - (rect?.left || 0),
        y: event.clientY - (rect?.top || 0)
      };
    }

  }, [data, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="border border-gray-200 rounded-lg shadow-lg"
    />
  );
};