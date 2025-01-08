import React, { useEffect, useRef } from "react";
import Snap from "snapsvg-cjs";
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

// Colors for different hierarchy levels - from light to dark
const levelColors = [
  "#64B5F6", // Level 0 - Content
  "#2196F3", // Level 1 - Content
  "#1976D2", // Level 2 - Content
  "#1565C0", // Level 3 - Content
  "#0D47A1", // Level 4 - Content
];

// Title background colors - darker shades
const titleColors = [
  "#1565C0", // Level 0 - Title
  "#0D47A1", // Level 1 - Title
  "#0A367A", // Level 2 - Title
  "#072654", // Level 3 - Title
  "#051B3B", // Level 4 - Title
];

const getMousePosition = (e: MouseEvent, svgElement: SVGSVGElement | null) => {
  const svgRect = svgElement?.getBoundingClientRect();
  return {
    x: e.clientX - (svgRect?.left || 0),
    y: e.clientY - (svgRect?.top || 0),
  };
};

const handleNodeClick = (group: Snap.Element, e: MouseEvent) => {
  e.stopPropagation();
  e.preventDefault();
  
  const currentOpacity = group.attr("opacity");
  const newOpacity = currentOpacity === "0.7" ? 1 : 0.7;

  group.attr({ opacity: newOpacity });
  
  const rect = group.select("rect");
  if (rect) rect.attr({ opacity: newOpacity });
  
  const texts = group.selectAll("text");
  texts.forEach((text: Snap.Element) => {
    text.attr({ opacity: newOpacity });
  });
};

const renderLeafNode = (paper: Snap.Paper, node: any, group: Snap.Element) => {
  const rect = paper.rect(
    node.x0,
    node.y0,
    node.x1 - node.x0,
    node.y1 - node.y0
  );

  rect.attr({
    fill: levelColors[Math.min(node.depth, levelColors.length - 1)],
    stroke: "#fff",
    strokeWidth: 2,
    cursor: "pointer",
  });

  const valueText = paper
    .text(
      node.x0 + (node.x1 - node.x0) / 2,
      node.y0 + (node.y1 - node.y0) / 2 + 15,
      `${node.value}m`
    )
    .attr({
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      fill: "#fff",
      "font-size": "14px",
      "font-weight": "normal",
      "pointer-events": "none",
      "user-select": "none",
    });

  const text = paper
    .text(
      node.x0 + (node.x1 - node.x0) / 2,
      node.y0 + (node.y1 - node.y0) / 2 - 10,
      node.data.name
    )
    .attr({
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      fill: "#fff",
      "font-size": "16px",
      "font-weight": "bold",
      "pointer-events": "none",
      "user-select": "none",
    });

  group.add(rect);
  group.add(text);
  group.add(valueText);
};

const renderInternalNode = (paper: Snap.Paper, node: any, group: Snap.Element) => {
  const titleHeight = 30;
  const titleBg = paper
    .rect(node.x0, node.y0, node.x1 - node.x0, titleHeight)
    .attr({
      fill: titleColors[Math.min(node.depth, titleColors.length - 1)],
      stroke: "#fff",
      strokeWidth: 1,
      cursor: "pointer",
    });

  const valueText = node.value ? ` (${node.value}m)` : "";

  const title = paper
    .text(
      node.x0 + 8,
      node.y0 + titleHeight / 2,
      node.data.name + valueText
    )
    .attr({
      "font-size": "12px",
      "font-weight": "bold",
      "font-family": "Arial",
      fill: "#ffffff",
      "text-anchor": "start",
      "dominant-baseline": "middle",
      "letter-spacing": "0.5px",
      "pointer-events": "none",
    });

  title.node.style.textShadow = "0px 1px 2px rgba(0,0,0,0.3)";

  group.add(titleBg);
  group.add(title);
};

const setupLassoSelection = (paper: Snap.Paper, svgRef: React.RefObject<SVGSVGElement>, selectedElements: React.MutableRefObject<Set<Snap.Element>>) => {
  let isDrawing = false;
  let lassoPath: Snap.Element | null = null;
  let startPoint = { x: 0, y: 0 };

  paper.mousedown((e: MouseEvent) => {
    isDrawing = true;
    startPoint = getMousePosition(e, svgRef.current);

    if (lassoPath) lassoPath.remove();

    lassoPath = paper.rect(startPoint.x, startPoint.y, 0, 0).attr({
      stroke: "#000",
      strokeWidth: 2,
      fill: "rgba(0,0,0,0.1)",
      "stroke-dasharray": "5,5",
      cursor: "crosshair",
    });
  });

  paper.mousemove((e: MouseEvent) => {
    if (!isDrawing || !lassoPath) return;
    const currentPoint = getMousePosition(e, svgRef.current);

    const width = currentPoint.x - startPoint.x;
    const height = currentPoint.y - startPoint.y;

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

      paper.selectAll("g").forEach((element: Snap.Element) => {
        const elementBBox = element.getBBox();
        const intersects = !(
          elementBBox.x > lassoBBox.x + lassoBBox.width ||
          elementBBox.x + elementBBox.width < lassoBBox.x ||
          elementBBox.y > lassoBBox.y + lassoBBox.height ||
          elementBBox.y + elementBBox.height < lassoBBox.y
        );

        if (intersects) {
          selectedElements.current.add(element);
          element.select("rect").attr({ opacity: 0.7 });
        }
      });

      setTimeout(() => {
        if (lassoPath) lassoPath.remove();
      }, 1000);
    }
  });
};

const renderTreemap = (paper: Snap.Paper, tree: any) => {
  tree.each((node: any) => {
    const group = paper.group();
    const groupId = `node-${node.data.name}-${node.value}`;
    group.attr({ "data-id": groupId });

    if (!node.children) {
      renderLeafNode(paper, node, group);
    } else {
      renderInternalNode(paper, node, group);
    }

    group.click((e: MouseEvent) => handleNodeClick(group, e));
  });
};

export const Treemap: React.FC<TreemapProps> = ({
  data,
  width = 2000,
  height = 1400,
}) => {
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
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const tree = treemapLayout(root);

    renderTreemap(paper, tree);
    setupLassoSelection(paper, svgRef, selectedElements);
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
