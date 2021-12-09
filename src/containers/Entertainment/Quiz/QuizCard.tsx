import React from 'react';
import {
  makeStyles,
  createStyles,
  Box,
  Dialog,
  Grid,
  Typography,
} from '@material-ui/core';
import { BACKGROUND } from '../../common/styles';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../../features';
import { DeviceService } from '../../../service/DeviceService';
import { addContent } from '../../../service/DigitalAvatarService';
import { useTimeout } from '../../../components/common/hook/useTimeout';
import useFootControl from '../../../components/common/hook/useFootControl';
import Loading from '../../../components/common/Loading';
import Scanner from '../assets/Quiz/scanner.png';
import ChildCardInsuranceTitle from '../assets/Quiz/child_card_title.png';
import AdultCardInsuranceTitle from '../assets/Quiz/adult_card_title.png';
import MainBg from '../assets/Quiz/main_bg.png';

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
        background: `url(${MainBg}) center no-repeat`,
        '& .title': {
          width: 900,
          height: 286,
          position: 'absolute',
          top: 160,
        },
        '& .scanner': {
          position: 'absolute',
          top: 555,
          width: 1000,
          height: 1000,
          left: -25,
        },
      },
    },
    error_msg: {
      fontFamily: 'Noto Sans JP',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 45,
      textAlign: 'center',
    },
  })
);

export const QuizCard = () => {
  const classes = useStyles();
  const history = useHistory();

  const scenesType = useSelector((state: RootState) => state.scenes.type);
  const ok = useSelector<RootState, number>((state) => state.quiz.ok);
  const ng = useSelector<RootState, number>((state) => state.quiz.ng);
  const quiz = useSelector((state: RootState) => state.quiz);

  const content = {
    points: 20,
    mirrorID: DeviceService.default().deviceId(),
    contentID: 'quiz',
    coins: 20,
    content: JSON.stringify({
      ok: ok,
      ng: ng,
      questions: quiz.questions,
    }),
  };

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const showErrorAwhile = () => {
    setError(true);
    setTimeout(() => {
      setError(false);
      history.push({
        pathname: '/quizQRCodeScan',
        state: { recordId: undefined },
      });
    }, 3000);
  };

  const handleSaveClick = () => {
    setLoading(true);
    addContent(content)
      .then(function (response: any) {
        history.push({
          pathname: '/quizQRCodeScan',
          state: { recordId: response.data.recordId },
        });
      })
      .catch(function (error: any) {
        setLoading(false);
        showErrorAwhile();
        setErrorMsg('エラー, もう一度試してください');
      });
  };

  useTimeout(handleSaveClick, 5000);

  useFootControl({
    goBack: () => history.push('menu'),
  });

  return (
    <>
      <Box className={classes.app_content}>
        <Box className="background">
          <img
            className="title"
            src={
              scenesType === 'child'
                ? ChildCardInsuranceTitle
                : AdultCardInsuranceTitle
            }
          />
          <img className="scanner" src={Scanner} />
        </Box>
      </Box>
      <Dialog fullScreen open={loading}>
        <Grid
          container
          alignItems="center"
          justify="center"
          style={{
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <Loading color="white" height={200} width={200} />
        </Grid>
      </Dialog>
      <Dialog fullScreen open={error}>
        <Grid
          container
          alignItems="center"
          justify="center"
          style={{
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <Typography className={classes.error_msg}>{errorMsg}</Typography>
        </Grid>
      </Dialog>
    </>
  );
};
