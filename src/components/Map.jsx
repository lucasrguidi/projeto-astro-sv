import React, { useEffect, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import { CompassPlugin } from '@photo-sphere-viewer/compass-plugin';
import '@photo-sphere-viewer/compass-plugin/index.css';
import criciumaStadiumPhoto from '../../public/assets/criciuma.jpg';

const Map = () => {
  const baseUrl = 'https://photo-sphere-viewer-data.netlify.app/assets/';
  const BUTTON_ID = 'panel-button';
  const PANEL_ID = 'custom-panel';

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
    const viewer = new Viewer({
      container: 'viewer',
      panorama: criciumaStadiumPhoto.src,
      caption: 'Estádio Heriberto Hülse - <b>Criciúma SC</b>',
      lang,
      defaultZoomLvl: 0,
      loadingImg: baseUrl + 'loader.gif',
      touchmoveTwoFingers: true,
      mousewheelCtrlKey: false,
      navbar: [
        'zoom',
        'fullscreen',
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
          CompassPlugin,
          {
            hotspots: [{ yaw: '45deg' }, { yaw: '60deg', color: 'red' }],
          },
        ],
      ],
    });

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

    viewer.addEventListener('click', () => {
      viewer.notification.show({
        content: 'Dale tigre 🐯🐯',
        timeout: 750,
      });
    });
  }, []);

  return (
    <>
      <div id='viewer' style={{ width: '100vw', height: '100vh' }}></div>;
      <div id='panel-content' style={{ display: 'none' }}>
        <h1>Estádio Heriberto Hülse</h1>

        <p>
          O <b>Estádio Heriberto Hülse,</b> apelidado de "Majestoso", é um
          estádio de futebol localizado na cidade de Criciúma, estado de Santa
          Catarina, Brasil. O proprietário do estádio é o Criciúma Esporte
          Clube. É o único estádio de futebol de Santa Catarina com completa
          cobertura para os torcedores. Atualmente, tem capacidade para 19.225
          torcedores.
        </p>

        <p>
          O estádio do Criciúma Esporte Clube, um dos principais do estado de
          Santa Catarina, já abrigou competições de nível internacional como a
          Copa Libertadores da América, época na qual foi completamente adaptado
          para competição. Destaque entre os principais estádios do estado, é o
          único completamente coberto.
        </p>

        <p>
          O maior público registrado foi em 6 de agosto de 1995 no jogo Criciúma
          1 x 0 Chapecoense pelo campeonato catarinense. O jogo teve um público
          de 31.123 presentes.
        </p>

        <p>
          O nome do estádio é uma homenagem ao ex-governador do estado de Santa
          Catarina, Heriberto Hülse, por ser uma figura política que representou
          o sul Catarinense, onde se situa a cidade de Criciúma, e por sua vez,
          o Majestoso.
        </p>
      </div>
    </>
  );
};

export default Map;
