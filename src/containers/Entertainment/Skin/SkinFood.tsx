import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Grid, Divider } from '@material-ui/core';
import {
  BACKGROUND,
  TOP_BG,
  BOTTOM_BG,
  ICON_TEXT_BUTTON,
} from '../../common/styles';
import TopBg1 from './assets/skin_food_top_bg_1.png';
import TopBg2 from './assets/skin_food_top_bg_2.png';
import TopBg3 from './assets/skin_food_top_bg_3.png';
import TopBg4 from './assets/skin_food_top_bg_4.png';
import useFootControl from '../../../components/common/hook/useFootControl';
import CheckIcon from '../../common/assets/Capture_Photo/camera_check_icon.png';
import randomNum from '../../../service/RandomNum';

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
        '& .top_bg': {
          ...TOP_BG,
          height: 520,
        },
        '& .bottom_bg': {
          ...BOTTOM_BG,
          height: 1400,
          '& .good_food_title': {
            width: 400,
            height: 80,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(97, 59, 255, 0.05)',
            fontSize: 48,
            fontWeight: 800,
            color: '#613BFF',
            position: 'relative',
            top: 40,
            left: 280,
            borderRadius: 40,
          },
          '& .food_info': {
            width: 920,
            height: 260,
            position: 'relative',
            top: 70,
            '& .food_name': {
              color: '#613BFF',
              fontWeight: 800,
              fontSize: 96,
              lineHeight: 1.3,
            },
            '& .food_sub': {
              color: '#613BFF',
              fontSize: 48,
              lineHeight: 1.3,
            },
          },
          '& .food_advantages': {
            width: 920,
            position: 'relative',
            top: 120,
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            flexWrap: 'unset',
            '& .item_index': {
              minWidth: 80,
              height: 80,
              borderRadius: '50%',
              background: '#613BFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 48,
              marginRight: 40,
            },
            '& .item_text': {
              color: '#333333',
              fontSize: 42,
              lineHeight: 1.4,
              width: 800
            },
            '& .item_text_multi_line': {
              display: 'flex',
              flexDirection: 'column',
            },
          },
        },
        '& .btn': {
          ...ICON_TEXT_BUTTON,
          position: 'absolute',
          top: 1480,
          left: 560,
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
        '& .divider': {
          position: 'absolute',
          width: 920,
          height: 2,
          background: '#EEEEEE',
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

const foodRecommendations = [
  {
    image: TopBg1,
    name: '?????????',
    subTitle: '??????????????????????????????',
    advantages: [
      '?????????????????????????????????????????????',
      '???????????????????????????????????????',
      '?????????????????????????????????????????????',
    ],
  },
  {
    image: TopBg2,
    name: '???????????????',
    subTitle: '????????????????????????????????????',
    advantages: [
      '????????????B????????????????????????????????????????????????????????????????????????',
      '???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????',
    ],
  },
  {
    image: TopBg3,
    name: '????????????',
    subTitle: '?????????????????????????????????????????????',
    advantages: [
      '???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????',
      '?????????????????????????????????:\n??????????????????????????????????????????????????????\n?????????????????????????????????\n???????????????????????????',
    ],
  },
  {
    image: TopBg4,
    name: '????????????????????????',
    subTitle: '?????????????????????????????????????????????',
    advantages: [
      '?????????????????????????????????????????????????????????????????????????????????????????????????????????',
      '?????????????????????????????????????????????????????????E??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????',
    ],
  },
];

const foodIndex = randomNum(0, foodRecommendations.length - 1);

const SkinFood = () => {
  const classes = useStyles();
  const history = useHistory();

  const { currentIndex, onTap, onHover } = useFootControl({
    intitialIndex: 0,
    actions: [() => history.push('menu')],
    goBack: () => history.push('skinAnalysis'),
  });

  const buttonClasses = (index: number) => {
    return currentIndex === index ? 'btn btn_active' : 'btn';
  };

  const recommendation = foodRecommendations[foodIndex];

  return (
    <>
      <Box className={classes.app_content}>
        <Box className="background">
          <Box
            className="top_bg"
            style={{
              background: `url(${recommendation.image}) center no-repeat `,
            }}
          ></Box>

          <Box className="bottom_bg">
            <Typography className="good_food_title">??????????????????</Typography>
            <Grid
              container
              direction="column"
              justify="flex-start"
              className="food_info"
            >
              <Typography className="food_name">
                {recommendation.name}
              </Typography>

              <Typography className="food_sub">
                {recommendation.subTitle}
                <br />
                ???????????????????????????
              </Typography>
            </Grid>
            <Divider className="divider" style={{ top: 940 }} />
            <Box className="food_advantages">
              {recommendation.advantages.map((adv, advIndex) => (
                <Grid
                  key={advIndex}
                  item
                  direction="row"
                  container
                  alignItems="center"
                  style={{ marginBottom: 30 }}
                >
                  <Box className="item_index">{advIndex + 1}</Box>
                  {foodIndex === 2 ? (
                    <Grid direction="column" >
                      {adv.split('\n').map((x, index) => (
                        <Typography className="item_text" key={index}>
                          {x}
                        </Typography>
                      ))}
                    </Grid>
                  ) : (
                    <Typography className="item_text">{adv}</Typography>
                  )}
                </Grid>
              ))}
            </Box>
            <Box
              className={buttonClasses(0)}
              onClick={() => onTap(0)}
              onMouseOver={() => onHover(0)}
            >
              <img src={CheckIcon} className="icon" />
              <Typography className="center_title">OK</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SkinFood;

export { SkinFood };
