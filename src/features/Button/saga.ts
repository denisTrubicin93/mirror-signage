import { delay, put, select, take, takeEvery, race } from 'redux-saga/effects';
import { messageAction, messageAction2 } from '../Websocket/reducer';
import {
  getCurrentPoint,
  getCurrentStatus,
  setBtnPoint,
  setBtnStatus,
  setFootPoint,
} from './reducer';
import {
  ButtonPoint,
  ButtonStatus,
  BUTTON_SELECT_THERSHOLD,
  BUTTON_SLEEP_THRESHOLD,
} from './models';
import { HandPoint, FootPoint } from '../Websocket/models';
import { RootState } from '..';
import { push } from 'connected-react-router';

const getButtonPoint = (point: string): ButtonPoint => {
  switch (point) {
    case 'L1':
      return ButtonPoint.L1;
    case 'L2':
      return ButtonPoint.L2;
    case 'R1':
      return ButtonPoint.R1;
    case 'R2':
      return ButtonPoint.R2;
    default:
      return ButtonPoint.BLUR;
  }
};

const getButtonStatus = (point: ButtonPoint, type: 'SELECTED' | 'FORCUS') => {
  switch (point) {
    case ButtonPoint.L1:
      return type === 'SELECTED'
        ? ButtonStatus.SELECTED_L1
        : ButtonStatus.FORCUS_L1;
    case ButtonPoint.L2:
      return type === 'SELECTED'
        ? ButtonStatus.SELECTED_L2
        : ButtonStatus.FORCUS_L2;
    case ButtonPoint.R1:
      return type === 'SELECTED'
        ? ButtonStatus.SELECTED_R1
        : ButtonStatus.FORCUS_R1;
    case ButtonPoint.R2:
      return type === 'SELECTED'
        ? ButtonStatus.SELECTED_R2
        : ButtonStatus.FORCUS_R2;
    default:
      return ButtonStatus.BLUR;
  }
};

let lastBtnPoint = '';
function* messageHandler(action: ReturnType<typeof messageAction>) {
  try {
    switch (action.payload.cmd) {
      case 'foot':
        {
          try {
            if (action.payload.result) {
              const foots = action.payload.result as FootPoint;
              const point = foots.point;
              const btnPoint = getButtonPoint(point);
              const currentPoint = yield select(getCurrentPoint);

              if (
                lastBtnPoint === btnPoint &&
                (lastBtnPoint === 'R1' || lastBtnPoint === 'R2')
              ) {
                return;
              }

              lastBtnPoint = btnPoint;
              if (currentPoint === ButtonPoint.BLUR) {
                yield put(setFootPoint(btnPoint));
              }
            }
          } catch (err) {
            console.log('error: ', err);
          }
        }
        break;
      case 'neutral': {
        if (action.payload.result) {
          const currentPath = yield select(
            (state: RootState) => state.router.location.pathname
          );

          if (
            currentPath !== '/' &&
            currentPath !== '/gamePlaySquat' &&
            currentPath !== '/flag'
          ) {
            put(push('/'));
            put(setFootPoint(ButtonPoint.BLUR));
          }
        }
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.log('error: ', error);
  }
}

export function* watchMessageAction() {
  yield takeEvery(messageAction, messageHandler);
}

function* buttonPointHandler(action: ReturnType<typeof setBtnPoint>) {
  try {
    const btnPoint = action.payload;
    const btnStatus = getButtonStatus(btnPoint, 'FORCUS');
    yield put(setBtnStatus(btnStatus));

    const { task } = yield race({
      task: delay(BUTTON_SELECT_THERSHOLD),
      nextAction: take(setBtnPoint.type),
    });

    if (task) {
      const currentStatus = yield select(getCurrentStatus);
      // 他の遷移が入っていないこと
      if (currentStatus !== btnStatus) return;
      const newBtnStatus = getButtonStatus(action.payload, 'SELECTED');
      if (newBtnStatus !== ButtonStatus.BLUR) {
        yield put(setBtnStatus(newBtnStatus));
      }
    }
  } catch (error) {
    console.log('error: ', error);
  }
}

export function* watchButtonPoint() {
  yield takeEvery(setBtnPoint, buttonPointHandler);
}

export function* sleepHandler(action: ReturnType<typeof setFootPoint>) {
  try {
    const { task, nextAction } = yield race({
      task: delay(BUTTON_SLEEP_THRESHOLD),
      nextAction: take(setFootPoint.type),
    });

    if (task) {
      // 現在のパスを取得して '/' でなければ push する
      const currentPath = yield select(
        (state: RootState) => state.router.location.pathname
      );
      console.log(`sleep task: ${JSON.stringify(task)}, ${currentPath}`);
      if (
        currentPath !== '/' &&
        currentPath !== '/gamePlaySquat' &&
        currentPath !== '/flag' &&
        currentPath !== '/gamePlayRunning'
      ) {
        yield put(push('/scenes'));
      }
    }

    if (nextAction) {
      console.log(`sleep nextAction: ${JSON.stringify(nextAction)}`);
    }
  } catch (error) {
    console.log('error: ', error);
  }
}

export function* watchButtonPointForSleep() {
  yield takeEvery(setFootPoint, sleepHandler);
}

// just for interating UI by mouse
export function* messageHandler2(action: ReturnType<typeof messageAction2>) {
  const btnPoint = getButtonPoint(action.payload);
  const currentPoint = yield select(getCurrentPoint);

  if (currentPoint === ButtonPoint.BLUR) {
    yield put(setFootPoint(btnPoint));
  }
}

// just for interating UI by mouse
export function* watchMessageAction2() {
  yield takeEvery(messageAction2, messageHandler2);
}
