import React from 'react';
import { useHistory } from 'react-router-dom';
import { QRCodeScan } from '../../common/QRCodeScan';
import { MIRROR_CONTENT } from '../../Survey/SurveyCapturePhoto';

export default function CompatibilityQRCodeScan(props: any) {
  const history = useHistory();
  const recordId = props.location?.state?.recordId;
  return (
    <>
      <QRCodeScan
        qrcodeParams={recordId && `recordId=${recordId}`}
        onClose={() => history.push('menu')}
        background="linear-gradient(180deg, #FF7E9D 0%, #FF5C84 100%), #FF7E9D;"
        content={MIRROR_CONTENT.ADULT_COMPATIBILITY}
      />
    </>
  );
}

export { CompatibilityQRCodeScan };
