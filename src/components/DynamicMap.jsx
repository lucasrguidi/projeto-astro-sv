import React, { useEffect, useRef, useState } from 'react';

import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';

import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import '@photo-sphere-viewer/markers-plugin/index.css';

import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin';

import teamsData from '../assets/teamsData.json';

const DyamicMap = ({ team }) => {
  const [teamData, setTeamData] = useState(null);
  const loadingImg =
    'https://photo-sphere-viewer-data.netlify.app/assets/loader.gif';
  const BUTTON_ID = 'panel-button';
  const PANEL_ID = 'custom-panel';
  const viewerMonted = useRef(false);
  const polygonMarkerMonted = useRef(false);

  const lang = {
    zoom: 'Zoom',
    zoomOut: 'Menos zoom',
    zoomIn: 'Mais zoom',
    moveUp: 'Mover para cima',
    moveDown: 'Mover para baixo',
    moveLeft: 'Mover para esquerda',
    moveRight: 'Mover para direita',
    download: 'Download',
    fullscreen: 'Tela cheia',
    menu: 'Menu',
    close: 'Fechar',
    twoFingers: 'Use dois dedos para navegar',
    ctrlZoom: 'Use ctrl + scroll para dar zoom na imagem',
    loadError: 'O panorama não pode ser carregado',
  };

  useEffect(() => {
    function getTeamData() {
      const data = teamsData.find((item) => item.name === team);
      setTeamData(data);
    }

    getTeamData();
  }, [team]);

  useEffect(() => {
    if (!viewerMonted.current && teamData) {
      const viewer = new Viewer({
        container: 'viewer',
        panorama: teamData.panorama,
        caption: teamData.caption,
        lang,
        defaultZoomLvl: 0,
        loadingImg,
        touchmoveTwoFingers: true,
        mousewheelCtrlKey: false,
        navbar: [
          'zoom',
          'fullscreen',
          'caption',
          {
            id: BUTTON_ID,
            title: 'Informações',
            content: 'ℹ️',
            onClick: (viewer) => {
              viewer.panel.isVisible(PANEL_ID)
                ? viewer.panel.hide()
                : viewer.panel.show({
                    id: PANEL_ID,
                    width: '30%',
                    content: document.querySelector('#panel-content').innerHTML,
                  });
            },
          },
        ],
        plugins: [
          [
            AutorotatePlugin,
            {
              autostartDelay: 2000,
              autorotateSpeed: '1rpm',
            },
          ],
          [MarkersPlugin],
        ],
      });

      viewerMonted.current = true;

      const markersPlugin = viewer.getPlugin(MarkersPlugin);
      // Add pin
      viewer.addEventListener('click', ({ data }) => {
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
      viewer.addEventListener('click', ({ data }) => {
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

      markersPlugin.state.needsReRender = true;

      viewer.addEventListener('show-panel', ({ panelId }) => {
        if (panelId === PANEL_ID) {
          viewer.navbar.getButton(BUTTON_ID).toggleActive(true);
        }
      });

      viewer.addEventListener('hide-panel', ({ panelId }) => {
        if (panelId === PANEL_ID) {
          viewer.navbar.getButton(BUTTON_ID).toggleActive(false);
        }
      });
    }
  }, [teamData]);

  if (!teamData) return;
  return (
    <>
      <div id='viewer' style={{ width: '100vw', height: '100vh' }}></div>;
      <div id='panel-content' style={{ display: 'none' }}>
        {teamData.panelContent}
      </div>
    </>
  );
};

export default DyamicMap;
