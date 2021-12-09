import React, { useCallback } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Box, Typography } from '@material-ui/core';
import { RootState } from '../../features';
import { useDispatch, useSelector } from 'react-redux';
import { useModeExercise } from './useModeExercise';
import { setResult } from '../../features/Exercise/reducer';
import { enableCursor } from '../../features/Handtracking/reducer';
import { useMediapipe } from '../../components/common/useMediapipe';
import EncouragementText from './assets/15_Calories_Burnt/EncouragementText.png';
import CounterBackground from './assets/15_Calories_Burnt/CounterBackground.png';
import SquatCheerUp from './assets/squat_cheer_up.gif';
import RunningCheerUp from './assets/running_cheer_up.png';
import useFootControl from '../../components/common/hook/useFootControl';

const useStyles = makeStyles(() =>
  createStyles({
    app_content: {
      width: '1080px',
      height: '1920px',
      top: 0,
      left: 0,
      position: 'fixed',
      '& .background': `
        position: absolute;
        width: 1080px;
        height: 1920px;
        left: 0px;
        background: rgba(254, 215, 119, 1);
      `,
      '& .encouragement': `
        position: absolute;
        top: 267px;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, 0%);
      `,
      '& .counterCircle': `
        position: absolute;
        top: 665px;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, 0%);
      `,
      '& .counterLabel': `
        position: absolute;
        top: 1060px;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, 0%);
        font-size: 52px;
        font-weight: 800;
        text-shadow: 5px 8px 0px #000000;
      `,
      '& .cheerUp': `
        position: absolute;
        top: 1120px;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, 0%);
      `,
    },
    countText: `
      position: absolute;
      top: 0;
      left: 50%;
      margin-right: -50%;
      transform: translate(-50%, 0%);
      width: 440px;
      height: 440px;
      font-family: Dosis;
      font-style: normal;
      font-weight: 800;
      font-size: 192.757px;
      line-height: 440px;
      text-align: center;
      vertical-align: middle;
      letter-spacing: 0.05em;
      color: #FFFFFF;
    `,
  })
);

const CaloriesBurnt = () => {
  const history = useHistory();
  const counts = useSelector<RootState, number | undefined>(
    (state) => state.exercise.data?.counts
  );
  const { mode, config, scenesType } = useModeExercise();
  const classes = useStyles();
  const { mpCommands } = useMediapipe();

  const dispatch = useDispatch();

  const win = useCallback(
    (counts: number) => {
      return counts >= config.target.value;
    },
    [config]
  );

  React.useEffect(() => {
    mpCommands.neutralMode();

    const timeout = setTimeout(() => {
      // if (counts && win(counts)) {
      dispatch(setResult('success'));
      history.push('success');
      // }
      // else {
      //   dispatch(setResult('failure'));
      //   history.push('failure');
      // }
      dispatch(enableCursor());
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useFootControl({
    goBack: () => history.push('menu'),
  });

  return (
    <>
      <Box className={classes.app_content}>
        <Box className="background" />
        <Box className="encouragement">
          <img src={EncouragementText} />
        </Box>
        <Box className="counterCircle">
          <img src={CounterBackground} />
          <Typography className={classes.countText}>{counts}</Typography>
        </Box>
        <Typography className="counterLabel">
          {mode === 'squat'
            ? 'スクワット回数'
            : scenesType === 'child'
            ? 'コインかくとく数'
            : 'コイン獲得数'}
        </Typography>

        <Box className="cheerUp">
          {scenesType !== 'child' && mode === 'squat' ? (
            <img width="800px" height="800px" src={SquatCheerUp} />
          ) : (
            mode !== 'squat' && (
              <img
                src={RunningCheerUp}
                style={{ position: 'relative', top: 150 }}
              />
            )
          )}
        </Box>
      </Box>
    </>
  );
};

export default CaloriesBurnt;

export { CaloriesBurnt };
