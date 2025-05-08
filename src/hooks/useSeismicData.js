import { useState, useEffect } from 'react';

/**
 * Sample seismic data for demonstration purposes
 * In a real app, this would be fetched from an API
 */
const SAMPLE_SEISMIC_DATA = {
  timeHistory: {
    time: Array.from({ length: 1000 }, (_, i) => i * 0.02),
    acceleration: Array.from({ length: 1000 }, () => (Math.random() * 2 - 1) * Math.exp(-Math.random() * 0.01)),
    displacement: Array.from({ length: 1000 }, () => (Math.random() * 2 - 1) * Math.exp(-Math.random() * 0.005)),
    velocity: Array.from({ length: 1000 }, () => (Math.random() * 2 - 1) * Math.exp(-Math.random() * 0.008)),
  },
  spectra: {
    period: Array.from({ length: 100 }, (_, i) => 0.1 + i * 0.05),
    spectralAcceleration: Array.from({ length: 100 }, (_, i) => {
      const x = 0.1 + i * 0.05;
      return 2 * Math.exp(-0.5 * Math.pow((x - 0.8) / 0.3, 2));
    }),
    spectralDisplacement: Array.from({ length: 100 }, (_, i) => {
      const x = 0.1 + i * 0.05;
      return 0.5 * Math.exp(-0.5 * Math.pow((x - 1.2) / 0.4, 2));
    }),
  },
  earthquake: {
    name: 'Sample Earthquake',
    magnitude: 7.2,
    depth: 15.5,
    location: 'Sample Fault Line',
    date: '2023-04-15T08:30:00Z',
    epicenter: {
      latitude: 34.05,
      longitude: -118.25,
    },
    pga: 0.35, // Peak Ground Acceleration (g)
    pgv: 45.2, // Peak Ground Velocity (cm/s)
    pgd: 15.3, // Peak Ground Displacement (cm)
  }
};

/**
 * Custom hook for fetching and processing seismic data for visualizations
 * 
 * @param {Object} options Configuration options
 * @param {string} options.dataType Type of seismic data to fetch (timeHistory, spectra, etc.)
 * @param {string} options.earthquake Specific earthquake identifier
 * @param {string} options.station Seismic station identifier
 * @param {string} options.component Component direction (NS, EW, Vertical)
 * @param {boolean} options.useSample Whether to use sample data (for demo/development)
 * @returns {Object} Seismic data and utility functions
 */
const useSeismicData = ({
  dataType = 'timeHistory',
  earthquake = 'sample',
  station = 'all',
  component = 'NS',
  useSample = true,
  apiUrl = '/api/seismic-data',
} = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataParams, setDataParams] = useState({
    dataType,
    earthquake,
    station,
    component,
  });

  // Fetch seismic data from API or use sample data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (useSample) {
          // Use sample data for demonstration
          setTimeout(() => {
            setData(SAMPLE_SEISMIC_DATA);
            setLoading(false);
          }, 500); // Simulate API delay
        } else {
          // In a real app, fetch from API
          const params = new URLSearchParams({
            dataType: dataParams.dataType,
            earthquake: dataParams.earthquake,
            station: dataParams.station,
            component: dataParams.component,
          });

          const response = await fetch(`${apiUrl}?${params}`);
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          
          const jsonData = await response.json();
          setData(jsonData);
          setLoading(false);
        }
      } catch (err) {
        setError(err.message || 'Error fetching seismic data');
        setLoading(false);
      }
    };

    fetchData();
  }, [dataParams, useSample, apiUrl]);

  // Update data parameters
  const updateDataParams = (newParams) => {
    setDataParams(prev => ({ ...prev, ...newParams }));
  };

  // Process time history data for visualization
  const processTimeHistoryData = () => {
    if (!data || !data.timeHistory) return null;
    
    const { time, acceleration, displacement, velocity } = data.timeHistory;
    
    // Format for chart libraries
    return {
      labels: time,
      datasets: [
        {
          label: 'Acceleration',
          data: acceleration,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Displacement',
          data: displacement,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Velocity',
          data: velocity,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    };
  };

  // Process response spectra data for visualization
  const processSpectraData = () => {
    if (!data || !data.spectra) return null;
    
    const { period, spectralAcceleration, spectralDisplacement } = data.spectra;
    
    // Format for chart libraries
    return {
      labels: period,
      datasets: [
        {
          label: 'Spectral Acceleration',
          data: spectralAcceleration,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          yAxisID: 'y',
        },
        {
          label: 'Spectral Displacement',
          data: spectralDisplacement,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          yAxisID: 'y1',
        },
      ],
    };
  };

  // Get specific earthquake details
  const getEarthquakeDetails = () => {
    return data?.earthquake || null;
  };

  return {
    data,
    loading,
    error,
    updateDataParams,
    processTimeHistoryData,
    processSpectraData,
    getEarthquakeDetails,
    dataParams,
  };
};

export default useSeismicData; 