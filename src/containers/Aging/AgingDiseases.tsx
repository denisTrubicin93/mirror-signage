import React, { useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Box, Typography, Grid, Dialog } from '@material-ui/core';
import {
  BACKGROUND,
  CARD_SHADOW,
  CARD,
  ICON_TEXT_BUTTON,
} from '../common/styles';
import useFootControl from '../../components/common/hook/useFootControl';
import { PieChart, Pie, Cell, Label } from 'recharts';
import CheckIcon from '../common/assets/Capture_Photo/camera_check_icon.png';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../features';
import { actions } from '../../features/Aging/reducer';
import Loading from '../../components/common/Loading';
import LoadingGif from './assets/aging_loading.gif';

const useStyles = makeStyles(() =>
  createStyles({
    app_content: {
      width: '1080px',
      height: '1920px',
      top: 0,
      left: 0,
      position: 'fixed',
      boxSizing: 'border-box',
      '& .background': {
        ...BACKGROUND,
        '& .aging_image': {
          width: 622,
          height: 658,
          borderRadius: 20,
          zIndex: 200,
        },
        '& .card': {
          ...CARD,
          zIndex: 100,
          padding: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 770,
          top: 630,
          position: 'absolute',
          background: '#24CE53',
          '& .card_header': {
            background: '#FFFFFF33',
            height: 220,
            '& .title': {
              color: '#FFFFFF',
              fontSize: 72,
              fontWeight: 800,
            },
          },
          '& .card_body': {
            padding: '25px 50px',
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            '& .content': {
              fontSize: 40,
              fontWeight: 800,
            },
            '& .content_value': {
              textIndent: 60,
            },
          },
        },
        '& .card_shadow': {
          ...CARD_SHADOW,
          background: '#33FF5433',
          opacity: 1,
          top: 1370,
          position: 'absolute',
        },
        '& .btn': {
          ...ICON_TEXT_BUTTON,
          '& .center_title': {
            fontSize: 48,
            color: '#613BFF',
            fontWeight: 800,
            marginTop: 10,
          },
          '& .icon': {
            maxHeight: '50%',
            maxWidth: '50%',
          },
        },
        '& .btn_active': {
          border: '16px solid #613BFF',
        },
        '& .bottom': {
          width: 920,
          position: 'absolute',
          top: 1450,
        },
      },
    },
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const adjustX = () => {
    if (index === 0) {
      return x - 20;
    }

    if (index === 2) {
      return x + 40;
    }

    return x;
  };

  return (
    <>
      <text
        x={adjustX()}
        y={y - 40}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        stroke="none"
        fontSize={30}
      >
        {index === 3 ? `(その他)` : `(${index + 1})`}
      </text>
      <text
        x={adjustX()}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        stroke="none"
        fontSize={30}
      >
        {index === 3
          ? `${(percent * 100).toFixed(0)}%`
          : `${(percent * 100).toFixed(0)}%`}
      </text>
    </>
  );
};

export default function AgingDiseases() {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [agingIndex, setAgingIndex] = useState(0);
  const agingDiseases = useSelector(
    (state: RootState) => state.aging.agingDiseases
  );
  const loading = useSelector((state: RootState) => state.aging.loading);
  const error = useSelector((state: RootState) => state.aging.error);

  const agingDisease = useMemo(() => {
    return agingDiseases[agingIndex];
  }, [agingIndex, agingDiseases]);

  useEffect(() => {
    if (!error || loading) return;
    const timeId = setTimeout(() => {
      dispatch(actions.resetState());
      history.push('agingDetect');
    }, 3000);

    return () => clearTimeout(timeId);
  }, [error, loading]);

  const pieChartData = useMemo(() => {
    if (!agingDisease) return;
    const data = agingDisease.top3Diseases.map((x) => ({ value: x.percent }));
    const remaining = 100 - data.map((x) => x.value).reduce((a, b) => a + b);
    return [...data, { value: remaining }];
  }, [agingDisease]);

  const { currentIndex, onTap, onHover } = useFootControl({
    intitialIndex: 0,
    actions: [
      () => {
        if (agingIndex === agingDiseases.length - 1) {
          history.push('agingRecommendation');
        } else {
          setAgingIndex(agingIndex + 1);
        }
      },
    ],
    goBack: () => history.push('agingDetect'),
  });

  const buttonClasses = (index: number) => {
    return currentIndex === index ? 'btn btn_active' : 'btn';
  };

  return (
    <Box className={classes.app_content}>
      {loading && <Box className="background" style={{ justifyContent: 'center' }}>
        <img src={LoadingGif} />
      </Box>}
      {agingDisease && (
        <Box className="background">
          <img
            className="aging_image"
            src={`data:image/png;base64,${agingDisease.imageBase64}`}
          />
          <Grid container direction="column" className="card">
            <Grid
              container
              alignItems="center"
              justify="center"
              className="card_header"
            >
              <Typography className="title">
                {agingDisease.aging}歳のあなた
              </Typography>
            </Grid>
            <Box className="card_body">
              <Typography className="content">
                {agingDisease.aging >= 90
                  ? `${agingDisease.fromAge}歳のTOP3傷病}`
                  : `${agingDisease.fromAge}～${agingDisease.toAge}歳のTOP3傷病`}
              </Typography>
              {agingDisease.top3Diseases.map((x, index) => (
                <Box key={index}>
                  <Typography className="content">
                    {index + 1}．{x.name}（{x.percent}％）
                  </Typography>
                  <Typography className="content content_value">
                    {x.personAmount}人
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
          <Box className="card_shadow" />
          <Grid container className="bottom" justify="space-between">
            {pieChartData && (
              <PieChart width={400} height={400}>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius="100%"
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={false}
                  startAngle={180}
                  endAngle={-180}
                >
                  {pieChartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            )}
            <Box
              className={buttonClasses(0)}
              onClick={() => onTap(0)}
              onMouseOver={() => onHover(0)}
            >
              <img src={CheckIcon} className="icon" />
              <Typography className="center_title">OK</Typography>
            </Box>
          </Grid>
        </Box>
      )}
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
          <Typography className={classes.error_msg}>
            エラー, もう一度試してください
          </Typography>
        </Grid>
      </Dialog>
    </Box>
  );
}
