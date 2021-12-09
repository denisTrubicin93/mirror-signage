import React, { useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, createStyles } from '@material-ui/core';
import AflacVideo from './assets/aflac_video.mp4';
import { MIRROR_CONTENT } from '../Survey/SurveyCapturePhoto';
import useFootControl from '../../components/common/hook/useFootControl';

const useStyles = makeStyles(() =>
  createStyles({
    layout: {
      alignContent: 'center',
      width: '100vw',
      height: '100vh',
      verticalAlign: 'top',
      backgroundColor: '#D1EAFE',
    },
    content: {
      width: '100vw',
      height: '100vh',
    },
    youtube: {
      marginTop: 600,
    },
  })
);

export default function AflacVideoPlayer() {
  const classes = useStyles();
  const history = useHistory();
  const audioPlayer: any = useRef();

  useEffect(() => {
    setTimeout(() => {
      if (audioPlayer && audioPlayer.current) {
        audioPlayer.current.play();
      }
    }, 1000);
  }, []);

  const videoEnded = () => {
    history.push({
      pathname: 'surveyCapturePhoto',
      state: { content: MIRROR_CONTENT.ADULT_AFLAC_JP_POST },
    });
  };

  useFootControl({
    goBack: () => history.push('menu'),
  });

  return (
    <div className={classes.layout}>
      <div className={classes.content}>
        <video
          controls
          src={AflacVideo}
          width="1080"
          height="1910"
          onEnded={videoEnded}
          ref={audioPlayer}
        />
      </div>
    </div>
  );
}
