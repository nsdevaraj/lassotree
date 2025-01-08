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

// Colors for different hierarchy levels - from light to dark
const levelColors = [
  '#64B5F6', // Level 0 - Content
  '#2196F3', // Level 1 - Content
  '#1976D2', // Level 2 - Content
  '#1565C0', // Level 3 - Content
  '#0D47A1'  // Level 4 - Content
];

// Title background colors - darker shades
const titleColors = [
  '#1565C0', // Level 0 - Title
  '#0D47A1', // Level 1 - Title
  '#0A367A', // Level 2 - Title
  '#072654', // Level 3 - Title
  '#051B3B'  // Level 4 - Title
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

    const renderTreemap = (paper: Snap.Paper, root: d3.HierarchyRectangularNode<TreemapData>) => {
      tree.each((node) => {
        if (!node.children) {
          // Leaf nodes
          const rect = paper.rect(
            node.x0,
            node.y0,
            node.x1 - node.x0,
            node.y1 - node.y0
          );

          rect.attr({
            fill: levelColors[Math.min(node.depth, levelColors.length - 1)],
            stroke: '#fff',
            strokeWidth: 2,
            cursor: 'pointer'
          });

          // Add value text
          const valueText = paper.text(
            node.x0 + (node.x1 - node.x0) / 2,
            node.y0 + (node.y1 - node.y0) / 2 + 15,
            `${node.value}m`
          ).attr({
            'text-anchor': 'middle',
            'dominant-baseline': 'middle',
            fill: '#fff',
            'font-size': '14px',
            'font-weight': 'normal'
          });

          const text = paper.text(
            node.x0 + (node.x1 - node.x0) / 2,
            node.y0 + (node.y1 - node.y0) / 2 - 10,
            node.data.name
          ).attr({
            'text-anchor': 'middle',
            'dominant-baseline': 'middle',
            fill: '#fff',
            'font-size': '16px',
            'font-weight': 'bold'
          });

          const group = paper.group();
          group.add(rect);
          group.add(text);
          group.add(valueText);

        } else { 
          // Internal nodes (titles)
          const titleHeight = 30; // Reduced height for better proportions
          const titleBg = paper.rect(
            node.x0,
            node.y0,
            node.x1 - node.x0,
            titleHeight
          ).attr({
            fill: titleColors[Math.min(node.depth, titleColors.length - 1)],
            stroke: '#fff',
            strokeWidth: 1
          });

          // Calculate value text
          const valueText = node.value ? ` (${node.value}m)` : '';
          
          // Create title text with better positioning and style
          const title = paper.text(
            node.x0 + 8, // Slight padding from left
            node.y0 + (titleHeight/2),
            node.data.name + valueText
          ).attr({
            'font-size': '12px', // Slightly smaller font
            'font-weight': 'bold',
            'font-family': 'Arial',
            fill: '#ffffff',
            'text-anchor': 'start',
            'dominant-baseline': 'middle',
            'letter-spacing': '0.5px' // Better letter spacing for readability
          });

          // Add subtle text shadow for better contrast
          title.node.style.textShadow = '0px 1px 2px rgba(0,0,0,0.3)';

          const titleGroup = paper.group();
          titleGroup.add(titleBg);
          titleGroup.add(title);
        }
      });
    };

    renderTreemap(paper, root);

    // Add CSS class for lasso cursor
    const lassoStyle = paper.rect(0, 0, width, height).attr({
      fill: 'transparent',
      cursor: 'crosshair'
    });

    // Lasso selection
    let isDrawing = false;
    let lassoPath: Snap.Element | null = null;
    let startPoint = { x: 0, y: 0 };

    const getMousePosition = (e: MouseEvent) => {
      const svgRect = svgRef.current?.getBoundingClientRect();
      return {
        x: e.clientX - (svgRect?.left || 0),
        y: e.clientY - (svgRect?.top || 0)
      };
    };

    paper.mousedown((e) => {
      isDrawing = true;
      startPoint = getMousePosition(e);
      
      if (lassoPath) lassoPath.remove();
      
      lassoPath = paper.rect(startPoint.x, startPoint.y, 0, 0).attr({
        stroke: '#000',
        strokeWidth: 2,
        fill: 'rgba(0,0,0,0.1)',
        'stroke-dasharray': '5,5',
        cursor: 'crosshair'
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
        const lassoBBox = lassoPath.getBBox();

        paper.selectAll('g').forEach((element) => {
          const elementBBox = element.getBBox();
          
          // Check if the element intersects with the lasso rectangle
          const intersects = !(
            elementBBox.x > lassoBBox.x + lassoBBox.width ||
            elementBBox.x + elementBBox.width < lassoBBox.x ||
            elementBBox.y > lassoBBox.y + lassoBBox.height ||
            elementBBox.y + elementBBox.height < lassoBBox.y
          );

          if (intersects) {
            selectedElements.current.add(element);
            element.select('rect').attr({ opacity: 0.7 });
          }
        });

        setTimeout(() => {
          if (lassoPath) lassoPath.remove();
        }, 1000);
      }
    });

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