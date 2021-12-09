import React from 'react';
import { useHistory } from 'react-router-dom';
import { QRCodeScan } from '../../common/QRCodeScan';
import { MIRROR_CONTENT } from '../../Survey/SurveyCapturePhoto';

export default function FaceQRCodeScan(props) {
  const history = useHistory();
  const recordId = props.location?.state?.recordId;
  return (
    <>
      <QRCodeScan
        qrcodeParams={recordId && `recordId=${recordId}`}
        onClose={() => history.push('menu')}
        background="linear-gradient(90deg, #613BFF 0%, #3B76FF 100%);"
        content={MIRROR_CONTENT.ADULT_FACE_READING}
      />
    </>
  );
}

export { FaceQRCodeScan };
