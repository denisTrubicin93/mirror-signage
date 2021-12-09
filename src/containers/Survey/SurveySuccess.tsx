import React, { useRef, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { BACKGROUND, ICON_TEXT_BUTTON } from '../common/styles';
import { Box, Typography,  } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import JumpGif from './assets/jump.gif';
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
        background: '#ffffff',
        '& .gif': {
          position: 'absolute',
          width: 940,
          height: 1666,
        },
        '& .title': {
          color: '#000000',
          position: 'absolute',
          top: 1695,
          fontWeight: 800,
          fontSize: 72,
        },
      },
    },
  })
);

const os = require('os');

export default function SurveySuccess() {
  const classes = useStyles();
  const history = useHistory();

  useFootControl({
    intitialIndex: 0,
    goBack: () => history.push('menu'),
  });

  useEffect(() => {
    const timeId = setTimeout(() => history.push('menu'), 4000)

    return () => clearTimeout(timeId)
  }, [])

  return (
    <>
      <Box className={classes.app_content}>
        <Box className="background">
          <img src={JumpGif} className="gif" />

          <Typography className="title">ありがとうございました！</Typography>
        </Box>
      </Box>
    </>
  );
}
