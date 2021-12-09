import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { QRCodeScan } from '../common/QRCodeScan';
import { RootState } from '../../features';

export default function ScanCard(props: any) {
  const history = useHistory();
  const scenesType = useSelector((state: RootState) => state.scenes.type);
  const recordId = props.location?.state?.recordId;
  return (
    <>
      <QRCodeScan
        qrcodeParams={recordId && `recordId=${recordId}`}
        onClose={() => {
          history.push('menu');
        }}
        background="#FED777"
      />
    </>
  );
}

export { ScanCard };
