/**
 * AI Data Visualization Utilities for Structural Engineering
 * 
 * This module provides specialized visualization tools for AI model outputs
 * in structural engineering contexts, including stress maps, displacement
 * visualizations, and structural health monitoring dashboards.
 */

import * as d3 from 'd3';
import * as THREE from 'three';
import { Chart, registerables } from 'chart.js';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';

// Register Chart.js components
Chart.register(...registerables);

/**
 * Color scales for visualizations
 */
export const ColorScales = {
  // Blue to red (cool to hot)
  THERMAL: [
    '#313695', '#4575b4', '#74add1', '#abd9e9',
    '#e0f3f8', '#ffffbf', '#fee090', '#fdae61',
    '#f46d43', '#d73027', '#a50026'
  ],
  
  // Green to red (safe to dangerous)
  SAFETY: [
    '#1a9850', '#66bd63', '#a6d96a', '#d9ef8b',
    '#ffffbf', '#fee08b', '#fdae61', '#f46d43',
    '#d73027', '#a50026'
  ],
  
  // Damage visualization
  DAMAGE: [
    '#ffffcc', '#ffeda0', '#fed976', '#feb24c',
    '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026',
    '#800026'
  ],
  
  // Displacement
  DISPLACEMENT: [
    '#3b4cc0', '#688aef', '#99baff', '#c9d8ef',
    '#edd1c2', '#f7a789', '#e36a53', '#b40426'
  ]
};

/**
 * Creates a color interpolator function from a color scale
 * @param {string[]} colors Array of color strings
 * @returns {Function} Function that maps values in [0,1] to colors
 */
export function createColorInterpolator(colors) {
  return d3.scaleLinear()
    .domain(colors.map((_, i) => i / (colors.length - 1)))
    .range(colors)
    .interpolate(d3.interpolateRgb);
}

/**
 * Apply color mapping to a mesh based on vertex data
 * @param {THREE.Mesh} mesh The mesh to colorize
 * @param {number[]} data Data values for each vertex
 * @param {string[]} colorScale Color scale to use
 * @param {Object} options Additional options
 * @returns {THREE.Mesh} The colorized mesh
 */
export function applyVertexColors(mesh, data, colorScale = ColorScales.THERMAL, options = {}) {
  const {
    minValue = Math.min(...data),
    maxValue = Math.max(...data),
    opacity = 1.0
  } = options;
  
  // Create color interpolator
  const interpolateColor = createColorInterpolator(colorScale);
  
  // Get geometry
  const geometry = mesh.geometry;
  
  // Create vertex colors array
  const colors = [];
  
  // For each vertex, calculate color
  for (let i = 0; i < data.length; i++) {
    // Normalize value to 0-1 range
    const normalizedValue = (data[i] - minValue) / (maxValue - minValue);
    
    // Get color
    const color = new THREE.Color(interpolateColor(normalizedValue));
    
    // Add to colors array
    colors.push(color.r, color.g, color.b);
  }
  
  // Add colors to geometry
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  
  // Update material to use vertex colors
  if (mesh.material) {
    mesh.material.vertexColors = true;
    mesh.material.needsUpdate = true;
    
    if (opacity < 1.0) {
      mesh.material.transparent = true;
      mesh.material.opacity = opacity;
    }
  }
  
  return mesh;
}

/**
 * Create a stress visualization on a THREE.js mesh
 * @param {THREE.Mesh} mesh Base mesh to visualize stress on
 * @param {Array} stressData Stress values (one per vertex or face)
 * @param {Object} options Visualization options
 * @returns {THREE.Group} Group containing the visualization
 */
export function createStressVisualization(mesh, stressData, options = {}) {
  const {
    colorScale = ColorScales.THERMAL,
    scale = 1.0,
    showLegend = true,
    perVertex = true,
    maxDisplacement = 0.1,
    name = 'Stress Visualization'
  } = options;
  
  // Create a group to hold visualization objects
  const group = new THREE.Group();
  group.name = name;
  
  // Clone the original mesh
  const visualMesh = mesh.clone();
  
  // Apply colors based on stress data
  applyVertexColors(visualMesh, stressData, colorScale, {
    opacity: 0.9
  });
  
  // Apply displacement based on stress and normals
  if (maxDisplacement > 0 && perVertex) {
    const geometry = visualMesh.geometry;
    const positions = geometry.attributes.position.array;
    const normals = geometry.attributes.normal.array;
    
    // Clone original positions for reference
    const originalPositions = positions.slice();
    
    // For each vertex, displace along normal based on stress
    for (let i = 0; i < stressData.length; i++) {
      const normalizedStress = (stressData[i] - Math.min(...stressData)) / 
                               (Math.max(...stressData) - Math.min(...stressData));
      
      const displacement = normalizedStress * maxDisplacement * scale;
      
      // Vertex components are in triplets (x,y,z)
      const idx = i * 3;
      
      // Apply displacement along normal
      positions[idx] = originalPositions[idx] + normals[idx] * displacement;
      positions[idx + 1] = originalPositions[idx + 1] + normals[idx + 1] * displacement;
      positions[idx + 2] = originalPositions[idx + 2] + normals[idx + 2] * displacement; 
    }
    
    // Update geometry
    geometry.attributes.position.needsUpdate = true;
    geometry.computeBoundingSphere();
  }
  
  // Add to group
  group.add(visualMesh);
  
  // Add normals visualization for debug
  if (options.showNormals) {
    const normalsHelper = new VertexNormalsHelper(visualMesh, 0.05, 0x0000ff);
    group.add(normalsHelper);
  }
  
  // Add a legend if requested
  if (showLegend) {
    const legend = createColorLegend(colorScale, {
      title: options.title || 'Stress (MPa)',
      min: Math.min(...stressData),
      max: Math.max(...stressData)
    });
    
    // Position legend to the side
    legend.position.set(mesh.geometry.boundingSphere.radius * 1.5, 0, 0);
    group.add(legend);
  }
  
  return group;
}

/**
 * Create a 3D color legend
 * @param {string[]} colorScale Color scale to use
 * @param {Object} options Legend options
 * @returns {THREE.Group} Legend mesh group
 */
export function createColorLegend(colorScale, options = {}) {
  const {
    width = 0.1,
    height = 1.0,
    depth = 0.01,
    title = 'Value',
    min = 0,
    max = 1,
    segments = 20
  } = options;
  
  const group = new THREE.Group();
  group.name = 'Color Legend';
  
  // Create a colored bar
  const barGeometry = new THREE.BoxGeometry(width, height, depth, 1, segments, 1);
  const barMaterial = new THREE.MeshBasicMaterial({
    vertexColors: true
  });
  
  // Create colors for each segment
  const colors = [];
  const interpolateColor = createColorInterpolator(colorScale);
  
  // Vertex ordering in BoxGeometry is complex - we need to handle it carefully
  for (let i = 0; i < segments + 1; i++) {
    // Calculate normalized position (bottom to top)
    const t = i / segments;
    const color = new THREE.Color(interpolateColor(1 - t)); // Reverse so min at bottom
    
    // Each horizontal slice has 4 vertices
    for (let j = 0; j < 4; j++) {
      colors.push(color.r, color.g, color.b);
    }
  }
  
  // Add colors to geometry
  barGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  
  // Create and add mesh
  const barMesh = new THREE.Mesh(barGeometry, barMaterial);
  group.add(barMesh);
  
  // Optional: add text labels
  // Note: In practice, you would use a library like troika-three-text
  // Here we're using simple planes with textures as a placeholder
  
  return group;
}

/**
 * Create a bar chart visualization
 * @param {string} containerId DOM element ID for the chart
 * @param {Object} data Chart data
 * @param {Object} options Chart options
 * @returns {Chart} Chart.js instance
 */
export function createBarChart(containerId, data, options = {}) {
  const canvas = document.getElementById(containerId);
  
  if (!canvas) {
    console.error(`Container element with ID "${containerId}" not found`);
    return null;
  }
  
  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: data.title || 'Values',
          data: data.values,
          backgroundColor: options.colors || getGradientColors(data.values, ColorScales.THERMAL)
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: options.beginAtZero !== false,
          title: {
            display: true,
            text: options.yAxisLabel || ''
          }
        },
        x: {
          title: {
            display: true,
            text: options.xAxisLabel || ''
          }
        }
      },
      plugins: {
        title: {
          display: !!options.title,
          text: options.title || ''
        },
        legend: {
          display: options.showLegend !== false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += options.formatValue 
                  ? options.formatValue(context.parsed.y) 
                  : context.parsed.y;
              }
              return label;
            }
          }
        }
      }
    }
  });
  
  return chart;
}

/**
 * Create a heatmap visualization
 * @param {string} containerId DOM element ID for the heatmap
 * @param {Array} data 2D array of values
 * @param {Object} options Heatmap options
 */
export function createHeatmap(containerId, data, options = {}) {
  const {
    colorScale = ColorScales.THERMAL,
    width = 800,
    height = 600,
    margin = { top: 30, right: 30, bottom: 50, left: 50 },
    xLabels = [],
    yLabels = [],
    title = 'Heatmap'
  } = options;
  
  // Get container
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container element with ID "${containerId}" not found`);
    return;
  }
  
  // Clear container
  container.innerHTML = '';
  
  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  // Calculate dimensions
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Create group for the heatmap
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  // Determine data extents
  const dataFlat = data.flat();
  const minValue = options.minValue !== undefined ? options.minValue : Math.min(...dataFlat);
  const maxValue = options.maxValue !== undefined ? options.maxValue : Math.max(...dataFlat);
  
  // Create color scale
  const colorInterpolator = createColorInterpolator(colorScale);
  const color = d3.scaleSequential()
    .domain([minValue, maxValue])
    .interpolator((t) => colorInterpolator(t));
  
  // Create scales
  const xScale = d3.scaleBand()
    .domain(xLabels.length ? xLabels : d3.range(data[0].length))
    .range([0, innerWidth])
    .padding(0.05);
  
  const yScale = d3.scaleBand()
    .domain(yLabels.length ? yLabels : d3.range(data.length))
    .range([0, innerHeight])
    .padding(0.05);
  
  // Draw heatmap cells
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      const value = data[y][x];
      
      g.append('rect')
        .attr('x', xScale(xLabels[x] || x))
        .attr('y', yScale(yLabels[y] || y))
        .attr('width', xScale.bandwidth())
        .attr('height', yScale.bandwidth())
        .attr('fill', color(value))
        .attr('stroke', '#ccc')
        .attr('stroke-width', 0.5)
        .on('mouseover', function() {
          d3.select(this)
            .attr('stroke', '#333')
            .attr('stroke-width', 2);
          
          // Show tooltip
          if (options.showTooltip !== false) {
            const tooltip = g.append('g')
              .attr('class', 'tooltip');
            
            tooltip.append('rect')
              .attr('x', xScale(xLabels[x] || x) + xScale.bandwidth() / 2)
              .attr('y', yScale(yLabels[y] || y) - 30)
              .attr('width', 80)
              .attr('height', 25)
              .attr('fill', '#fff')
              .attr('stroke', '#333')
              .attr('stroke-width', 1)
              .attr('rx', 5);
            
            tooltip.append('text')
              .attr('x', xScale(xLabels[x] || x) + xScale.bandwidth() / 2 + 40)
              .attr('y', yScale(yLabels[y] || y) - 15)
              .attr('text-anchor', 'middle')
              .attr('font-size', '12px')
              .text(options.formatValue ? options.formatValue(value) : value.toFixed(2));
          }
        })
        .on('mouseout', function() {
          d3.select(this)
            .attr('stroke', '#ccc')
            .attr('stroke-width', 0.5);
          
          g.selectAll('.tooltip').remove();
        });
    }
  }
  
  // Add axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  g.append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(xAxis)
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end');
  
  g.append('g')
    .call(yAxis);
  
  // Add title
  if (title) {
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(title);
  }
  
  // Add color legend
  if (options.showLegend !== false) {
    const legendWidth = 20;
    const legendHeight = innerHeight * 0.8;
    
    const legendScale = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range([legendHeight, 0]);
    
    const legendAxis = d3.axisRight(legendScale)
      .tickFormat(options.formatValue || d3.format('.2f'));
    
    const legend = svg.append('g')
      .attr('transform', `translate(${width - margin.right + 10}, ${margin.top})`);
    
    // Create gradient for legend
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', `heatmap-gradient-${containerId}`)
      .attr('x1', '0%')
      .attr('y1', '100%')
      .attr('x2', '0%')
      .attr('y2', '0%');
    
    // Add color stops
    const numStops = 10;
    for (let i = 0; i <= numStops; i++) {
      const offset = i / numStops;
      const value = minValue + offset * (maxValue - minValue);
      
      gradient.append('stop')
        .attr('offset', `${offset * 100}%`)
        .attr('stop-color', color(value));
    }
    
    // Draw legend rectangle
    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', `url(#heatmap-gradient-${containerId})`);
    
    // Add legend axis
    legend.append('g')
      .attr('transform', `translate(${legendWidth}, 0)`)
      .call(legendAxis);
    
    // Add legend title
    legend.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -legendHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text(options.legendTitle || 'Value');
  }
}

/**
 * Get gradient colors for a series of values
 * @param {Array} values Array of values
 * @param {string[]} colorScale Color scale to use
 * @returns {string[]} Array of color strings
 */
export function getGradientColors(values, colorScale = ColorScales.THERMAL) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  
  const interpolateColor = createColorInterpolator(colorScale);
  
  return values.map(value => {
    const normalizedValue = range === 0 ? 0.5 : (value - min) / range;
    return interpolateColor(normalizedValue);
  });
}

/**
 * Create a displacement field visualization in THREE.js
 * @param {THREE.Mesh} mesh Base mesh
 * @param {Array} displacements Array of displacement vectors [x,y,z,...]
 * @param {Object} options Visualization options
 * @returns {THREE.Group} Group containing visualization
 */
export function createDisplacementVisualization(mesh, displacements, options = {}) {
  const {
    scale = 1.0,
    colorScale = ColorScales.DISPLACEMENT,
    showOriginal = true,
    useArrows = true,
    arrowScale = 0.1,
    name = 'Displacement Visualization'
  } = options;
  
  // Create a group to hold visualization objects
  const group = new THREE.Group();
  group.name = name;
  
  // Add original mesh if requested (with transparency)
  if (showOriginal) {
    const originalMesh = mesh.clone();
    
    // Make original mesh semi-transparent
    if (originalMesh.material) {
      const material = originalMesh.material.clone();
      material.transparent = true;
      material.opacity = 0.2;
      material.depthWrite = false;
      originalMesh.material = material;
    }
    
    group.add(originalMesh);
  }
  
  // Create deformed mesh
  const deformedMesh = mesh.clone();
  const geometry = deformedMesh.geometry;
  
  // Get positions attribute
  const positions = geometry.attributes.position;
  
  // Calculate magnitudes for coloring
  const magnitudes = [];
  
  // Apply displacements
  for (let i = 0; i < positions.count; i++) {
    const idx = i * 3;
    
    // Get displacement vector components
    const dx = displacements[idx];
    const dy = displacements[idx + 1];
    const dz = displacements[idx + 2];
    
    // Calculate magnitude
    const magnitude = Math.sqrt(dx * dx + dy * dy + dz * dz);
    magnitudes.push(magnitude);
    
    // Apply scaled displacement
    positions.array[idx] += dx * scale;
    positions.array[idx + 1] += dy * scale;
    positions.array[idx + 2] += dz * scale;
  }
  
  // Update geometry
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  
  // Apply colors based on displacement magnitude
  applyVertexColors(deformedMesh, magnitudes, colorScale);
  
  // Add deformed mesh to group
  group.add(deformedMesh);
  
  // Add displacement arrows if requested
  if (useArrows) {
    const arrowGroup = new THREE.Group();
    arrowGroup.name = 'Displacement Arrows';
    
    // Create arrow helper for each vertex (can be expensive for large meshes)
    // For production, you'd want to implement a sampling strategy
    
    const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const arrowGeo = new THREE.ConeGeometry(0.02, 0.08, 8);
    arrowGeo.translate(0, 0.04, 0);
    arrowGeo.rotateX(Math.PI / 2);
    
    // Sample vertices (don't create arrows for every vertex)
    const vertexCount = positions.count;
    const sampleRate = Math.max(1, Math.floor(vertexCount / 100));
    
    for (let i = 0; i < vertexCount; i += sampleRate) {
      const idx = i * 3;
      
      // Get original position
      const origX = positions.array[idx] - displacements[idx] * scale;
      const origY = positions.array[idx + 1] - displacements[idx + 1] * scale;
      const origZ = positions.array[idx + 2] - displacements[idx + 2] * scale;
      
      // Get displacement vector
      const dx = displacements[idx];
      const dy = displacements[idx + 1];
      const dz = displacements[idx + 2];
      
      const magnitude = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      // Skip very small displacements
      if (magnitude < 0.001) continue;
      
      // Create line for arrow shaft
      const points = [
        new THREE.Vector3(origX, origY, origZ),
        new THREE.Vector3(
          origX + dx * scale * 0.9,
          origY + dy * scale * 0.9,
          origZ + dz * scale * 0.9
        )
      ];
      
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({ 
        color: 0xffff00,
        linewidth: 2
      });
      
      const line = new THREE.Line(lineGeo, lineMat);
      arrowGroup.add(line);
      
      // Create arrow head
      const arrowHead = new THREE.Mesh(arrowGeo, arrowMaterial);
      arrowHead.position.set(
        origX + dx * scale,
        origY + dy * scale,
        origZ + dz * scale
      );
      
      // Orient arrow along displacement direction
      arrowHead.lookAt(origX, origY, origZ);
      
      arrowGroup.add(arrowHead);
    }
    
    group.add(arrowGroup);
  }
  
  return group;
}

export default {
  ColorScales,
  createColorInterpolator,
  applyVertexColors,
  createStressVisualization,
  createColorLegend,
  createBarChart,
  createHeatmap,
  getGradientColors,
  createDisplacementVisualization
}; 