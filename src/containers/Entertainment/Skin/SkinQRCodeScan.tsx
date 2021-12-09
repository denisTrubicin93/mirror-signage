import React from 'react';
import { useHistory } from 'react-router-dom';
import { QRCodeScan } from '../../common/QRCodeScan';
import useFootControl from '../../../components/common/hook/useFootControl';
import { MIRROR_CONTENT } from '../../Survey/SurveyCapturePhoto';

export default function SkinQRCodeScan(props: any) {
  const history = useHistory();
  const recordId = props.location?.state?.recordId;
  useFootControl({
    goBack: () => history.push('menu'),
  });
  return (
    <>
      <QRCodeScan
        qrcodeParams={recordId && `recordId=${recordId}`}
        onClose={() => history.push('menu')}
        background="linear-gradient(180deg, #31E8C7 0%, #31BCE8 100%), #FFC14B;"
        content={MIRROR_CONTENT.ADULT_SKIN_AGE}
      />
    </>
  );
}

export { SkinQRCodeScan };
