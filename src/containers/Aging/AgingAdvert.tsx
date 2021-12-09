import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import { BACKGROUND, CARD_SHADOW, CARD, COUNTER } from '../common/styles';
import useFootControl from '../../components/common/hook/useFootControl';
import AdvertChart from './assets/advert_chart.png';
import BottomAdvert from './assets/bottom_advert.png';
import TimerCountdown from '../../components/common/TimerCountdown';

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
        '& .card': {
          ...CARD,
          background: '#24CE53',
          height: 210,
          justifyContent: 'center',
          top: 140,
          borderRadius: 40,
          alignItems: 'center',
          display: 'flex',
          zIndex: 100,
          '& .title': {
            fontSize: 70,
            fontWeight: 800,
          },
        },
        '& .card_shadow': {
          ...CARD_SHADOW,
          background: '#33FF5433',
          opacity: 1,
          top: 115,
          width: 895,
        },
        '& .advert_chart': {
          width: 1080,
          height: 740,
          background: `url(${AdvertChart}) center/cover no-repeat`,
          position: 'absolute',
          top: 505,
        },
        '& .bottom_box': {
          width: 995,
          height: 565,
          borderRadius: 56,
          position: 'absolute',
          top: 1295,
          background: '#33FF5433',
          padding: 40,
          boxSizing: 'border-box',
          '& .bottom_advert': {
            width: '100%',
            height: '100%',
            background: `url(${BottomAdvert}) center/contain no-repeat`,
          },
        },
        '& .counter': {
          ...COUNTER,
          width: 170,
          height: 170,
          position: 'absolute',
          top: 50,
          left: 888,
          zIndex: 200,
          border: '8px solid #FFFFFF',
        },
      },
    },
  })
);

export default function AgingAdvert() {
  const history = useHistory();
  const classes = useStyles();

  useFootControl({
    goBack: () => history.push('agingDetectResult'),
  });

  const onShoot = () => {
    history.push('agingDiseases')
  };

  const textStyle = {
    fontSize: 70,
    lineHeight: 1
  };

  return (
    <Box className={classes.app_content}>
      <Box className="background">
        <Box className="card">
          <Typography className="title">国内の医療費の傾向</Typography>
        </Box>
        <Box className="card_shadow"></Box>
        <Box className="advert_chart" />
        <Box className="bottom_box">
          <Box className="bottom_advert" />
        </Box>
        <TimerCountdown
          className="counter"
          seconds={10}
          onShoot={onShoot}
          textStyle={textStyle}
        />
      </Box>
    </Box>
  );
}
