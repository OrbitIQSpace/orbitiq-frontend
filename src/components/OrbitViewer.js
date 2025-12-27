import React, { useEffect, useRef } from 'react';
import {
  Viewer,
  CzmlDataSource,
  JulianDate,
  TimeInterval,
  ClockRange,
  ClockStep,
  Math as CesiumMath,
  Cartesian3,
  Color,
  Ion,
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// SET YOUR CESIUM ION TOKEN HERE (GET FREE AT: https://ion.cesium.com/)
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MDdlZWE1Zi0wNGZlLTQ1ZmQtOGViMC1mNTliMjE0YjU3MTQiLCJpZCI6MzU1Njc1LCJpYXQiOjE3NjE4NjM3NTl9.ITbviP2873EntcBr7dHRBQVAiRZHP54_t3x6T4ekbQU';

const OrbitViewer = ({ satellite }) => {
  const cesiumContainer = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!satellite?.tle_line1 || !satellite?.tle_line2) return;

    // Initialize Cesium Viewer
    const viewer = new Viewer(cesiumContainer.current, {
      terrainProvider: undefined,
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: true,
      navigationHelpButton: false,
      shouldAnimate: true,
      clockViewModel: {
        startTime: JulianDate.now(),
        stopTime: JulianDate.addDays(JulianDate.now(), 1, new JulianDate()),
        currentTime: JulianDate.now(),
        clockRange: ClockRange.LOOP_STOP,
        clockStep: ClockStep.SYSTEM_CLOCK_MULTIPLIER,
        multiplier: 60,
      },
    });

    viewerRef.current = viewer;

    // Generate CZML from TLE
    const start = JulianDate.now();
    const stop = JulianDate.addHours(start, 6, new JulianDate());

    const czml = [
      {
        id: 'document',
        name: satellite.name,
        version: '1.0',
        clock: {
          interval: JulianDate.toIso8601(start) + '/' + JulianDate.toIso8601(stop),
          currentTime: JulianDate.toIso8601(start),
          multiplier: 60,
          range: 'LOOP_STOP',
          step: 'SYSTEM_CLOCK_MULTIPLIER',
        },
      },
      {
        id: satellite.norad_id,
        name: satellite.name,
        availability: JulianDate.toIso8601(start) + '/' + JulianDate.toIso8601(stop),
        label: {
          text: satellite.name,
          font: '14pt sans-serif',
          fillColor: Color.WHITE,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
          style: 'FILL_AND_OUTLINE',
          pixelOffset: { cartesian2: [0, -40] },
          horizontalOrigin: 'CENTER',
          verticalOrigin: 'BOTTOM',
        },
        billboard: {
          image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE2LDBBMjAsMjAgMCAwLDAgMTYsMzJBMjAsMjAgMCAwLDAgMTYsME0xNiwyOEEyMCwyMCAwIDAsMSA0LDE2QTIwLDIwIDAgMCwxIDE2LDBNMTYsMjRBMjAsMjAgMCAwLDAgMTYsNE0xNiwyNEMyMC40LDI0IDI0LDIwLjQgMjQsMTZDMTYsMTYgMTYsMTYgMTYsMTZDMTEuNiwxNiA4LDE5LjYgOCwyNEM4LDI0IDgsMjQgOCwyNE0xNiwyMEMxMS42LDIwIDgsMTYuNCA4LDEyQzgsMTIgOCwxMiA4LDEyQzEyLjQsMTIgMTYsMTUuNiAxNiwyME0xNiw4QzIwLjQsOCAyNCwxMS42IDI0LDE2QzE2LDE2IDE2LDE2IDE2LDE2QzE2LjQsMTYgMTYsMTYuNCAxNiwxNloiIGZpbGw9IiNGRjJGMDAiLz48L3N2Zz4=',
          scale: 1.0,
          verticalOrigin: 'BOTTOM',
          pixelOffset: { cartesian2: [0, 0] },
        },
        path: {
          material: {
            polylineOutline: {
              color: Color.YELLOW,
              outlineColor: Color.BLACK,
              outlineWidth: 2,
            },
          },
          width: 3,
          leadTime: 3600,
          trailTime: 3600,
          resolution: 120,
        },
        position: {
          interpolationAlgorithm: 'LAGRANGE',
          interpolationDegree: 5,
          referenceFrame: 'INERTIAL',
          epoch: JulianDate.toIso8601(start),
          cartesian: [],
        },
      },
    ];

    // Use Cesium's built-in TLE → Cartesian propagator
    const propagator = new Cesium.SatellitePropagator({
      tle: [satellite.tle_line1, satellite.tle_line2],
    });

    const positions = [];
    const times = [];
    const stepSeconds = 60;
    const totalSeconds = 6 * 3600; // 6 hours

    for (let i = 0; i <= totalSeconds; i += stepSeconds) {
      const time = JulianDate.addSeconds(start, i, new JulianDate());
      const position = propagator.getPosition(time);
      if (position) {
        positions.push(position.x, position.y, position.z);
        times.push(i);
      }
    }

    czml[1].position.cartesian = positions;

    // Load CZML
    const dataSource = new CzmlDataSource();
    dataSource.load(czml).then(() => {
      viewer.dataSources.add(dataSource);
      viewer.zoomTo(dataSource);

      // Optional: Add ground track (projected path on Earth)
      const groundPositions = positions.filter((_, i) => i % 10 === 0).map((_, i) => {
        const cart = Cartesian3.fromArray(positions.slice(i * 3, i * 3 + 3));
        const cartographic = Cesium.Cartographic.fromCartesian(cart);
        const surface = viewer.scene.globe.getHeight(cartographic) || 0;
        cartographic.height = surface;
        return Cesium.Cartographic.toCartesian(cartographic);
      });

      viewer.entities.add({
        polyline: {
          positions: Cartesian3.fromArray(groundPositions.flatMap(p => [p.x, p.y, p.z])),
          width: 2,
          material: Color.CYAN.withAlpha(0.7),
          clampToGround: true,
        },
      });
    });

    // Cleanup
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, [satellite]);

  return (
    <div
      ref={cesiumContainer}
      style={{
        width: '100%',
        height: '600px',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        marginTop: '20px',
      }}
    />
  );
};

export default OrbitViewer;