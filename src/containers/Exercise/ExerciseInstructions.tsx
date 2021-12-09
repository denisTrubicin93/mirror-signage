import React, { useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Grid } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import {
  sendMessageAction,
} from '../../features/Websocket/reducer';
import { setCount } from '../../features/Exercise/reducer';
import { disableCursor } from '../../features/Handtracking/reducer';
import TimerCountdown from '../../components/common/TimerCountdown';
import { useModeExercise } from './useModeExercise';

import GameInstructionLabel from './assets/5_Exercise_Instructions/GameInstructionLabel.png';
import counterBackground from './assets/squat/counterBackground.png';
import useFootControl from '../../components/common/hook/useFootControl';
import useSound from 'use-sound';
import squatInstructionVoice from './assets/squat_instruction.mp3';
import flagInstructionVoice from './assets/flag_instruction.mp3';
import { HookOptions } from 'use-sound/dist/types';

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
      '& .choose_app_title': `
        position: absolute;
        top: 568px;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, 10%);
        font-family: "Rounded Mplus 1c";
        font-style: normal;
        font-weight: 800;
        font-size: 96px;
        line-height: 143px;
        text-align: center;
        vertical-align: middle;
        letter-spacing: -0.04em;
        color: #FFFFFF;
        z-index: 10;
      `,
      '& .instructions': `
        position: absolute;
        width: 810px;
        height: 390px;
        left: 152px;
        top: 700px;
        z-index: 1;
      `,
      '& .instructions_back': `
        position: absolute;
        width: 920px;
        height: 560px;
        left: 80px;
        top: 640px;
        background: #FFE8AD;
        border: 20px solid #000000;
        border-radius: 32px;
      `,
      '& .instructions_back:before': `
        position: absolute;
        top: 10px;
        left: 10px;
        width: 900px;
        height: 540px;
        background: #FEC05E;
        content: '';
        border-radius: 8px;
      `,
      '& .instructions_text2': `
        font-family: 'Rounded Mplus 1c';
        font-style: normal;
        font-weight: 800;
        font-size: 56px;
        line-height: 140%;
        text-align: center;
        color: #000000;
      `,
      '& .exercise_icon': `
        position: absolute;
        top: 326px;
        left: 50%;
        width: 320px;
        height: 320px;
        margin-right: -50%;
        transform: translate(-50%, 0%);
        z-index: 2;
      `,
      '& .counter': `
        position: absolute;
        width: 360px;
        height: 360px;
        left: 360px;
        top: 1439px;
        background: center / cover no-repeat url(${counterBackground});
      `,
    },
  })
);

const ExerciseInstructions = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { mode, config } = useModeExercise();
  const classes = useStyles();
  const defaultOptions: HookOptions = { volume: 2 };
  const [squatVoiceover] = useSound(squatInstructionVoice, defaultOptions);
  const [flagVoiceover] = useSound(flagInstructionVoice, defaultOptions);

  useEffect(() => {
    if (mode === 'squat') {
      squatVoiceover && squatVoiceover();
    } else if (mode === 'flag') {
      flagVoiceover && flagVoiceover();
    }
  }, [squatVoiceover, flagVoiceover, mode]);

  const onShoot = () => {
    if (mode === 'squat') {
      history.push('gamePlaySquat');
    } else if (mode === 'kabeana') {
      history.push('gamePlay/kabeana');
    } else if (mode === 'ball_strike') {
      history.push('gamePlay/ball');
    } else if (mode === 'running') {
      dispatch(sendMessageAction({ to: 'disconnect', message: ''}));
      history.push('gamePlayRunning');
    } else if (mode === 'flag') {
      history.push('flag');
    }
    dispatch(setCount(0));
  };

  React.useEffect(() => {
    dispatch(disableCursor());
  }, []);

  useFootControl({
    goBack: () => history.push('menu'),
  });

  return (
    <>
      <Box className={classes.app_content}>
        <Box className="background" />
        <Box className="choose_app_title">
          <img src={GameInstructionLabel} />
        </Box>
        <Box className="exercise_icon">
          <img src={config.instruction.icon} />
        </Box>
        <Box className="instructions">
          <Grid
            container
            direction="column"
            alignItems="center"
            style={{
              height: '100%',
              width: '100%',
            }}
          >
            <Grid style={{ marginTop: 40 }}>
              {config.instruction.context.map((text, index) => (
                <Typography
                  key={`instructions_${index}`}
                  style={{ marginBottom: 0 }}
                  className="instructions_text2"
                >
                  {text}
                </Typography>
              ))}
            </Grid>
          </Grid>
        </Box>
        <Box className="instructions_back" />
        <TimerCountdown
          className="counter"
          seconds={3}
          onShoot={onShoot}
          textStyle={{
            fontFamily: 'Rounded Mplus 1c',
            fontStyle: 'normal',
            fontWeight: 800,
            fontSize: '144px',
            lineHeight: '214px',
            color: '#FFFFFF',
          }}
        />
      </Box>
    </>
  );
};

export default ExerciseInstructions;

export { ExerciseInstructions };
