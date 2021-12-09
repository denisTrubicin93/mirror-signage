import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { Box, Typography, Dialog, Grid } from '@material-ui/core';
import qrcodeDefault from './assets/QRCode_Scan/qrcode-default.png';
import Loading from '../../components/common/Loading';
import { qrcodeChart } from '../../service/GoogleChartService';
import TimerCountdown from '../../components/common/TimerCountdown';
import ChildQrCodeBg from './assets/QRCode_Scan/child_qr_code_bg.png';
import AdultQrCodeBg from './assets/QRCode_Scan/adult_qr_code_bg.png';
import ChildQrDigitalAvatar from './assets/QRCode_Scan/child_qr_digital_avatar.png';
import AdultQrDigitalAvatar from './assets/QRCode_Scan/adult_qr_digital_avatar.png';
import { COUNTER, BACKGROUND, ICON_TEXT_BUTTON } from './styles';
import useFootControl from '../../components/common/hook/useFootControl';
import BackIcon from '../Entertainment/assets/Common/back.png';
import SurveyIcon from '../Entertainment/assets/Common/survey.png';
import { MIRROR_CONTENT } from '../Survey/SurveyCapturePhoto';

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
        background: (props: any) =>
          props.background ? props.background : '#ffffff',
        '& .child_card': {
          position: 'relative',
          top: 348,
          background: `url(${ChildQrCodeBg}) center/cover no-repeat`,
          width: 895,
          height: 1089,
          paddingTop: 150,
        },
        '& .adult_card': {
          position: 'relative',
          top: 348,
          background: `url(${AdultQrCodeBg}) center/cover no-repeat`,
          width: 895,
          height: 1089,
          paddingTop: 150,
        },
        '& .card_image': {
          width: 500,
          height: 500,
        },
        '& .qr_title': {
          fontSize: 80,
          fontWeight: 'bold',
          letterSpacing: '-0.04em',
          color: '#613BFF',
        },
        '& .digital_avatar_image': {
          width: 935,
          height: 312,
          top: -60,
          position: 'relative',
        },
        '& .btn': {
          ...ICON_TEXT_BUTTON,
          '& .center_title': {
            fontSize: 48,
            color: '#333333',
            fontWeight: 800,
            position: 'relative',
            top: 30,
          },
          '& .icon': {
            maxHeight: '45%',
            maxWidth: '45%',
          },
        },
        '& .btn_active': {
          border: '16px solid #613BFF',
        },
        '& .counter': {
          ...COUNTER,
          position: 'absolute',
          top: 20,
        },
      },
    },
    error_msg: `
      font-family: Noto Sans JP;
      font-style: normal;
      font-weight: bold;
      font-size: 45px;
      line-height: 50px;
      text-align: center;
      color: #FFFFFF;
    `,
  })
);

interface QRCodeScanProps {
  qrcodeParams: string;
  onClose: Function;
  background?: string;
  content?: MIRROR_CONTENT;
}

const QRCodeScan = (props: QRCodeScanProps) => {
  const { onClose, content } = props;
  const classes = useStyles(props);
  const history = useHistory();
  const scenesType = useSelector((state) => state.scenes.type);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const showErrorAwhile = () => {
    setError(true);
    setTimeout(() => setError(false), 3000);
  };

  const [qrcode, setQrcode] = React.useState(undefined);

  const blobUrl = (blob: any) => {
    if (!blob.url) {
      blob.url = URL.createObjectURL(blob);
    }
    return blob.url;
  };

  React.useEffect(() => {
    qrcodeChart(
      process.env.SUKOYAKA_BASE_URL +
        '/digital-avatar/profile?' +
        (props.qrcodeParams ? props.qrcodeParams : '')
    )
      .then(function (response: any) {
        setQrcode(response.data);
        setLoading(false);
      })
      .catch(function (error: any) {
        console.log(error);
        setLoading(false);
        showErrorAwhile();
        setErrorMsg('エラー, もう一度試してください');
      });
  }, []);

  const buttons = [
    {
      centerTitle: scenesType === 'child' ? 'さいしょにもどる' : '最初にもどる',
      icon: BackIcon,
      onTap: () => history.push('menu'),
    },
    {
      centerTitle: 'アンケートへ',
      icon: SurveyIcon,
      onTap: () =>
        history.push({
          pathname: 'surveyCapturePhoto',
          state: {
            content: content,
          },
        }),
    },
  ];

  const { currentIndex, onTap, onHover } = useFootControl({
    intitialIndex: 0,
    actions: buttons.map((x: any) => x.onTap as Function),
    goBack: () => history.push('menu'),
  });

  const buttonClasses = (index: number) => {
    return currentIndex === index ? 'btn btn_active' : 'btn';
  };

  return (
    <>
      <Box className={classes.app_content}>
        <Box className="background">
          {!loading && (
            <TimerCountdown
              className="counter"
              seconds={40}
              onShoot={onClose}
            />
          )}
          <Grid
            container
            direction="column"
            alignItems="center"
            className={`${scenesType}_card`}
          >
            <img
              className="card_image"
              src={qrcode ? blobUrl(qrcode) : qrcodeDefault}
            />
            <Typography className="qr_title">QRコードをスキャン</Typography>
            <img
              className="digital_avatar_image"
              src={
                scenesType === 'child'
                  ? ChildQrDigitalAvatar
                  : AdultQrDigitalAvatar
              }
            />
          </Grid>
          <Grid
            container
            direction="row"
            justify="space-between"
            style={{ width: 930, position: 'absolute', top: 1480 }}
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
        </Box>
      </Box>
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
};

export default QRCodeScan;

export { QRCodeScan };
