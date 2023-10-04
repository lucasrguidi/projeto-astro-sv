import React, { useState, useEffect, useRef } from 'react';
import {
  AutorotatePlugin,
  MarkersPlugin,
  ReactPhotoSphereViewer,
} from 'react-photo-sphere-viewer';
import teamsData from '../assets/teamsData.json';

const Reactmap = ({ team }) => {
  const [teamData, setTeamData] = useState(null);
  const polygonMarkerMonted = useRef(false);

  useEffect(() => {
    function getTeamData() {
      const data = teamsData.find((item) => item.name === team);
      setTeamData(data);
    }

    getTeamData();
  }, [team]);

  const navbar = [
    'autorotate',
    'zoom',
    'fullscreen',
    'caption',
    {
      id: 'panel-button',
      title: 'Informações',
      content: 'ℹ️',
    },
  ];

  const plugins = [
    [
      AutorotatePlugin,
      {
        autostartDelay: 2000,
        autorotateSpeed: '1rpm',
      },
    ],
    [MarkersPlugin],
  ];

  const handleReady = (instance) => {
    const markersPlugin = instance.getPlugin(MarkersPlugin);
    if (!markersPlugin) return;

    instance.addEventListener('click', ({ data }) => {
      if (!data.rightclick) {
        markersPlugin.addMarker({
          id: '#' + Math.random(),
          position: { yaw: data.yaw, pitch: data.pitch },
          image: '../../public/assets/pin-red.png',
          size: { width: 32, height: 32 },
          anchor: 'bottom center',
          tooltip: 'Marcador',
          data: {
            generated: true,
          },
        });
      }
    });
    // Remove pin
    markersPlugin.addEventListener(
      'select-marker',
      ({ marker, doubleClick }) => {
        if (marker.data?.generated) {
          if (doubleClick) {
            markersPlugin.removeMarker(marker);
          }
        }
      }
    );

    // Create polygon
    let polygonArray = [];
    instance.addEventListener('click', ({ data }) => {
      if (data.rightclick) {
        polygonArray.push([data.yaw, data.pitch]);

        if (!polygonMarkerMonted.current) {
          markersPlugin.addMarker({
            id: 'test-polygon',
            position: [data.yaw, data.pitch],
            polygon: polygonArray,
            svgStyle: {
              fill: 'rgba(200, 0, 0, 0.2)',
              stroke: 'rgba(200, 0, 50, 0.8)',
              strokeWidth: '2px',
            },
            data: {
              generated: true,
            },
          });
          polygonMarkerMonted.current = true;
        }

        markersPlugin.updateMarker({
          id: 'test-polygon',
          polygon: polygonArray,
        });
      }
    });
  };

  if (teamData)
    return (
      <ReactPhotoSphereViewer
        src={teamData.panorama}
        caption={teamData.caption}
        description={teamData.panelContent}
        height={'100vh'}
        width={'100%'}
        navbar={navbar}
        plugins={plugins}
        onReady={handleReady}
      />
    );
};

export default Reactmap;
