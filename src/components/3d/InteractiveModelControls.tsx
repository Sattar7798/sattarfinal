import React, { useState, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { Button, Slider, Tabs, Space, Tooltip as AntTooltip, Radio } from 'antd';
import { Vector3 } from 'three';
import {
  CameraOutlined,
  ScissorOutlined,
  FullscreenOutlined,
  ExpandOutlined,
  RulerOutlined,
  EyeOutlined,
  CodeOutlined,
  SettingOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

interface InteractiveModelControlsProps {
  onSectionChange?: (axis: 'x' | 'y' | 'z', value: number) => void;
  onCameraPresetChange?: (preset: CameraPreset) => void;
  onVisibilityChange?: (layers: string[], visible: boolean) => void;
  onExplodeChange?: (factor: number) => void;
  enableMeasurement?: boolean;
  enableScreenshot?: boolean;
  className?: string;
  availableLayers?: string[];
  initialCameraPreset?: CameraPreset;
}

type CameraPreset = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' | 'isometric';

const cameraPositions: Record<CameraPreset, [number, number, number]> = {
  front: [0, 0, 5],
  back: [0, 0, -5],
  left: [-5, 0, 0],
  right: [5, 0, 0],
  top: [0, 5, 0],
  bottom: [0, -5, 0],
  isometric: [3, 3, 3],
};

const InteractiveModelControls: React.FC<InteractiveModelControlsProps> = ({
  onSectionChange,
  onCameraPresetChange,
  onVisibilityChange,
  onExplodeChange,
  enableMeasurement = true,
  enableScreenshot = true,
  className = '',
  availableLayers = ['Structure', 'Exterior', 'MEP', 'Interior'],
  initialCameraPreset = 'isometric',
}) => {
  const [activeTab, setActiveTab] = useState<string>('camera');
  const [sectionValues, setSectionValues] = useState({ x: 0, y: 0, z: 0 });
  const [explodeFactor, setExplodeFactor] = useState(0);
  const [measurementActive, setMeasurementActive] = useState(false);
  const [selectedLayers, setSelectedLayers] = useState<string[]>(availableLayers);
  const [selectedCameraPreset, setSelectedCameraPreset] = useState<CameraPreset>(initialCameraPreset);
  
  const { camera } = useThree();
  
  // Camera preset handler
  const handleCameraPreset = useCallback((preset: CameraPreset) => {
    setSelectedCameraPreset(preset);
    
    // Set camera position based on preset
    const [x, y, z] = cameraPositions[preset];
    camera.position.set(x, y, z);
    camera.lookAt(new Vector3(0, 0, 0));
    
    if (onCameraPresetChange) {
      onCameraPresetChange(preset);
    }
  }, [camera, onCameraPresetChange]);
  
  // Section cut handler
  const handleSectionChange = (axis: 'x' | 'y' | 'z', value: number | [number, number]) => {
    const newValue = typeof value === 'number' ? value : value[0]; // Use first number if it's an array
    setSectionValues(prev => ({
      ...prev,
      [axis]: newValue
    }));
    
    if (onSectionChange) {
      onSectionChange(axis, newValue);
    }
  };
  
  // Explode view handler
  const handleExplodeChange = (value: number | [number, number]) => {
    const newValue = typeof value === 'number' ? value : value[0];
    setExplodeFactor(newValue);
    
    if (onExplodeChange) {
      onExplodeChange(newValue);
    }
  };
  
  // Visibility handler
  const handleVisibilityChange = (layer: string, checked: boolean) => {
    const updatedLayers = checked
      ? [...selectedLayers, layer]
      : selectedLayers.filter(l => l !== layer);
    
    setSelectedLayers(updatedLayers);
    
    if (onVisibilityChange) {
      onVisibilityChange([layer], checked);
    }
  };
  
  // Measurement handler
  const toggleMeasurement = () => {
    setMeasurementActive(!measurementActive);
  };
  
  // Screenshot handler
  const takeScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'structural-model-screenshot.png';
      a.click();
    }
  };
  
  // Reset view handler
  const resetView = () => {
    setSectionValues({ x: 0, y: 0, z: 0 });
    setExplodeFactor(0);
    handleCameraPreset('isometric');
    setSelectedLayers(availableLayers);
    
    if (onSectionChange) {
      Object.entries(sectionValues).forEach(([axis, _]) => {
        onSectionChange(axis as 'x' | 'y' | 'z', 0);
      });
    }
    
    if (onExplodeChange) {
      onExplodeChange(0);
    }
    
    if (onVisibilityChange) {
      onVisibilityChange(availableLayers, true);
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        tabPosition="top"
        size="small"
        items={[
          {
            key: 'camera',
            label: (
              <AntTooltip title="Camera Controls">
                <CameraOutlined />
              </AntTooltip>
            ),
            children: (
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-medium">Camera Position</h4>
                <Radio.Group 
                  value={selectedCameraPreset}
                  onChange={e => handleCameraPreset(e.target.value)}
                  buttonStyle="solid"
                  size="small"
                  className="flex flex-wrap gap-1"
                >
                  <Radio.Button value="front">Front</Radio.Button>
                  <Radio.Button value="back">Back</Radio.Button>
                  <Radio.Button value="left">Left</Radio.Button>
                  <Radio.Button value="right">Right</Radio.Button>
                  <Radio.Button value="top">Top</Radio.Button>
                  <Radio.Button value="bottom">Bottom</Radio.Button>
                  <Radio.Button value="isometric">Isometric</Radio.Button>
                </Radio.Group>
              </div>
            ),
          },
          {
            key: 'section',
            label: (
              <AntTooltip title="Section Cuts">
                <ScissorOutlined />
              </AntTooltip>
            ),
            children: (
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-medium">Section Cuts</h4>
                <div>
                  <div className="flex items-center mb-2">
                    <span className="w-10 text-sm">X-Axis</span>
                    <Slider 
                      min={-1} 
                      max={1} 
                      step={0.01} 
                      value={sectionValues.x}
                      onChange={value => handleSectionChange('x', value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="w-10 text-sm">Y-Axis</span>
                    <Slider 
                      min={-1} 
                      max={1} 
                      step={0.01} 
                      value={sectionValues.y}
                      onChange={value => handleSectionChange('y', value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="w-10 text-sm">Z-Axis</span>
                    <Slider 
                      min={-1} 
                      max={1} 
                      step={0.01} 
                      value={sectionValues.z}
                      onChange={value => handleSectionChange('z', value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: 'visibility',
            label: (
              <AntTooltip title="Layer Visibility">
                <EyeOutlined />
              </AntTooltip>
            ),
            children: (
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-medium">Layer Visibility</h4>
                <div className="grid grid-cols-2 gap-2">
                  {availableLayers.map(layer => (
                    <div key={layer} className="flex items-center">
                      <input 
                        type="checkbox"
                        id={`layer-${layer}`}
                        checked={selectedLayers.includes(layer)}
                        onChange={e => handleVisibilityChange(layer, e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor={`layer-${layer}`} className="text-sm">{layer}</label>
                    </div>
                  ))}
                </div>
              </div>
            ),
          },
          {
            key: 'explode',
            label: (
              <AntTooltip title="Explode View">
                <ExpandOutlined />
              </AntTooltip>
            ),
            children: (
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-medium">Explode View</h4>
                <Slider 
                  min={0} 
                  max={1} 
                  step={0.01} 
                  value={explodeFactor}
                  onChange={handleExplodeChange}
                />
              </div>
            ),
          },
          {
            key: 'tools',
            label: (
              <AntTooltip title="Additional Tools">
                <SettingOutlined />
              </AntTooltip>
            ),
            children: (
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-medium">Tools</h4>
                <Space>
                  {enableMeasurement && (
                    <Button 
                      type={measurementActive ? "primary" : "default"}
                      size="small"
                      icon={<RulerOutlined />}
                      onClick={toggleMeasurement}
                    >
                      Measure
                    </Button>
                  )}
                  
                  {enableScreenshot && (
                    <Button 
                      size="small"
                      icon={<FullscreenOutlined />}
                      onClick={takeScreenshot}
                    >
                      Screenshot
                    </Button>
                  )}
                  
                  <Button 
                    size="small"
                    icon={<CodeOutlined />}
                    title="Export Model Data"
                  >
                    Export
                  </Button>
                  
                  <Button 
                    size="small"
                    icon={<ReloadOutlined />}
                    onClick={resetView}
                  >
                    Reset
                  </Button>
                </Space>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default InteractiveModelControls; 