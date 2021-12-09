import React, { useEffect, useRef } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Grid } from '@material-ui/core';
import captureBorder from './assets/Capture_Photo/capture_border.png';
import { BACKGROUND, COUNTER, ICON_TEXT_BUTTON } from './styles';
import CameraIcon from './assets/Capture_Photo/camera_icon.gif';
import TimerCountdown from '../../components/common/TimerCountdown';
import CameraCheckIcon from './assets/Capture_Photo/camera_check_icon.png';
import CameraResetIcon from './assets/Capture_Photo/camera_reset_icon.png';
import useFootControl from '../../components/common/hook/useFootControl';
import Body from './assets/Capture_Photo/body2.png'

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
        background: '#000000',
        '& .camera_arrow_up_icon': {
          width: 80,
          height: 80,
          animation: '$bounce 2s infinite',
          position: 'absolute',
          top: 30,
        },
        '& .camera_icon': {
          width: 133,
          height: 100,
          position: 'absolute',
          top: 120,
        },
        '& .camera_tips': {
          position: 'absolute',
          top: 50,
          fontSize: 72,
          color: '#ffffff',
          '-webkit-text-stroke': 'medium',
          strokeWidth: 1,
        },
        '& .camera_frame': {
          position: 'absolute',
          width: '100%',
          height: 1540,
          borderRadius: 70,
          boxSizing: 'border-box',
          top: 100,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '& .capture_border': {
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 100,
            background: `url(${captureBorder}) no-repeat center`,
          },
          '& .capture_image': {
            width: 1024,
            height: 768,
          },
          '& .stream_image': {
            position: 'absolute',
            width: 1024,
            height: 768,
            visibility: 'hidden',
          },
        },
        '& .counter': {
          ...COUNTER,
          position: 'absolute',
          top: 1440,
        },
      },
      '& .btn': {
        ...ICON_TEXT_BUTTON,
        '& .center_title': {
          fontSize: 48,
          color: '#333333',
          fontWeight: 800,
          marginTop: 20,
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
    '@keyframes bounce': {
      '0%, 20%, 50%, 80%, 100%': {
        transform: 'translateY(0)',
      },
      '40%': {
        transform: 'translateY(30px)',
      },
      '60%': {
        transform: 'translateY(15px)',
      },
    },
  })
);

interface CapturePhotoProps {
  onNext: Function;
  background?: string;
  confirmTitle?: string;
}

const totalSeconds = 5;

const CapturePhoto = (props: CapturePhotoProps) => {
  const classes = useStyles();
  const history = useHistory();

  const [pic, setPic] = React.useState('');
  const [done, setDone] = React.useState(false);
  const imgRef = useRef({} as any);

  const capture = async () => {
    const img = imgRef?.current as any;
    let base64 = '';
    if (img && img.src) {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx!.drawImage(img, 0, 0, img.width, img.height);
      base64 = canvas.toDataURL('image/jpeg', 1.0);
    }

    if (base64) {
      setPic(base64);
    } else {
      console.log('カメラが占有されています！');
      // setPic(Body);
      history.push('menu');
    }
  };

  const onShoot = () => {
    if (!done) {
      setDone(true);
      capture();
    }
  };

  const buttons: any[] = [
    {
      centerTitle: '取り直し',
      icon: CameraResetIcon,
      onTap: () => {
        setPic('');
        setDone(false);
      },
    },
    {
      centerTitle: 'OK',
      icon: CameraCheckIcon,
      onTap: () => props.onNext(pic),
    },
  ];

  const { currentIndex, onTap, onHover } = useFootControl({
    intitialIndex: 1,
    actions: buttons.map((x: any) => x.onTap as Function),
    goBack: () => history.push('menu'),
  });

  const buttonClasses = (index: number) => {
    return currentIndex === index ? 'btn btn_active' : 'btn';
  };

  useEffect(() => {
    function resetButtonIndex() {
      onHover(1);
    }

    if (!pic) {
      resetButtonIndex();
    }
  }, [pic]);

  return (
    <>
      <Box className={classes.app_content}>
        <Box className="background" style={{ background: props.background }}>
          {!pic && (
            <>
              <img width="400px" height="400px" src={CameraIcon} />
              <Typography className="camera_tips">
                判定中
              </Typography>
            </>
          )}
          {pic && props.confirmTitle && (
            <Typography className="camera_tips" style={{top: 250}}>
              {props.confirmTitle}
            </Typography>
          )}

          <Box className="camera_frame">
            {!pic && <Box className="capture_border" />}
            {pic && (
              <Box
                className="capture_image"
                style={{ background: `url(${pic}) no-repeat center/cover` }}
              />
            )}
            <img
              className="stream_image"
              src="http://localhost:8090/vid"
              alt="http://localhost:8090/vid"
              ref={imgRef}
            />
          </Box>

          {!pic && (
            <TimerCountdown
              className="counter"
              seconds={totalSeconds}
              onShoot={onShoot}
            />
          )}

          {pic && (
            <Grid
              container
              direction="row"
              justify="space-between"
              style={{ width: 900, position: 'absolute', top: 1400 }}
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
          )}
        </Box>
      </Box>
    </>
  );
};

export default CapturePhoto;

export { CapturePhoto };
