import React, { useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../features';
import MainBg from '../assets/Quiz/main_bg.png';
import ScoreTitle from '../assets/Quiz/score_title.png';
import BackIcon from '../assets/Common/back.png';
import useFootControl from '../../../components/common/hook/useFootControl';
import { ICON_TEXT_BUTTON } from '../../common/styles';
import AdultSuccessBox from '../assets/Quiz/adult_success_box.png';
import ChildSuccessBox from '../assets/Quiz/child_success_box.png';
import ConfirmIcon from '../assets/Quiz/ar.png';
import { DeviceService } from '../../../service/DeviceService';
import { sendMessageAction } from '../../../features/Websocket/reducer';
import { MIRROR_CONTENT } from '../../Survey/SurveyCapturePhoto';
import SurveyIcon from '../assets/Common/survey.png';

const useStyles = makeStyles(() =>
  createStyles({
    app_content: {
      width: '1080px',
      height: '1920px',
      top: 0,
      left: 0,
      position: 'fixed',
      '& .background': {
        position: 'absolute',
        width: 1080,
        height: 1920,
        left: 0,
        background: `url(${MainBg}) center no-repeat`,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        '& .score_title': {
          width: 649,
          height: 143,
          position: 'relative',
          top: 75,
          background: `url(${ScoreTitle}) center/contain no-repeat`,
        },
        '& .count_box': {
          width: 280,
          height: 280,
          border: '16px solid #FFFFFF',
          boxShadow: '0px 4px 40px rgba(0, 0, 0, 0.25)',
          borderRadius: 32,
          '& .count_title': {
            fontSize: 96,
            fontWeight: 900,
            textAlign: 'center',
          },
          '& .count_note': {
            fontSize: 56,
            fontWeight: 'bold',
            textAlign: 'center',
          },
        },
        '& .correct_count': {
          background: '#42DC76',
        },
        '& .incorrect_count': {
          background: '#FF5CB8',
          '& .count_note': {
            fontSize: '46px !important',
            marginTop: 8,
          },
        },
        '& .animal_box': {
          width: 970,
          height: 715,
          position: 'absolute',
          top: 600,
          left: 65,
        },
        '& .btn': {
          ...ICON_TEXT_BUTTON,
          '& .center_title': {
            fontSize: 48,
            color: '#333333',
            fontWeight: 800,
            position: 'relative',
            top: 30,
            textAlign: 'center',
          },
          '& .icon': {
            maxHeight: '45%',
            maxWidth: '45%',
          },
        },
        '& .btn_active': {
          border: '16px solid #613BFF',
        },
      },
    },
  })
);

const QuizReadyScore = () => {
  const classes = useStyles();
  const history = useHistory();

  const scenesType = useSelector((state: RootState) => state.scenes.type);
  const ok = useSelector<RootState, number>((state) => state.quiz.ok);
  const ng = useSelector<RootState, number>((state) => state.quiz.ng);
  const quiz = useSelector((state) => state.quiz);
  const dispatch = useDispatch();

  useEffect(() => {
    const qrs = [
      'https://8th.io/jnjs3',
      'https://8th.io/j66rx',
      'https://8th.io/mare8',
      'https://8th.io/r6pxb',
    ];
    var index = Math.floor(Math.random() * qrs.length);

    // TODO Make QrCode & Print.
    // DeviceService.default().qrPrint(qrs[index]);
    dispatch(
      sendMessageAction({
        to: 'pose',
        message: {
          cmd: 'qr_print',
          code: qrs[index],
        },
      })
    );
  }, []);

  const buttons = [
    {
      adultTitle: '最初にもどる',
      childTitle: 'さいしょにもどる',
      icon: BackIcon,
      onTap: () => history.push('menu'),
    },
    {
      adultTitle: 'アンケートへ',
      childTitle: 'アンケートへ',
      icon: SurveyIcon,
      onTap: () => {
        let content = undefined;

        if (scenesType === 'child') {
          content = MIRROR_CONTENT.CHILD_QUIZ;
        } else {
          content = MIRROR_CONTENT.ADULT_QUIZ;
        }

        history.push({
          pathname: 'surveyCapturePhoto',
          state: { content },
        });
      },
    },
  ];

  const { currentIndex, onTap, onHover } = useFootControl({
    intitialIndex: 0,
    actions: [...buttons.map((x) => x.onTap)],
    goBack: () => history.push('menu'),
  });

  const buttonClasses = (index: number) => {
    return currentIndex === index ? 'btn btn_active' : 'btn';
  };

  return (
    <>
      <Box className={classes.app_content}>
        <Box className="background">
          <Box className="score_title" />
          <Grid
            container
            direction="row"
            justify="space-between"
            style={{ width: 650, position: 'relative', top: 90 }}
          >
            <Grid item direction="column" className="count_box correct_count">
              <Typography className="count_title">{ok}</Typography>
              <Typography className="count_note">
                {scenesType === 'child' ? 'せいかい' : '正解'}
              </Typography>
            </Grid>
            <Grid item direction="column" className="count_box incorrect_count">
              <Typography className="count_title">{ng}</Typography>
              <Typography className="count_note">
                {scenesType === 'child' ? 'ふせいかい' : '不正解'}
              </Typography>
            </Grid>
          </Grid>

          <img
            className="animal_box"
            src={scenesType === 'child' ? ChildSuccessBox : AdultSuccessBox}
          />

          <Grid
            container
            direction="row"
            justify="space-between"
            style={{ width: 930, position: 'absolute', top: 1426 }}
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
                  {scenesType === 'child' ? x.childTitle : x.adultTitle}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default QuizReadyScore;

export { QuizReadyScore };
