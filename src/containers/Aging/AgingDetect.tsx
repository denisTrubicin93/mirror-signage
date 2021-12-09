import React from 'react';
import { useHistory } from 'react-router-dom';
import { CapturePhoto } from '../common/CapturePhoto';
import { dataURItoBlob } from '../../service/Base64Utils';
import { setAge, setGender, setPhoto } from '../../features/Person/reducer';
import { FaceClient } from '@azure/cognitiveservices-face';
import { CognitiveServicesCredentials } from '@azure/ms-rest-azure-js';
import { useDispatch } from 'react-redux';

export default function AgingDetect() {
  const history = useHistory();
  const dispatch = useDispatch();

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
    client.face
      .detectWithStream(blob, options)
      .then((result: any) => {
        if (result[0]?.faceAttributes?.age) {
          dispatch(setPhoto(photo))
          dispatch(setAge(result[0].faceAttributes.age));
          dispatch(setGender(result[0].faceAttributes.gender));
          history.push({
            pathname: '/agingDetectResult',
            state: { detectResult: 'suc' },
          });
        } else {
          dispatch(setAge(0));
          dispatch(setGender('unknown'));
          history.push({
            pathname: '/agingDetectResult',
            state: { detectResult: 'fail' },
          });
        }
      })
      .catch(() => {
        dispatch(setAge(0));
        dispatch(setGender('unknown'));
        history.push({
          pathname: '/agingDetectResult',
          state: { detectResult: 'fail' },
        });
      });
  };

  return (
    <>
      <CapturePhoto
        onNext={(imageBase64: string) => handleDetectPhoto(imageBase64)}
      />
    </>
  );
}

export { AgingDetect };
