import React, { useRef, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { BACKGROUND, ICON_TEXT_BUTTON } from '../common/styles';
import { Box, Typography, Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../features';
import { useDispatch, useSelector } from 'react-redux';
import { MIRROR_CONTENT, USER_REVIEW } from './SurveyCapturePhoto';
import GestureGif from './assets/gesture.gif';
import Good from './assets/good.png';
import SoSo from './assets/soso.png';
import NotGood from './assets/not_good.png';
import useFootControl from '../../components/common/hook/useFootControl';
import { saveUserSurvey } from '../../service/SurveyService';
import { delay } from 'redux-saga/effects';

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
        '& .gesture_gif': {
          position: 'absolute',
          width: 800,
          height: 800,
          top: 30,
        },
        '& .title': {
          color: '#000000',
          position: 'absolute',
          top: 888,
          fontWeight: 900,
          fontSize: 96,
        },
        '& .btn': {
          ...ICON_TEXT_BUTTON,
          width: 320,
          height: 400,
          justifyContent: 'space-evenly',
          '& .center_title': {
            fontSize: 40,
            color: '#613BFF',
            fontWeight: 800,
            marginTop: 10,
          },
          '& .icon': {
            maxHeight: '50%',
            maxWidth: '50%',
          },
        },
        '& .btn_active': {
          border: '16px solid #613BFF',
        },
      },
    },
  })
);

const os = require('os');

export default function SurveyReview(props: any) {
  const classes = useStyles();
  const history = useHistory();
  const profile = useSelector((state: RootState) => state.person.profile);
  const content = props.location?.state?.content;
  console.log(MIRROR_CONTENT[content])

  const reviewContent = (review: USER_REVIEW) => {
    try {
      const params = {
        mirrorName: os.hostname(),
        age: profile?.age ?? 0,
        gender: profile?.gender,
        content: content ?? MIRROR_CONTENT.UNKNOWN,
        review: review
      }
  
      saveUserSurvey(params)
      delay(1000)
      history.push('surveySuccess')
    } catch (error) {
      history.push('surveySuccess')
    }
  }

  const buttons = [
    {
      centerTitle: '面白かった！',
      icon: Good,
      onTap: () => reviewContent(USER_REVIEW.GOOD),
    },
    {
      centerTitle: 'まぁまぁだった',
      icon: SoSo,
      onTap: () => reviewContent(USER_REVIEW.SOSO),
    },
    {
      centerTitle: 'うーん・・・',
      icon: NotGood,
      onTap: () => reviewContent(USER_REVIEW.NOTGOOD),
    },
  ];

  const { currentIndex, onTap, onHover } = useFootControl({
    intitialIndex: 0,
    actions: buttons.map((x: any) => x.onTap as Function),
    goBack: () => history.push('menu'),
  });

  const buttonClasses = (index: number) => {
    return currentIndex === index ? 'btn btn_active' : 'btn';
  };

  useEffect(() => {
    const timeId = setTimeout(() => history.push('menu'), 15000)

    return () => {
      clearTimeout(timeId)
    }
  }, [])

  return (
    <>
      <Box className={classes.app_content}>
        <Box className="background">
          <img src={GestureGif} className="gesture_gif" />

          <Typography className="title">ミラーの感想を一言で！</Typography>

          <Grid
            container
            direction="row"
            justify="space-between"
            style={{ width: 1000, position: 'absolute', top: 1140 }}
          >
            {buttons.map((x, index) => (
              <Box
                className={buttonClasses(index)}
                key={index}
                onClick={() => onTap(index)}
                onMouseOver={() => onHover(index)}
              >
                <img src={x.icon} className="icon" />
                <Typography className="center_title">
                  {x.centerTitle}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
}
