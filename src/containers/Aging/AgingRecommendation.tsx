import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Box, Typography, Grid } from '@material-ui/core';
import {
  BACKGROUND,
  CARD_SHADOW,
  CARD,
  ICON_TEXT_BUTTON,
} from '../common/styles';
import useFootControl from '../../components/common/hook/useFootControl';
import BackIcon from '../Entertainment/assets/Common/back.png';
import RecommendationIcon from './assets/aging_recommendation.png';
import SurveyIcon from '../Entertainment/assets/Common/survey.png';
import { MIRROR_CONTENT } from '../Survey/SurveyCapturePhoto';

const useStyles = makeStyles(() =>
  createStyles({
    app_content: {
      width: '1080px',
      height: '1920px',
      top: 0,
      left: 0,
      position: 'fixed',
      boxSizing: 'border-box',
      '& .background': {
        ...BACKGROUND,
        '& .card': {
          ...CARD,
          zIndex: 100,
          padding: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 1200,
          top: 100,
          position: 'absolute',
          background: '#24CE53',
          '& .card_header': {
            background: '#FFFFFF33',
            height: 210,
            '& .title': {
              color: '#FFFFFF',
              fontSize: 72,
              fontWeight: 800,
            },
          },
          '& .card_body': {
            padding: '25px 50px',
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            position: 'relative',
            '& .content': {
              fontSize: 40,
              fontWeight: 800,
              textAlign: 'justify',
            },
            '& .content_icon': {
              position: 'absolute',
              right: 30,
              bottom: 20,
            },
          },
        },
        '& .card_shadow': {
          ...CARD_SHADOW,
          background: '#33FF5433',
          opacity: 1,
          top: 1280,
          position: 'absolute',
        },
        '& .btn': {
          ...ICON_TEXT_BUTTON,
          '& .center_title': {
            fontSize: 48,
            color: '#613BFF',
            fontWeight: 800,
            marginTop: 10,
          },
          '& .icon': {
            maxHeight: '45%',
            maxWidth: '45%',
          },
        },
        '& .btn_active': {
          border: '16px solid #613BFF',
        },
        '& .bottom': {
          width: 920,
          position: 'absolute',
          top: 1450,
        },
      },
    },
  })
);

export default function AgingRecommendation() {
  const history = useHistory();
  const classes = useStyles();

  const buttons = [
    {
      centerTitle: '最初にもどる',
      icon: BackIcon,
      onTap: () => history.push('menu'),
    },
    {
      centerTitle: 'アンケートへ',
      icon: SurveyIcon,
      onTap: () =>
        history.push({
          pathname: 'surveyCapturePhoto',
          state: { content: MIRROR_CONTENT.ADULT_AGING },
        }),
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

  return (
    <Box className={classes.app_content}>
      <Box className="background">
        <Grid container direction="column" className="card">
          <Grid
            container
            alignItems="center"
            justify="center"
            className="card_header"
          >
            <Typography className="title">保険について</Typography>
          </Grid>
          <Box className="card_body">
            <Typography className="content">
              生命保険とは、自分の死亡や病気、ケガ、介護の備えをすることで、
              自分や家族を守る生活保障の仕組みです。大勢の人が生命保険会社へ保険料を支払い、
              公平に保険料を負担しあうことで、万が一のときに保険金や給付金を受け取ることができます。
            </Typography>
            <img src={RecommendationIcon} className="content_icon" />
          </Box>
        </Grid>
        <Box className="card_shadow" />
        <Grid
          container
          direction="row"
          justify="space-between"
          style={{ width: 930, position: 'absolute', top: 1480 }}
        >
          {buttons.map((x, index) => (
            <Box
              className={buttonClasses(index)}
              key={index}
              onClick={() => onTap(index)}
              onMouseOver={() => onHover(index)}
            >
              <img src={x.icon} className="icon" />
              <Typography className="center_title">{x.centerTitle}</Typography>
            </Box>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
