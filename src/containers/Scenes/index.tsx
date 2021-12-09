import React, { useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Grid } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { setType } from '../../features/Scenes/reducer';
import child from './assets/child.png';
import adult from './assets/adult.png';
import BorderBg from './assets/border_bg.png';
import BorderBgActive from './assets/border_bg_active.png';
import useFootControl from '../../components/common/hook/useFootControl';
import GestureGuide from './assets/gesture_guide.gif';
import GestureGuideText from './assets/gesture_guide_text.png';
import { ButtonPoint } from '../../features/Button/models';
import { messageAction2 } from '../../features/Websocket/reducer';
import useSound from 'use-sound';
import sceneVoice from './assets/voiceover_scene.mp3'

const useStyles = makeStyles(() =>
  createStyles({
    app_content: {
      width: 1080,
      height: 1920,
      top: 0,
      left: 0,
      boxSizing: 'border-box',
      '& .music_header': {
        position: 'absolute',
        height: 155,
        width: '100%',
        background: '#C4C4C4',
        top: 0,
        zIndex: 100,
        color: '#000000',
        fontSize: 64,
        letterSpacing: '0.025em',
        textShadow: '0px 4px 4px rgba(0, 0, 0, 0.5)',
        fontWeight: 900,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 155,
        boxSizing: 'border-box',
      },
      '& .background': {
        width: 1080,
        height: 1920,
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        '& .top_title': {
          fontSize: 80,
          fontWeight: 900,
          position: 'relative',
          top: 335,
          color: '#000000',
        },
        '& .btn_box': {
          position: 'relative',
          width: '70%',
          top: 400,
        },
        '& .border_btn': {
          width: 320,
          height: 320,
          background: `url(${BorderBg}) no-repeat center`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0px 0px 24px rgba(0, 0, 0, 0.25)',
          borderRadius: 80,
          marginBottom: 10,
        },
        '& .border_btn_active': {
          background: `url(${BorderBgActive}) no-repeat center`,
        },
        '& .btn_title': {
          color: '#613BFF',
          fontWeight: 800,
          fontSize: 48,
          textAlign: 'center',
        },
        '& .guide_box': {
          width: 920,
          borderRadius: 24,
          position: 'absolute',
          top: 1000,
          gap: 20
        },
      },
    },
  })
);

const Scenes = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [sceneSoundVoice] = useSound(sceneVoice, { volume: 0.5})

  useEffect(() => {
    console.log('voice')
    sceneSoundVoice && sceneSoundVoice()
  }, [sceneSoundVoice])

  useEffect(() => {
    const logo = document.getElementById('aflac-logo');
    if (logo) {
      logo.style.width = '155px';
      logo.style.height = '155px';
    }
  }, []);

  const buttons: any[] = [
    {
      title: 'こども',
      onTap: () => {
        dispatch(setType('child'));
        history.push('menu');
      },
      icon: child,
    },
    {
      title: '大人',
      onTap: () => {
        dispatch(setType('adult'));
        history.push('menu');
      },
      icon: adult,
    },
  ];

  const { currentIndex, onTap, onHover } = useFootControl({
    intitialIndex: 0,
    actions: buttons.map((x: any) => x.onTap as Function),
    goBack: () => {},
  });

  const buttonClasses = (index: number) => {
    return index === currentIndex
      ? 'border_btn border_btn_active'
      : 'border_btn';
  };

  return (
    <>
      <Box className={classes.app_content}>
        <Typography className="music_header">
          アフラックマジックミラー
        </Typography>
        <Box className="background">
          <Typography className="top_title">モードを選んでね！</Typography>
          <Grid
            container
            direction="row"
            justify="space-between"
            className="btn_box"
          >
            {buttons.map((x, index) => (
              <Grid
                item
                direction="column"
                justify="center"
                key={index}
                onClick={() => onTap(index)}
                onMouseOver={() => onHover(index)}
              >
                <Box className={buttonClasses(index)}>
                  <img src={x.icon} />
                </Box>
                <Typography className="btn_title">{x.title}</Typography>
              </Grid>
            ))}
          </Grid>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            className="guide_box"
            onClick={() => dispatch(messageAction2(ButtonPoint.L2))}
          >
            <img width="630px" height="630px" src={GestureGuide} />
            <img src={GestureGuideText} />
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Scenes;

export { Scenes };
