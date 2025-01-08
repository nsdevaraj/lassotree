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

const handleNodeClick = (group: Snap.Element, e: MouseEvent, selectedElements: React.MutableRefObject<Set<Snap.Element>>) => {
  e.stopPropagation();
  e.preventDefault();
  const isSelected = selectedElements.current.has(group);

  const currentOpacity = group.attr("opacity");
  let newOpacity;
  console.log(currentOpacity, isSelected);
  if (currentOpacity === "0.7") {
    selectedElements.current.delete(group);
    newOpacity = 1;
  }else{
    selectedElements.current.add(group);
    newOpacity=0.7;
  } 
  group.attr({ opacity: newOpacity });
  const rect = group.select("rect");
  if (rect) rect.attr({ opacity: newOpacity });
  const texts = group.selectAll("text");
  texts.forEach((text: Snap.Element) => {
    text.attr({ opacity: newOpacity });
  });
};
 
const renderLeafNode = (
  paper: Snap.Paper,
  node: any,
  group: Snap.Element,
  selectedElements: React.MutableRefObject<Set<Snap.Element>>
) => {
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
    cursor: "cell",
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
      "class": "unselectable"
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
      "class": "unselectable"
    });

  group.add(rect);
  group.add(text);
  group.add(valueText);
  
  group.click((e: MouseEvent) => handleNodeClick(group, e, selectedElements));
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
      "class": "unselectable"
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
      "class": "unselectable"
    });

  title.node.style.textShadow = "0px 1px 2px rgba(0,0,0,0.3)";
  // group.data("nodeData", node);
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
 
const renderTreemap = (
  paper: Snap.Paper,
  tree: any,
  selectedElements: React.MutableRefObject<Set<Snap.Element>>
) => {
  const traverse = (node: any) => {
    const group = paper.group();

    if (!node.children) {
      renderLeafNode(paper, node, group, selectedElements);
    } else {
      renderInternalNode(paper, node, group);
      node.children.forEach((child: any) => {
        traverse(child);
      });
    }
  };

  traverse(tree);
};

export const Treemap: React.FC<TreemapProps> = ({
  data,
  width = 2000,
  height = 1400,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const selectedElements = useRef<Set<Snap.Element>>(new Set());

  useEffect(() => {
    if (!svgRef.current) return;

    const paper = Snap(svgRef.current);
    paper.clear();

    const treemapLayout = treemap()
    .size([width, height])
    .paddingOuter(1)      // Increase outer padding
    .paddingTop(25)       // Increase top padding for title
    .paddingInner(1)      // Increase inner padding between nodes
    .round(true);
    const root = hierarchy(data)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const tree = treemapLayout(root);

    renderTreemap(paper, tree, selectedElements);
    setupLassoSelection(paper, svgRef, selectedElements);

  }, [data, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ border: "1px solid #ccc" }}
    />
  );
};
