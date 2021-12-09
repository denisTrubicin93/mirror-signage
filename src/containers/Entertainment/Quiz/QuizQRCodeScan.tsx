import React from 'react';
import { useHistory } from 'react-router-dom';
import { QRCodeScan } from '../../common/QRCodeScan';
import ChildBg from '../assets/Quiz/main_bg.png';
import { useSelector } from 'react-redux';
import { RootState } from '../../../features';
import { MIRROR_CONTENT } from '../../Survey/SurveyCapturePhoto';

export default function QuizQRCodeScan(props: any) {
  const history = useHistory();
  const recordId = props.location?.state?.recordId;
  const scenesType = useSelector((state: RootState) => state.scenes.type);
  return (
    <>
      <QRCodeScan
        qrcodeParams={recordId && `recordId=${recordId}`}
        onClose={() => history.push('menu')}
        background={`url(${ChildBg}) center no-repeat`}
        content={
          scenesType === 'child'
            ? MIRROR_CONTENT.CHILD_QUIZ
            : MIRROR_CONTENT.ADULT_QUIZ
        }
      />
    </>
  );
}

export { QuizQRCodeScan };
