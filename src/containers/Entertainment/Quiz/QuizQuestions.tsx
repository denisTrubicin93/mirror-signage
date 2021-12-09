import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../features';
import { Question } from '../../../features/Quiz/models';
import {
  setOk,
  setNg,
  setChoose,
} from '../../../features/Quiz/reducer';
import { useQuiz } from './useQuiz';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import ChildBg from '../assets/Quiz/main_bg.png';
import QuestionBoxBg from '../assets/Quiz/question_box.png';
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
        '& .loading_text_child': {
          position: 'absolute',
          left: 832,
          top: 146,
          fontFamily: 'Noto Sans JP',
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: 52,
          color: '#FFFFFF',
        },
        '& .child_question_box': {
          width: 920,
          height: 823,
          backgroundImage: `url(${QuestionBoxBg})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          position: 'relative',
          top: 348,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: 100,
          boxSizing: 'border-box',
          '& .child_question_title': {
            fontSize: 64,
            fontWeight: 'bold',
            fontFamily: 'Noto Sans JP',
            fontStyle: 'normal',
            color: '#000000',
            width: '80%',
            height: '80%',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
        },
        '& .child_answer_box': {
          width: 920,
          position: 'relative',
          top: 350,
          padding: '0 40px',
          '& .child_answer_card': {
            width: 360,
            height: 400,
            borderRadius: 32,
            boxShadow: '0px 4px 40px rgba(0, 0, 0, 0.25)',
            border: '20px solid #ffffff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '& .answer_text': {
              fontSize: 48,
              fontWeight: 800,
            },
          },
          '& .child_answer_card_active': {
            border: '20px solid #613BFF',
          },
          '& .yes_icon': {
            width: 140,
            height: 140,
            background: `url(${yes}) center/contain no-repeat`,
          },
          '& .no_icon': {
            width: 120,
            height: 120,
            background: `url(${no}) center/contain no-repeat`,
          },
        },
        '& .tips_text_child': {
          position: 'relative',
          top: 420,
          fontFamily: 'Noto Sans JP',
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: 80,
          color: '#FFFFFF',
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
        '& .loading_text_adult': {
          position: 'absolute',
          left: 810,
          top: 1615,
          fontFamily: 'Noto Sans JP',
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: 52,
          color: '#FFFFFF',
        },
        '& .adult_question_box': {
          width: 920,
          height: 823,
          backgroundImage: `url(${QuestionBoxBg})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          position: 'relative',
          top: 50,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: 100,
          boxSizing: 'border-box',
          '& .adult_question_title': {
            fontSize: 64,
            fontWeight: 'bold',
            fontFamily: 'Noto Sans JP',
            fontStyle: 'normal',
            color: '#000000',
            width: '80%',
            height: '80%',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
        },
        '& .adult_answer_box': {
          width: 920,
          position: 'relative',
          top: 50,
          padding: '0 40px',
          '& .adult_answer_card': {
            width: 360,
            height: 400,
            borderRadius: 32,
            boxShadow: '0px 4px 40px rgba(0, 0, 0, 0.25)',
            border: '20px solid #ffffff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '30px',
            '& .answer_text': {
              fontSize: 48,
              fontWeight: 800,
            },
          },
          '& .adult_answer_card_active': {
            border: '20px solid #613BFF',
          },
          '& .adult_answer_title': {
            fontSize: 48,
            fontWeight: 'bold',
            fontFamily: 'Noto Sans JP',
            fontStyle: 'normal',
            color: '#000000',
            textAlign: 'center',
            width: '80%',
            height: 210,
            overflow: 'hidden',
            alignContent: 'center',
            alignItems: 'center',
            bottom: 70,
          },
        },
        '& .tips_text_child': {
          position: 'relative',
          top: 420,
          fontFamily: 'Noto Sans JP',
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: 80,
          color: '#FFFFFF',
        },
      },
    },
  })
);

const QuizQuestions = () => {
  const classes = useStyles();
  const history = useHistory();
  const { config } = useQuiz();

  const allSeconds = 15;
  const [seconds, setSeconds] = React.useState(allSeconds);

  const dispatch = useDispatch();
  const scenesType = useSelector((state: RootState) => state.scenes.type);
  const questions = useSelector<RootState, Question[]>(
    (state) => state.quiz.questions
  );
  const ok = useSelector<RootState, number>((state) => state.quiz.ok);
  const ng = useSelector<RootState, number>((state) => state.quiz.ng);
  const current = useSelector<RootState, number>((state) => state.quiz.current);
  const choose = useSelector<RootState, number | undefined>(
    (state) => state.quiz.choose
  );

  const handleChoose = (chooseIndex: number) => {
    dispatch(setChoose(chooseIndex));
    if (chooseIndex === questions[current]?.apply) {
      dispatch(setOk(ok + 1));
    } else {
      dispatch(setNg(ng + 1));
    }
    history.push('QuizReadyExplanation');
  };

  const tick = () => {
    if (seconds === 1) {
      dispatch(setNg(ng + 1));
      history.push('QuizReadyExplanation');
    } else if (seconds > 1) {
      setSeconds(seconds - 1);
    }
  };
  React.useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return () => clearInterval(timerID);
  });

  const timerRendered = () => {
    const styled: CSSProperties =
      scenesType === 'child'
        ? {
            left: '786.83px',
            top: '76.83px',
            position: 'absolute',
          }
        : {
            left: '756.83px',
            top: '1545.83px',
            position: 'absolute',
          };

    return (
      <>
        <svg
          width="216"
          height="216"
          viewBox="0 0 260 260"
          fill="none"
          style={styled}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 251,130 M 251 130 a 121 121 0 1 0 0 1"
            stroke="#EEE6FE88"
            fillOpacity="0"
            strokeLinecap="round"
            strokeWidth="4"
            opacity="1"
          />
          <path
            d="M 251,130 M 251 130 a 121 121 0 1 0 0 1"
            stroke="url(#paint0_linear)"
            fillOpacity="0"
            strokeLinecap="round"
            strokeWidth="18"
            opacity="1"
            style={{
              strokeDasharray: `${(760 * seconds) / allSeconds}, ${
                760 * (1 - seconds / allSeconds)
              }`,
              strokeDashoffset: 0,
              transition: 'stroke-dasharray 0.3s ease 0s',
            }}
          />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="0.19519"
              y1="129.999"
              x2="259.806"
              y2="129.999"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#EC008C" />
              <stop offset="1" stopColor="#FC6767" />
            </linearGradient>
          </defs>
        </svg>
        <Typography className={`loading_text_${scenesType}`}>
          {Math.floor(seconds / 60) % 10}:{Math.floor(seconds / 10) % 6}
          {seconds % 10}
        </Typography>
      </>
    );
  };

  const buttonActions: any[] = questions[current]?.answer?.map((_, index) => {
    return { onTap: () => handleChoose(index) };
  });

  const { currentIndex, onTap, onHover } = useFootControl({
    intitialIndex: 0,
    actions: buttonActions ? buttonActions.map((x) => x.onTap as Function) : [],
    goBack: () => history.push('menu'),
  });

  const buttonClasses = (index: number) => {
    return index === currentIndex
      ? 'child_answer_card child_answer_card_active'
      : 'child_answer_card';
  };

  const buttonAdultClasses = (index: number) => {
    return index === currentIndex
      ? 'adult_answer_card adult_answer_card_active'
      : 'adult_answer_card';
  };

  return (
    <>
      {scenesType === 'child' ? (
        <Box className={classes.app_content}>
          <Box className="child_bg">
            {timerRendered()}
            <Box className="child_question_box">
              <Typography className="child_question_title">
                {questions[current]?.question}
              </Typography>
            </Box>
            <Grid
              className="child_answer_box"
              container
              direction="row"
              justify="space-between"
            >
              {questions[current]?.answer.map((answer, index) => (
                <Box
                  className={buttonClasses(index)}
                  onClick={() => onTap(index)}
                  onMouseOver={() => onHover(index)}
                  key={index}
                  style={{
                    background: answer === 'TRUE' ? '#42DC76' : '#FF5CB8',
                  }}
                >
                  {answer === 'TRUE' ? (
                    <Box className="yes_icon"></Box>
                  ) : (
                    <Box className="no_icon"></Box>
                  )}
                </Box>
              ))}
            </Grid>

            <Typography className="tips_text_child">
              {current + 1}/{config.COUNT}もん
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box className={classes.app_content}>
          <Box className="adult_bg">
            {timerRendered()}
            <Box className="adult_question_box">
              <Typography className="adult_question_title">
                {questions[current]?.question.length > 20
                  ? questions[current]?.question.substring(0, 20).concat('...?')
                  : questions[current]?.question}
              </Typography>
            </Box>
            <Grid
              className="adult_answer_box"
              container
              direction="row"
              justify="space-between"
            >
              {questions[current]?.answer.map((answer, index) => (
                <Box
                  className={buttonAdultClasses(index)}
                  onClick={() => onTap(index)}
                  onMouseOver={() => onHover(index)}
                  key={index}
                  style={{
                    background: '#FFFFFF',
                  }}
                >
                  <Typography className="adult_answer_title">
                    {answer}
                  </Typography>
                </Box>
              ))}
            </Grid>

            <Typography className="tips_text_child">
              {current + 1}/{config.COUNT}もん
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default QuizQuestions;

export { QuizQuestions };
