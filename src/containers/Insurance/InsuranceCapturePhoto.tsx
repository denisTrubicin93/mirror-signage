import React, { useRef } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Box, Typography } from '@material-ui/core';
import captureBorder from '../common/assets/Capture_Photo/capture_border.png';
import { BACKGROUND, COUNTER } from '../common/styles';
import CameraIcon from '../common/assets/Capture_Photo/camera_icon.gif';
import TimerCountdown from '../../components/common/TimerCountdown';
import useFootControl from '../../components/common/hook/useFootControl';
import Body from '../common/assets/Capture_Photo/body2.png'

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
          fontSize: 80,
          fontWeight: 800,
          color: '#ffffff',
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
        '& .webcam': {
          position: 'absolute',
          top: 420,
        },
        '& .camera_note': {
          position: 'absolute',
          top: 1310,
          fontSize: 80,
          fontWeight: 800,
          color: '#ffffff',
        },
        '& .counter': {
          ...COUNTER,
          position: 'absolute',
          top: 1440,
        },
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
}

const totalSeconds = 5;

const InsuranceCapturePhoto = (props: CapturePhotoProps) => {
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
      props.onNext(base64);
    } else {
      console.log('カメラが占有されています！');
      // setPic(Body);
      // props.onNext(Body);
      history.push('menu');
    }
  };

  const onShoot = () => {
    if (!done) {
      setDone(true);
      capture();
    }
  };

  useFootControl({
    goBack: () => history.push('menu'),
  });

  return (
    <>
      <Box className={classes.app_content}>
        <Box className="background">
          <img width="400px" height="400px" src={CameraIcon} />
          <Typography className="camera_tips">年齢測定中</Typography>
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
          <Typography className="camera_note">
            マスクを外してください
          </Typography>

          {!pic && (
            <TimerCountdown
              className="counter"
              seconds={totalSeconds}
              onShoot={onShoot}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default InsuranceCapturePhoto;

export { InsuranceCapturePhoto };
