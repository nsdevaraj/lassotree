import React, { useEffect, useRef, useState } from 'react';
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
// Colors for different hierarchy levels - from light to dark
const levelColors = [
    '#64B5F6', // Level 0 - Content
    '#2196F3', // Level 1 - Content
    '#1976D2', // Level 2 - Content
    '#1565C0', // Level 3 - Content
    '#0D47A1', // Level 4 - Content
];
// Title background colors - darker shades
const titleColors = [
    '#1565C0', // Level 0 - Title
    '#0D47A1', // Level 1 - Title
    '#0A367A', // Level 2 - Title
    '#072654', // Level 3 - Title
    '#051B3B', // Level 4 - Title
];
const getMousePosition = (e: MouseEvent, svgElement: SVGSVGElement | null) => {
    const svgRect = svgElement?.getBoundingClientRect();
    return {
        x: e.clientX - (svgRect?.left || 0),
        y: e.clientY - (svgRect?.top || 0),
    };
};
const handleNodeClick = (
    group: Snap.Element,
    e: MouseEvent,
    selectedElements: React.MutableRefObject<Set<Snap.Element>>,
) => {
    e.stopPropagation();
    e.preventDefault();
    const isSelected = selectedElements.current.has(group);
    let newOpacity;
    if (isSelected) {
        selectedElements.current.delete(group);
        newOpacity = 1;
    } else {
        selectedElements.current.add(group);
        newOpacity = 0.7;
    }
    group.attr({ opacity: newOpacity });
    const rect = group.select('rect');
    if (rect) rect.attr({ opacity: newOpacity });
    const texts = group.selectAll('text');
    texts.forEach((text: Snap.Element) => {
        text.attr({ opacity: newOpacity });
    });
};

const handleTitleClick = (
    group: Snap.Element,
    e: MouseEvent,
    selectedTitle: React.MutableRefObject<Set<Snap.Element>>,
    selectedElements: React.MutableRefObject<Set<Snap.Element>>,
) => {
    e.stopPropagation();
    e.preventDefault();

    const node = group.node.associatedNode;
    node.group = group;
    const isSelected = selectedTitle.current.has(group);
    let newOpacity;
    if (isSelected) {
        selectedTitle.current.delete(group);
        newOpacity = 1;
        if (node && node.children) {
            traverseChilds(node, false, selectedElements.current);
        }
        if (node && node.siblings) {
            node.siblings.forEach((sibling: any) => {
                const siblingGroup = sibling.group;
                if (siblingGroup) {
                    siblingGroup.attr({ opacity: 1 });
                }
            });
        }
    } else {
        selectedTitle.current.add(group);
        newOpacity = 0.7;
        if (node && node.children) {
            traverseChilds(node, true, selectedElements.current);
        }
        if (node && node.siblings) {
            node.siblings.forEach((sibling: any) => {
                const siblingGroup = sibling.group;
                if (siblingGroup) {
                    siblingGroup.attr({ opacity: 0 });
                }
            });
        }
    }
    group.attr({ opacity: newOpacity });
    const rect = group.select('rect');
    if (rect) rect.attr({ opacity: newOpacity });
    const texts = group.selectAll('text');
    texts.forEach((text: Snap.Element) => {
        text.attr({ opacity: newOpacity });
    });
};
const renderLeafNode = (
    paper: Snap.Paper,
    node: any,
    group: Snap.Element,
    selectedElements: React.MutableRefObject<Set<Snap.Element>>,
) => {
    group.node.associatedNode = node;
    node.group = group;
    const rect = paper.rect(node.x0, node.y0, node.x1 - node.x0, node.y1 - node.y0);
    rect.attr({
        fill: levelColors[Math.min(node.depth, levelColors.length - 1)],
        stroke: '#fff',
        strokeWidth: 2,
        cursor: 'cell',
    });
    const valueText = paper
        .text(
            node.x0 + (node.x1 - node.x0) / 2,
            node.y0 + (node.y1 - node.y0) / 2 + 15,
            `${node.value}m`
        )
        .attr({
            'text-anchor': 'middle',
            'dominant-baseline': 'middle',
            fill: '#fff',
            'font-size': '14px',
            'font-weight': 'normal',
            'pointer-events': 'none',
            'user-select': 'none',
            class: 'unselectable',
        });
    const text = paper
        .text(node.x0 + (node.x1 - node.x0) / 2, node.y0 + (node.y1 - node.y0) / 2 - 10, node.data.name)
        .attr({
            'text-anchor': 'middle',
            'dominant-baseline': 'middle',
            fill: '#fff',
            'font-size': '16px',
            'font-weight': 'bold',
            'pointer-events': 'none',
            'user-select': 'none',
            class: 'unselectable',
        });
    group.add(rect);
    group.add(text);
    group.add(valueText);
    group.addClass('leaf-node');
    group.click((e: MouseEvent) => handleNodeClick(group, e, selectedElements));
};
const renderInternalNode = (paper: Snap.Paper, node: any, group: Snap.Element, selectedTitle: React.MutableRefObject<Set<Snap.Element>>, selectedElements: React.MutableRefObject<Set<Snap.Element>>) => {
    const titleHeight = 30; 
    const childs: any[] = [];
    if (node.children) {
        for (const child of node.children) {
            if (!child.children) {
                childs.push(child);
            }
        }
    }
    node.childs = childs;

    const siblings: any[] = [];
    if (node.parent?.children?.length) {
        for (const child of node.parent.children) {
            if (child.data.name !== node.data.name) {
                siblings.push(child);
            }
        }
    }
    node.siblings = siblings;
    // Associate the node with the group
    group.node.associatedNode = node;
    node.group = group;

    const titleBg = paper.rect(node.x0, node.y0, node.x1 - node.x0, titleHeight).attr({
        fill: titleColors[Math.min(node.depth, titleColors.length - 1)],
        stroke: '#fff',
        strokeWidth: 1,
        cursor: 'pointer',
        class: 'unselectable',
    });
    const valueText = node.value ? ` (${node.value}m)` : '';
    const title = paper.text(node.x0 + 8, node.y0 + titleHeight / 2, node.data.name + valueText).attr({
        'font-size': '12px',
        'font-weight': 'bold',
        'font-family': 'Arial',
        fill: '#ffffff',
        'text-anchor': 'start',
        'dominant-baseline': 'middle',
        'letter-spacing': '0.5px',
        'pointer-events': 'none',
        class: 'unselectable',
    });
    title.node.style.textShadow = '0px 1px 2px rgba(0,0,0,0.3)';
    group.add(titleBg);
    group.add(title);
    group.click((e: MouseEvent) => handleTitleClick(group, e, selectedTitle, selectedElements));
};
const setupLassoSelection = (
    paper: Snap.Paper,
    svgRef: React.RefObject<SVGSVGElement>,
    selectedElements: React.MutableRefObject<Set<Snap.Element>>,
) => {
    let isDrawing = false;
    let isDragging = false;
    let lassoPath: Snap.Element | null = null;
    let startPoint = { x: 0, y: 0 };
    paper.mousedown((e: MouseEvent) => {
        isDrawing = true;
        startPoint = getMousePosition(e, svgRef.current);
        if (lassoPath) lassoPath.remove();
        lassoPath = paper.rect(startPoint.x, startPoint.y, 0, 0).attr({
            stroke: '#000',
            strokeWidth: 2,
            fill: 'rgba(0,0,0,0.1)',
            'stroke-dasharray': '5,5',
            cursor: 'crosshair',
        });
    });
    paper.mousemove((e: MouseEvent) => {
        if (!isDrawing || !lassoPath) return;
        isDragging = true;
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
        if (!isDragging) return;
        isDragging = false;
        if (lassoPath) {
            const lassoBBox = lassoPath.getBBox();
            paper.selectAll('g').forEach((element: Snap.Element) => {
                const elementBBox = element.getBBox();
                const intersects = !(
                    elementBBox.x > lassoBBox.x + lassoBBox.width ||
                    elementBBox.x + elementBBox.width < lassoBBox.x ||
                    elementBBox.y > lassoBBox.y + lassoBBox.height ||
                    elementBBox.y + elementBBox.height < lassoBBox.y
                );
                if (intersects) {
                    if (element.hasClass('leaf-node')) {
                        // if (selectedElements.current.has(element)) {
                        //     selectedElements.current.delete(element);
                        //     element.select('rect').attr({ opacity: 1 });
                        // } else {
                            selectedElements.current.add(element);
                            element.select('rect').attr({ opacity: 0.7 });
                        //}
                    }
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
    selectedElements: React.MutableRefObject<Set<Snap.Element>>,
    selectedTitle: React.MutableRefObject<Set<Snap.Element>>,
) => {
    const traverse = (node: any) => {
        const group = paper.group();
        if (!node.children) {
            renderLeafNode(paper, node, group, selectedElements);
        } else {
            renderInternalNode(paper, node, group, selectedTitle, selectedElements);
            node.children.forEach((child: any) => {
                traverse(child);
            });
        }
    };
    traverse(tree);
};
const traverseChilds = (node: any, selected: boolean = false, selectedElement: Snap.Element) => {
    // If the node has children, traverse through them
    if (node.children) {
        node.children.forEach((child: any) => {
            // Recursively traverse child's children
            traverseChilds(child, selected, selectedElement);
        });
    }

    // If the node has direct leaf children (childs), modify their opacity
    if (node.childs) {
        node.childs.forEach((leafChild: any) => {
            if (leafChild.group) {
                if (selected) {
                    // const isSelected = selectedElements.current.has(leafChild.group);
                    leafChild.group.select('rect').attr({ opacity: 0.7 });
                    selectedElement.add(leafChild.group);
                } else {
                    leafChild.group.select('rect').attr({ opacity: 1 });
                    selectedElement.delete(leafChild.group);
                }
            }
        });
    }
};
export const Treemap: React.FC<TreemapProps> = ({ data, width = 2000, height = 1400 }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const paperRef = useRef(null);
    const selectedElements = useRef<Set<Snap.Element>>(new Set());
    const selectedTitle = useRef<Set<Snap.Element>>(new Set());
    // const [data, setData] = useState<TreemapData>(TreeMapUtils.getTreeMapData());
    useEffect(() => {
        if (!svgRef.current) return;
        paperRef.current = Snap(svgRef.current);
        paperRef.current.clear();
        const treemapLayout = treemap()
            .size([width, height])
            .paddingOuter(1) // Increase outer padding
            .paddingTop(25) // Increase top padding for title
            .paddingInner(1) // Increase inner padding between nodes
            .round(true);
        const root = hierarchy(data)
            .sum((d) => d.value || 0)
            .sort((a, b) => (b.value || 0) - (a.value || 0));
        const tree = treemapLayout(root);
        renderTreemap(paperRef.current, tree, selectedElements, selectedTitle);
        setupLassoSelection(paperRef.current, svgRef, selectedElements);
    }, [data, width, height]);
    useEffect(() => {
        return () => {
            paperRef.current?.clear();
            selectedElements.current.clear();
        };
    }, []);
    return <svg ref={svgRef} width={width} height={height} style={{ border: '1px solid #ccc' }} />;
};
