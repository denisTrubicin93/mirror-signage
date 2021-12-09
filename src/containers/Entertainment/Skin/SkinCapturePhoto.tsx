import React from 'react';
import { useHistory } from 'react-router-dom';
import { Dialog, Grid, Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { CapturePhoto } from '../../common/CapturePhoto';
import Loading from '../../../components/common/Loading';
import { facedetect } from '../../../service/FaceplusplusService';
import { useDispatch, useSelector } from 'react-redux';
import {
  setImage,
  setFaceRectangle,
  setAttributes,
} from '../../../features/Skin/reducer';
import { Rectangle, Attributes } from '../../../features/Skin/models';

const useStyles = makeStyles(() =>
  createStyles({
    error_msg: {
      fontFamily: 'Noto Sans JP',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 45,
      textAlign: 'center',
      color: '#FFFFFF',
    },
  })
);

export default function SkinCapturePhoto() {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const showErrorAwhile = () => {
    setError(true);
    setTimeout(() => setError(false), 3000);
  };

  const handleNext = async (imageBase64: string) => {
    setLoading(true);
    console.log(imageBase64)
    dispatch(setImage(imageBase64));
    let detectError = true;
    let retry = 1;
    while (detectError && retry <= 5) {
      try {
        const response = await facedetect(imageBase64);
        if (response.data.faces?.length > 0) {
          detectError = false;
          let faceRectangle: Rectangle = response.data.faces[0].face_rectangle;
          dispatch(setFaceRectangle(faceRectangle));
          let attributes: Attributes = {
            gender: response.data.faces[0].attributes.gender.value,
            age: response.data.faces[0].attributes.age.value,
            smile: response.data.faces[0].attributes.smile.value,
            facequality: response.data.faces[0].attributes.facequality.value,
            health: response.data.faces[0].attributes.skinstatus.health,
            stain: response.data.faces[0].attributes.skinstatus.stain,
            darkCircle:
              response.data.faces[0].attributes.skinstatus.dark_circle,
            acne: response.data.faces[0].attributes.skinstatus.acne,
          };
          dispatch(setAttributes(attributes));
          setLoading(false);
        } else {
          retry++;
        }
      } catch (error) {
        console.log(error);
        retry++;
      }
    }

    if (detectError) {
      setLoading(false);
      showErrorAwhile();
      setErrorMsg('エラー, もう一度試してください');
    } else {
      history.push('skinTransferHint');
    }
  };

  return (
    <>
      <CapturePhoto
        onNext={(imageBase64: string) => handleNext(imageBase64)}
        confirmTitle="これで診断して宜しいですか？"
      />
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
}

export { SkinCapturePhoto };
