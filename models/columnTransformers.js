import React from 'react';
import StopPlaceLink from '../components/StopPlaceLink';
import ModalityIcon from './../components/ModalityIcon';
import CarParkingIcon from '../static/icons/ParkingIcon';
import BikeParkingIcon from '../static/icons/facilities/BikeParking';
import { getIn, getInTransform } from '../utils/';
import accessibilityAssessments from '../models/accessibilityAssessments';
import WheelChair from 'material-ui/svg-icons/action/accessible';
import MdCheck from 'material-ui/svg-icons/action/check-circle';
import MdNotChecked from 'material-ui/svg-icons/action/highlight-off';
import StairsIcon from '../static/icons/accessibility/Stairs';

const getParkingElements = (parking = []) => {
  if (!parking.length) {
    return <MdNotChecked color="#B71C1C" />;
  }
  return parking.map(p =>
    <div style={{ display: 'inline-block', marginLeft: 5 }}>
      {getParkingType(p)}
    </div>
  );
};

const isEquipted = (stop, path) => {
  return getInTransform(stop, path, false, result => !!result.length);
};

const getParkingType = parking => {
  const pedalCycle = 'pedalCycle';
  const carParking = 'car';
  const unknownParking = 'N/A';

  const iconStyle = {
    borderRadius: '50%',
    border: '1px solid #000',
    padding: 5,
    height: 20,
    width: 20,
    color: 'rgb(39, 58, 70)'
  };

  if (parking.parkingVehicleTypes.indexOf(pedalCycle) > -1) {
    return <BikeParkingIcon style={iconStyle} />;
  }

  if (parking.parkingVehicleTypes.indexOf(carParking) > -1) {
    return <CarParkingIcon style={iconStyle} />;
  }
  return unknownParking;
};

export const ColumnTransformerStopPlaceJsx = {
  id: stop => <StopPlaceLink id={stop.id} />,
  name: stop => stop.name,
  modality: stop => {
    const iconColor = !stop.stopPlaceType || stop.stopPlaceType === 'other'
      ? 'red'
      : '#000';
    return (
      <ModalityIcon svgStyle={{ color: iconColor }} type={stop.stopPlaceType} />
    );
  },
  muncipality: stop => stop.topographicPlace,
  county: stop => stop.parentTopographicPlace,
  importedId: stop => stop.importedId.join('\r\n'),
  position: stop => stop.location.join(','),
  quays: stop => stop.quays.length,
  parking: stop => getParkingElements(stop.parking),
  wheelchairAccess: stop => {
    const wheelchairAccess = getIn(
      stop,
      ['accessibilityAssessment', 'limitations', 'wheelchairAccess'],
      'UNKNOWN'
    );
    return (
      <WheelChair color={accessibilityAssessments.colors[wheelchairAccess]} />
    );
  },
  stepFreeAccess: stop => {
    const stepFreeAccess = getIn(
      stop,
      ['accessibilityAssessment', 'limitations', 'stepFreeAccess'],
      'UNKNOWN'
    );
    return (
      <StairsIcon color={accessibilityAssessments.colors[stepFreeAccess]} />
    );
  },
  shelterEquipment: stop => {
    return isEquipted(stop, ['placeEquipments', 'shelterEquipment'])
      ? <MdCheck color="#1B5E20" />
      : <MdNotChecked color="#B71C1C" />;
  },
  waitingRoomEquipment: stop => {
    return isEquipted(stop, ['placeEquipments', 'waitingRoomEquipment'])
      ? <MdCheck color="#1B5E20" />
      : <MdNotChecked color="#B71C1C" />;
  },
  sanitaryEquipment: stop => {
    return isEquipted(stop, ['placeEquipments', 'sanitaryEquipment'])
      ? <MdCheck color="#1B5E20" />
      : <MdNotChecked color="#B71C1C" />;
  },
  generalSign: stop => {
    let signs = getIn(stop, ['placeEquipments', 'generalSign'], null);
    if (signs && signs.length) {
      let transportModeSigns = [];
      signs.forEach( (sign, i) => {
        const { signContentType } = sign
        const privateCodeValue = getIn(sign, ['privateCode', 'value'], null)
        if (signContentType === "transportMode" && privateCodeValue) {
          transportModeSigns.push(
            <div
              key={"sign-" + stop.id + "-" + i}
            >
              <span style={{borderRadius: '50%', padding: 5, position: 'absolute', fontWeight: 600, marginTop: -5, border: '1px solid black'}}
              >{ privateCodeValue }</span> 
            </div>
          )
        }
      });
      return transportModeSigns;
    }
    return <MdNotChecked color="#B71C1C" />;
  },
};

export const ColumnTransformersStopPlace = {
  ...ColumnTransformerStopPlaceJsx,
  id: stop => stop.id,
  modality: stop => stop.stopPlaceType,
  importedId: stop => stop.importedId.join(','),
  quays: stop => stop.quays.map(quay => quay.id).join(','),
  parking: stop => stop.parking.map(parking => parking.id).join(','),
  wheelchairAccess: stop =>
    getIn(
      stop,
      ['accessibilityAssessment', 'limitations', 'wheelchairAccess'],
      'UKNOWN'
    ),
  sanitaryEquipment: stop =>
    isEquipted(stop, ['placeEquipments', 'sanitaryEquipment']),
  waitingRoomEquipment: stop =>
    isEquipted(stop, ['placeEquipments', 'waitingRoomEquipment']),
  shelterEquipment: stop =>
    isEquipted(stop, ['placeEquipments', 'shelterEquipment']),
  stepFreeAccess: stop =>
    getIn(
      stop,
      ['accessibilityAssessment', 'limitations', 'stepFreeAccess'],
      'UNKNOWN'
    ),
  generalSign: stop => {
    let signs = getIn(stop, ['placeEquipments', 'generalSign'], null);
    if (signs && signs.length) {
      let signString = '';
      signs.forEach( sign => {
        const privateCodeValue = getIn(sign, ['privateCode', 'value'], null)
        if (sign.signContentType === "transportMode" && privateCodeValue) {
          signString += privateCodeValue + ";"
        }
      });

      return signString.length ? signString.substring(0, signString.length-1) : signString;
    }
    return '';
  }
};

export const ColumnTransformerQuaysJsx = {
  id: quay => quay.id,
  importedId: quay => quay.importedId.join('\r\n'),
  position: quay => quay.location.join(','),
  publicCode: quay => quay.publicCode,
  privateCode: quay => quay.privateCode,
  wheelchairAccess: quay => ColumnTransformerStopPlaceJsx.wheelchairAccess(quay),
  sanitaryEquipment: quay => ColumnTransformerStopPlaceJsx.sanitaryEquipment(quay),
  shelterEquipment: quay => ColumnTransformerStopPlaceJsx.shelterEquipment(quay),
  stepFreeAccess: quay => ColumnTransformerStopPlaceJsx.stepFreeAccess(quay),
  generalSign: quay => ColumnTransformerStopPlaceJsx.generalSign(quay),
  waitingRoomEquipment: quay => ColumnTransformerStopPlaceJsx.waitingRoomEquipment(quay),
};

export const ColumnTransformersQuays = {
  ...ColumnTransformerQuaysJsx,
  stopPlaceId: quay => quay.stopPlaceId,
  stopPlaceName: quay => quay.stopPlaceName,
  importedId: quay => quay.importedId.join(','),
  wheelchairAccess: quay => ColumnTransformersStopPlace.wheelchairAccess(quay),
  sanitaryEquipment: quay => ColumnTransformersStopPlace.sanitaryEquipment(quay),
  shelterEquipment: quay => ColumnTransformersStopPlace.shelterEquipment(quay),
  stepFreeAccess: quay => ColumnTransformersStopPlace.stepFreeAccess(quay),
  generalSign: quay => ColumnTransformersStopPlace.generalSign(quay),
  waitingRoomEquipment: quay => ColumnTransformersStopPlace.waitingRoomEquipment(quay),
};

export const ColumnTranslations = {
  nb: {
    id: 'Id',
    name: 'Navn',
    modality: 'Modalitet',
    muncipality: 'Kommune',
    county: 'Fylke',
    importedId: 'LokalID',
    position: 'Plassering',
    quays: 'Quayer',
    parking: 'Parkering',
    privateCode: 'Internkode',
    publicCode: 'Publikumskode',
    wheelchairAccess: 'Rullestolvennlighet',
    stepFreeAccess: 'Adgang med trapper',
    shelterEquipment: 'Leskur',
    waitingRoomEquipment: 'Venterom',
    sanitaryEquipment: 'WC',
    generalSign: 'Transportskilt',
  },
  en: {
    id: 'Id',
    name: 'Name',
    modality: 'Modality',
    muncipality: 'Muncipality',
    county: 'County',
    importedId: 'ImportedId',
    position: 'Position',
    quays: 'Quays',
    parking: 'Parking',
    privateCode: 'Private code',
    publicCode: 'Public code',
    wheelchairAccess: 'Wheelchair access',
    stepFreeAccess: 'Step free access',
    shelterEquipment: 'Shelter equipment',
    waitingRoomEquipment: 'Waiting room',
    sanitaryEquipment: 'WC',
    generalSign: 'Transport sign',
  }
};
