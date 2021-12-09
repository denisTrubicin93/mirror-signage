import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Box, Grid, Typography } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../features';
import { Question } from '../../../features/Quiz/models';
import {
  setCurrent,
  setChoose,
} from '../../../features/Quiz/reducer';

import quizDefault from '../assets/Quiz_Ready_Explanation/quiz-default.png';
import ChildBg from '../assets/Quiz/main_bg.png';
import ExplanationBg from '../assets/Quiz/explanation_bg.png';
import yes from '../assets/Quiz/yes.png';
import no from '../assets/Quiz/no.png';
import useFootControl from '../../../components/common/hook/useFootControl';

const useStyles = makeStyles(() =>
  createStyles({
    app_content: {
      width: '1080px',
      height: '1920px',
      top: 0,
      left: 0,
      position: 'fixed',
      '& .child_bg': {
        position: 'absolute',
        width: 1080,
        height: 1920,
        left: 0,
        background: `url(${ChildBg}) center no-repeat`,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        '& .card': {
          position: 'relative',
          top: 326,
          background: `url(${ExplanationBg}) center/cover no-repeat`,
          width: 920,
          height: 1412,
          paddingTop: 200,
          '& .card_title': {
            display: 'flex',
            width: 520,
            height: 120,
            borderRadius: 60,
          },
          '& .yes_icon': {
            width: 80,
            height: 80,
            background: `url(${yes}) center/contain no-repeat`,
            marginRight: 20,
            marginLeft: 15,
          },
          '& .no_icon': {
            width: 60,
            height: 60,
            background: `url(${no}) center/contain no-repeat`,
            marginRight: 20,
            marginLeft: 30,
          },
          '& .title': {
            fontSize: 64,
            fontWeight: 'bold',
          },
          '& .card_image': {
            width: 420,
            height: 420,
            borderRadius: 80,
            marginTop: 80,
          },
          '& .explan_message': {
            fontSize: 40,
            fontWeight: 'bold',
            width: 840,
            height: 468,
            textAlign: 'center',
            color: '#000000',
            overflow: 'hidden',
            padding: '0 10px',
            marginTop: 50,
          },
        },
      },
      '& .adult_bg': {
        position: 'absolute',
        width: 1080,
        height: 1920,
        left: 0,
        background: `url(${ChildBg}) center no-repeat`,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        '& .card': {
          position: 'relative',
          top: 326,
          background: `url(${ExplanationBg}) center/cover no-repeat`,
          width: 920,
          height: 1412,
          paddingTop: 200,
          '& .card_title': {
            display: 'flex',
            width: 520,
            height: 120,
            borderRadius: 60,
          },
          '& .yes_icon': {
            width: 80,
            height: 80,
            background: `url(${yes}) center/contain no-repeat`,
            marginRight: 20,
            marginLeft: 15,
          },
          '& .no_icon': {
            width: 60,
            height: 60,
            background: `url(${no}) center/contain no-repeat`,
            marginRight: 20,
            marginLeft: 30,
          },
          '& .title': {
            fontSize: 64,
            fontWeight: 'bold',
          },
          '& .card_image': {
            width: 420,
            height: 420,
            borderRadius: 80,
            marginTop: 80,
          },
          '& .explan_message': {
            fontSize: 40,
            fontWeight: 'bold',
            width: 840,
            height: 468,
            textAlign: 'center',
            color: '#000000',
            padding: '0 10px',
            marginTop: 50,
          },
        },
      },
    },
  })
);

const QuizReadyExplanation = () => {
  const classes = useStyles();
  const history = useHistory();

  const dispatch = useDispatch();
  const answerTitle = ['A', 'B', 'C', 'D'];

  const scenesType = useSelector((state: RootState) => state.scenes.type);

  const questions = useSelector<RootState, Question[]>(
    (state) => state.quiz.questions
  );
  const current = useSelector<RootState, number>((state) => state.quiz.current);
  const choose = useSelector<RootState, number | undefined>(
    (state) => state.quiz.choose
  );

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (current + 1 < questions.length) {
        dispatch(setCurrent(current + 1));
        dispatch(setChoose(undefined));
        history.push('quizQuestions');
      } else {
        history.push('quizReadyScore');
      }
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  });

  useFootControl({
    intitialIndex: 0,
    actions: [],
    goBack: () => history.push('menu'),
  });

  return (
    <>
      {scenesType === 'child' ? (
        <Box className={classes.app_content}>
          <Box className="child_bg">
            <Grid
              container
              direction="column"
              alignItems="center"
              className="card"
            >
              <Grid
                item
                direction="row"
                alignItems="center"
                className="card_title"
                style={{
                  background:
                    choose === questions[current]?.apply
                      ? '#42DC76'
                      : '#FF5CB8',
                }}
              >
                <Box
                  className={
                    choose === questions[current]?.apply
                      ? 'yes_icon'
                      : 'no_icon'
                  }
                ></Box>
                <Typography className="title">
                  {choose === questions[current]?.apply
                    ? 'せいかい！'
                    : 'ふせいかい！'}
                </Typography>
              </Grid>
              <img
                className="card_image"
                src={
                  questions[current]?.url
                    ? questions[current]?.url
                    : quizDefault
                }
              />
              <Typography className="explan_message">
                {questions[current]?.explanation
                  .replaceAll('。', '。\n')
                  .replaceAll('？', '？\n')}
              </Typography>
            </Grid>
          </Box>
        </Box>
      ) : (
        <Box className={classes.app_content}>
          <Box className="adult_bg">
            <Grid
              container
              direction="column"
              alignItems="center"
              className="card"
            >
              <Grid
                item
                direction="row"
                alignItems="center"
                className="card_title"
                style={{
                  background:
                    choose === questions[current]?.apply
                      ? '#42DC76'
                      : '#FF5CB8',
                }}
              >
                <Box
                  className={
                    choose === questions[current]?.apply
                      ? 'yes_icon'
                      : 'no_icon'
                  }
                ></Box>
                <Typography className="title" style={{ marginLeft: '20px' }}>
                {choose === questions[current]?.apply
                      ? '正解！'
                      : '不正解'}
                </Typography>
              </Grid>
              <img
                className="card_image"
                src={
                  questions[current]?.url
                    ? questions[current]?.url
                    : quizDefault
                }
              />
              <Typography className="explan_message">
                {questions[current]?.explanation
                  .replaceAll('。', '。\n')
                  .replaceAll('？', '？\n')}
              </Typography>
            </Grid>
          </Box>
        </Box>
      )}
    </>
  );
};

export default QuizReadyExplanation;

export { QuizReadyExplanation };
