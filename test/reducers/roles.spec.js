import expect from 'expect';
import { getAllowanceInfo , getLatLngFromResult} from '../../reducers/rolesReducerUtils';

const stopPlaceResult = {
  data: {
    stopPlace: [
      {
        geometry: {
          coordinates: [
            [
              10.434486,
              59.833343
            ]
          ]
        }
      }
    ]
  }
};

describe('getAllowanceInfo', () => {

  it('should get latlng from stopPlaceResult', () => {

    let latlng = getLatLngFromResult(stopPlaceResult);
    expect(latlng).toEqual([59.833343, 10.434486]);

  })

});
