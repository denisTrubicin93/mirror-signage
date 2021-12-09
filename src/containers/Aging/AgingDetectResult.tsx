import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Box, Grid, Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../features';
import { BACKGROUND, ICON_TEXT_BUTTON } from '../common/styles';
import useFootControl from '../../components/common/hook/useFootControl';
import GenerationIcon from './assets/generation_icon.png';
import CheckIcon from '../common/assets/Capture_Photo/camera_check_icon.png';
import MiddleBar from '../../components/common/MiddleBar';
import { actions } from '../../features/Aging/reducer';

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
        backgroud: 'linear-gradient(180deg, #33FF54 0%, #23CD53 100%);',
        '& .result_title': {
          fontSize: 80,
          fontWeight: 800,
          color: '#333333',
          position: 'absolute',
          top: 150,
        },
        '& .result_age_gender': {
          fontSize: 144,
          fontWeight: 800,
          color: '#333333',
          position: 'absolute',
          top: 295,
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
            maxHeight: '50%',
            maxWidth: '50%',
          },
        },
        '& .btn_active': {
          border: '16px solid #613BFF',
        },
        '& .gesture_bar': {
          position: 'relative',
          top: 1680,
          width: 920,
          height: 160,
          borderRadius: 24,
          background: 'linear-gradient(90deg, #613BFF 0%, #3B76FF 100%)',
          justifyContent: 'space-between',
          padding: '0 20px'
        },
      },
    },
  })
);

function AgingDetectResult(props: any) {
  const history = useHistory();
  const classes = useStyles();
  const profile = useSelector((state: RootState) => state.person.profile);
  const detectResult = props.location?.state?.detectResult;
  const dispatch = useDispatch()

  const buttons: any[] = [
    {
      centerTitle: '年齢変更',
      icon: GenerationIcon,
      onTap: () => history.push('agingChangeAge'),
    },
    {
      centerTitle: 'OK',
      icon: CheckIcon,
      onTap: () => {
        dispatch(actions.fetchAgingImages())
        history.push('agingAdvert')
      },
    },
  ];

  const buttonActions = buttons.map((x: any) => x.onTap as Function);

  const { currentIndex, onTap, onHover } = useFootControl({
    intitialIndex: 1,
    actions: [...buttonActions],
    goBack: () => history.push('menu'),
  });

  const buttonClasses = (index: number) => {
    return currentIndex === index ? 'btn btn_active' : 'btn';
  };

  return (
    <>
      <Box className={classes.app_content}>
        <Box className="background">
          <Typography className="result_title">自動測定結果</Typography>
          <Typography className="result_age_gender">
            {detectResult == 'fail' ? '測定失敗!' : `${profile.age}歳`}
          </Typography>
          <Grid
            container
            direction="row"
            justify="space-between"
            style={{ width: 920, position: 'absolute', top: 780 }}
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
          <MiddleBar
            title="操作パッドの右・左を"
            subTitle="足で踏んで選んでね"
            className="gesture_bar"
          />
        </Box>
      </Box>
    </>
  );
}

export default AgingDetectResult;
