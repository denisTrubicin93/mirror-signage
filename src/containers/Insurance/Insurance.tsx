import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Grid } from '@material-ui/core';
import { RootState } from '../../features';
import { DeviceService } from '../../service/DeviceService';
import Iframe from '../../components/common/Iframe';
import { BACKGROUND, ICON_TEXT_BUTTON } from '../common/styles';
import MiddleBar from '../../components/common/MiddleBar';
import useFootControl from '../../components/common/hook/useFootControl';
import { messageAction2 } from '../../features/Websocket/reducer';
import { ButtonPoint } from '../../features/Button/models';
import { getCurrentPoint } from '../../features/Button/reducer';
import BackIcon from '../Entertainment/assets/Common/back.png';
import { ipcRenderer } from 'electron';
import { MIRROR_CONTENT } from '../Survey/SurveyCapturePhoto';
import SurveyIcon from '../Entertainment/assets/Common/survey.png';

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
        '& .iframe': {
          position: 'absolute',
          width: 1080,
          height: 1265,
          top: 0,
          overflow: 'hidden',
          '& iframe': `
            top: 0 !important;
          `,
        },
        '& .btn': {
          ...ICON_TEXT_BUTTON,
          '& .center_title': {
            fontSize: 48,
            color: '#333333',
            fontWeight: 800,
            position: 'relative',
            top: 30,
          },
          '& .icon': {
            maxHeight: '45%',
            maxWidth: '45%',
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
          padding: '0 20px',
        },
      },
    },
  })
);

function Insurance(props: any) {
  const history = useHistory();
  const classes = useStyles();
  const profile = useSelector((state: RootState) => state.person.profile);
  const insurance = useSelector((state: RootState) => state.insurance);
  const iframeRef = useRef(null);

  const urlIndex = insurance.urlIndex ?? 0;
  const type = insurance.type;

  const callStaff = () => {
    DeviceService.default().callStaff();
  };

  useFootControl({
    intitialIndex: 0,
    goBack: () => history.push('insuranceChoose'),
  });

  const footPoint = useSelector(getCurrentPoint) as ButtonPoint;

  useEffect(() => {
    switch (footPoint) {
      case ButtonPoint.L1:
        ipcRenderer.send('scroll-up', '');
        break;
      case ButtonPoint.L2:
        ipcRenderer.send('scroll-down', '');
        break;
      default:
        break;
    }
  }, [footPoint]);

  const dispatch = useDispatch();

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
          state: { content: MIRROR_CONTENT.ADULT_INSURANCE },
        }),
    },
  ];

  const { currentIndex, onTap, onHover } = useFootControl({
    intitialIndex: 0,
    actions: buttons.map((x: any) => x.onTap as Function),
    goBack: () => history.push('insuranceChoose'),
  });

  const buttonClasses = (index: number) => {
    return currentIndex === index ? 'btn btn_active' : 'btn';
  };

  useEffect(() => {
    ipcRenderer.send('create-insurance-browserview', {
      urlIndex: urlIndex,
      age: profile.age,
      gender: profile.gender,
      type: type,
    });

    return () => {
      ipcRenderer.send('quit-insurance-browserview', '');
    };
  }, []);

  return (
    <>
      <Box className={classes.app_content}>
        <Box
          className="background"
          onClick={() => dispatch(messageAction2(ButtonPoint.L2))}
        >
          <Grid
            container
            direction="row"
            justify="space-between"
            style={{ width: 930, position: 'absolute', top: 1290 }}
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
            title="足操作の右・左を"
            subTitle="踏んでスクロールしてね"
            className="gesture_bar"
          />
        </Box>
      </Box>
    </>
  );
}

export default Insurance;
