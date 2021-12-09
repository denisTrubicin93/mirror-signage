import React, { useRef, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { BACKGROUND } from '../common/styles';
import { Box, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import SmileFace from './assets/survey.gif';
import Body from '../common/assets/Capture_Photo/body2.png';
import { dataURItoBlob } from '../../service/Base64Utils';
import { FaceClient } from '@azure/cognitiveservices-face';
import { CognitiveServicesCredentials } from '@azure/ms-rest-azure-js';
import { useDispatch } from 'react-redux';
import { setAge, setGender } from '../../features/Person/reducer';

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
        background: '#ffffff',
        '& .stream_image': {
          position: 'absolute',
          width: 1024,
          height: 768,
          visibility: 'hidden',
          top: 200,
        },
        '& .survey_gif': {
          width: 1000,
          height: 1000,
          position: 'absolute',
          top: 200,
        },
        '& .animation_text': {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          position: 'absolute',
          top: 1400,
          justifyContent: 'center',
          alignItems: 'center',
        },
        '& .blink_text': {
          animation: '$blinker 2s linear infinite',
          fontSize: 72,
          fontWeight: 800,
          color: '#000000',
        },
      },
    },
    '@keyframes blinker': {
      '50%': {
        opacity: 0,
      },
    },
  })
);

export enum MIRROR_CONTENT {
  CHILD_TEMPLE_GAME,
  CHILD_SQUAT_GAME,
  CHILD_FLAG_GAME,
  CHILD_QUIZ,
  ADULT_TEMPLE_GAME,
  ADULT_SQUAT_GAME,
  ADULT_FLAG_GAME,
  ADULT_QUIZ,
  ADULT_SKIN_AGE,
  ADULT_COMPATIBILITY,
  ADULT_INSURANCE,
  ADULT_FACE_READING,
  ADULT_OMIKUJI,
  ADULT_AGING,
  ADULT_AFLAC_JP_POST,
  UNKNOWN,
}

export enum USER_REVIEW {
  GOOD,
  SOSO,
  NOTGOOD,
}

export default function SurveyCapturePhoto(props: any) {
  const classes = useStyles();
  const history = useHistory();
  const imgRef = useRef({} as any);
  const [pic, setPic] = React.useState('');
  const dispatch = useDispatch();
  const content = props.location?.state?.content;

  useEffect(() => {
    const timeId = setTimeout(() => {
      capture();
    }, 4000);

    return () => clearTimeout(timeId);
  }, []);

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
      handleDetectPhoto(base64);
    } else {
      console.log('カメラが占有されています！');
      // handleDetectPhoto(Body);
      history.push('menu');
    }
  };

  const handleDetectPhoto = (photo: string) => {
    const blob = dataURItoBlob(photo);
    const faceKey = 'c5cfb579faba4338bd07c2791ec7bdc9';
    const faceEndPoint = 'https://mirror-develop.cognitiveservices.azure.com/';
    const cognitiveServiceCredentials = new CognitiveServicesCredentials(
      faceKey
    );
    const client = new FaceClient(cognitiveServiceCredentials, faceEndPoint);
    const options: any = {
      returnFaceAttributes: ['age', 'gender'],
    };
    client.face.detectWithStream(blob, options).then((result: any) => {
      if (result[0]?.faceAttributes?.age) {
        dispatch(setAge(result[0].faceAttributes.age));
        dispatch(setGender(result[0].faceAttributes.gender));
        history.push({ pathname: 'surveyReview', state: { content } });
      }
    });
  };

  return (
    <>
      <Box className={classes.app_content}>
        <Box className="background">
          <img
            className="stream_image"
            src="http://localhost:8090/vid"
            alt="http://localhost:8090/vid"
            ref={imgRef}
          />
          <img src={SmileFace} className="survey_gif" />
          <Box className="animation_text">
            <Typography className="blink_text">
              アンケートが始まります！
            </Typography>
            <br />
            <br />
            <Typography className="blink_text">性別・年齢自動判定中</Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}
