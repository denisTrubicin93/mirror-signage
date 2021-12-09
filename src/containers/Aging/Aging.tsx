import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Box, Grid, Typography } from '@material-ui/core';
import HeaderBg from './assets/aging_header.png';
import TinyAgingIcon from './assets/aging_icon.png';
import TimerCountdown from '../../components/common/TimerCountdown';
import {
  BACKGROUND,
  BLUR_TITLE,
  BOTTOM_BG,
  CARD,
  CARD_SHADOW,
  COUNTER,
  COUNTER_NOTE,
  TOP_BG,
} from '../common/styles';
import useFootControl from '../../components/common/hook/useFootControl';

const useStyles = makeStyles(() =>
  createStyles({
    app_content: {
      width: '1080px',
      height: '1920px',
      top: 0,
      left: 0,
      position: 'fixed',
      '& .background': {
        ...BACKGROUND,
        '& .top_bg': {
          ...TOP_BG,
          background: `url(${HeaderBg}) center no-repeat `,
        },
        '& .bottom_bg': {
          ...BOTTOM_BG,
          '& .blur_title': {
            ...BLUR_TITLE,
          },
          '& .card': {
            ...CARD,
            background: 'linear-gradient(180deg, #33FF54 0%, #23CD53 100%);',
            '& .icon': {
              width: 200,
              height: 200,
              background: `url(${TinyAgingIcon}) center no-repeat`,
              marginRight: 30,
            },
            '& .title': {
              fontSize: 80,
              fontWeight: 800,
              letterSpacing: '0.02em',
            },
            '& .card_body': {
              fontSize: 48,
              fontWeight: 800,
              padding: 15,
              display: 'flex',
            },
          },
          '& .card_shadow': {
            ...CARD_SHADOW,
            background: '#33FF5433',
            opacity: 1,
          },
          '& .counter': {
            ...COUNTER,
          },
          '& .counter_note': {
            ...COUNTER_NOTE,
          },
        },
      },
    },
  })
);

const Aging = () => {
  const classes = useStyles();
  const history = useHistory();

  const onShoot = () => {
    history.push('agingDetect');
  };

  useFootControl({
    intitialIndex: 0,
    actions: [],
    goBack: () => history.push('menu'),
  });

  return (
    <Box className={classes.app_content}>
      <Box className="background">
        <Box className="top_bg"></Box>
        <Box className="bottom_bg">
          <Typography className="blur_title">ゲームせつめい</Typography>
          <Grid container direction="column" className="card">
            <Grid container direction="row" alignItems="center">
              <Box className="icon"></Box>
              <Typography className="title">未来のあなた</Typography>
            </Grid>
            <Typography className="card_body">
              カメラの前に立ち
              <br />
              未来のあなたを見てみよう！
              <br />
              あなたの未来のためにしっかり
              <br />
              準備をしているかな？
            </Typography>
          </Grid>
          <Box className="card_shadow" />
          <TimerCountdown className="counter" seconds={3} onShoot={onShoot} />
          <Typography className="counter_note">ゲームスタートまで</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Aging;

export { Aging };
