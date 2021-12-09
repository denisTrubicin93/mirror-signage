import React, { useEffect, useState, useRef } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Options } from 'react-youtube';
import { useDispatch, useSelector } from 'react-redux';
import { disableCursor } from '../../features/Handtracking/reducer';
import video1 from './assets/neutral.mp4';
import { getCurrentPoint } from '../../features/Button/reducer';
import { ButtonPoint } from '../../features/Button/models';


const useStyles = makeStyles(() =>
  createStyles({
    layout: {
      alignContent: 'center',
      width: '100vw',
      height: '100vh',
      verticalAlign: 'top',
      backgroundColor: '#000000',
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

const opts: Options = {
  width: '1280',
  height: '720',
  playerVars: {
    autoplay: 1,
    list: 'PLTIqUVQRjA315-tvGM3DxDJkOI2E-2-nk',
    listType: 'playlist',
    controls: 0,
    loop: 1,
  },
};
const youtubeId = 'qgi7pbmeL_k';

export default function Sleep() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const audioPlayer: any = useRef();
  const [video, setVideo] = useState(video1);
  const [index, setIndex] = useState(0);

  // const videos = [video1, video2, video3, video4, video5, video6];
  const videos = [video1];
  useEffect(() => {
    dispatch(disableCursor());

    setTimeout(() => {
      if (audioPlayer && audioPlayer.current) {
        audioPlayer.current.play();
      }
    }, 1000);
  }, []);

  const footPoint = useSelector(getCurrentPoint) as ButtonPoint;

  useEffect(() => {
    switch (footPoint) {
      case ButtonPoint.L1:
      case ButtonPoint.L2:
      case ButtonPoint.R1:
      case ButtonPoint.R2:
        history.push("/scenes")
        break;
      default:
        break;
    }
  }, [footPoint]);

  useEffect(() => {
    setVideo(videos[index]);
    audioPlayer.current.src = videos[index];

    setTimeout(() => {
      if (audioPlayer && audioPlayer.current) {
        audioPlayer.current.play();
      }
    }, 2000);
  }, [index]);

  const lunchMenu = (name: string) => {
    setTimeout(() => {
      history.push(name);
    }, 2000);
  };

  const videoEnded = () => {
    // if (index < 5) {
    //   setIndex(index + 1)
    // } else {
    //   setIndex(0)
    // }
    setIndex(0);
  };

  return (
    <div className={classes.layout}>
      <div className={classes.content} onClick={() => lunchMenu('/scenes')}>
        {/* <YouTube opts={opts} className={classes.youtube}/> */}
        <video
          controls
          loop
          src={video}
          width="1080"
          onEnded={videoEnded}
          ref={audioPlayer}
          // className={classes.youtube}
        />
      </div>
    </div>
  );
}
