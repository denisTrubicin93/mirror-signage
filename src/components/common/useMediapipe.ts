import { useDispatch } from "react-redux"
import { updateCameraState } from "../../features/Device/reducer";
import { disableCursor, enableCursor } from "../../features/Handtracking/reducer";

import { sendMessageAction } from "../../features/Websocket/reducer";

export const useMediapipe = () => {
  const dispatch = useDispatch();

  const mpCommands = {
    start: () => {
      dispatch(updateCameraState('occupied'));
      dispatch(enableCursor());
    },
    restart: () => {
      dispatch(updateCameraState('occupied'));
      dispatch(enableCursor());
    },
    stop: () => {
      dispatch(disableCursor());
      setTimeout(() => {
        dispatch(updateCameraState('not-occupied'));
      }, 800);
    },
    neutralMode: () => {
      dispatch(sendMessageAction({
        to: 'pose',
        message: {
          cmd: 'change_mode',
          mode: 'neutral',
        }
      }));
    },
    kabeanaMode: (options: { pose: number } = { pose: 1 }) => {
      dispatch(sendMessageAction({
        to: 'pose',
        message: {
          cmd: 'change_mode',
          mode: 'kabeana',
          pose: options.pose,
        }
      }));
    },
    flagMode: (options: { pose: number } = { pose: 0 }) => {
      dispatch(sendMessageAction({
        to: 'pose',
        message: {
          cmd: 'change_mode',
          mode: 'flag',
          pose: options.pose,
        }
      }));
      dispatch(sendMessageAction({
        to: 'pose',
        message: {
          cmd: 'flag_start'
        },
      }));

    },
    squatMode: (options: { threshold: number } = { threshold: 100 }) => {
      dispatch(sendMessageAction({
        to: 'pose',
        message: {
          cmd: 'change_mode',
          mode: 'squat',
          threshold: options.threshold,
        },
      }));
      dispatch(sendMessageAction({
        to: 'pose',
        message: {
          cmd: 'squat_start'
        },
      }));

    },
    ballstrikeMode: (
      options: { attackKeypoints: string[], targets: number, targetSize: number }
        = { attackKeypoints: ["RIGHT_INDEX", "LEFT_INDEX"], targets: 5, targetSize: 45 }) => {
      dispatch(sendMessageAction({
        to: 'pose',
        message: {
          cmd: 'change_mode',
          mode: 'ball_strike',
          attack_keypoints: options.attackKeypoints,
          n_targets: options.targets,
          target_size: options.targetSize,
        },
      }));
    },
    startRunning: () => {
      dispatch(sendMessageAction({
        to: 'pose',
        message: {
          cmd: 'subway_start',
        }
      }));
    },
    finishRunning: () => {
      dispatch(sendMessageAction({
        to: 'pose',
        message: {
          cmd: 'subway_finish',
        }
      }));
    }
  };

  return { mpCommands };
}
