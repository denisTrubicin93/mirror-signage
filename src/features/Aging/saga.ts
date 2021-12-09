import { call, put, takeLatest, select } from 'redux-saga/effects';
import { actions, AgingDisease } from './reducer';
import { top3AgingDiseases } from './diseases';
import { RootState } from '..';
import { fetchAgingAsync } from '../../service/AgingService';

function* fetchAgingImages() {
  try {
    const profile = yield select((state: RootState) => state.person.profile);
    const agingDiseases: AgingDisease[] = [];
    // const resizedImage = resizeBase64Image(profile.photo)
    
    if (profile.age >= 90) {
      agingDiseases.push({
        aging: profile.age,
        imageBase64: profile.photo.split(',')[1],
        ...top3AgingDiseases.find(
          (x: any) => x.fromAge <= profile.age && profile.age <= x.toAge
        ),
      } as AgingDisease);
      return;
    }

    let increaseAging = profile.age ?? 0;
    const ageArr: number[] = [];
    for (let i = 0; i < 3; i++) {
      if (increaseAging >= 90) {
        ageArr.push(increaseAging);
        break;
      }
      increaseAging += 10;
      ageArr.push(increaseAging);
    }

    const response = yield call(fetchAgingAsync, {
      image: profile.photo.split(',')[1],
      age: ageArr.join(','),
    });

    for (let i = 0; i < ageArr.length; i++) {
      const agingDisease = top3AgingDiseases.find(
        (x: any) => x.fromAge <= ageArr[i] && ageArr[i] <= x.toAge
      );

      agingDiseases.push({
        aging: ageArr[i],
        imageBase64: response.data.result[i]?.image,
        ...agingDisease,
      } as AgingDisease);
    }

    yield put(actions.agingImagesFetched(agingDiseases));
  } catch (err) {
    console.log(err)
    // alert(err)
    yield put(actions.agingFetchedError())
  }
}

export function* watchAgingSaga() {
  yield takeLatest(actions.fetchAgingImages.type, fetchAgingImages);
}
