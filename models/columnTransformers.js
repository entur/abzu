/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */

import React from 'react';
import StopPlaceLink from '../components/ReportPage/StopPlaceLink';
import ModalityIconSvg from '../components/MainPage/ModalityIconSvg';
import CarParkingIcon from '../static/icons/ParkingIcon';
import BikeParkingIcon from '../static/icons/facilities/BikeParking';
import { getIn, getInTransform } from '../utils/';
import accessibilityAssessments from '../models/accessibilityAssessments';
import WheelChair from 'material-ui/svg-icons/action/accessible';
import MdCheck from 'material-ui/svg-icons/action/check-circle';
import MdNotChecked from 'material-ui/svg-icons/action/highlight-off';
import StairsIcon from '../static/icons/accessibility/Stairs';
import ModalityIconTray from '../components/ReportPage/ModalityIconTray';
import { darkColor } from '../config/themes/default/defaultTheme';
import TagTray from '../components/MainPage/TagTray';
import ToolTippable from '../components/EditStopPage/ToolTippable';
import moment from 'moment';

const getParkingElements = (parking = []) => {
  if (!parking || !parking.length) {
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
  const unknownParking = ColumnTranslations.notAssigned;
  const iconStyle = {
    borderRadius: '50%',
    border: '1px solid #000',
    padding: 3,
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
  name: (stop, formatMessage) => {
    const infoTextStyle = {
      fontWeight: 600,
      textTransform: 'uppercase',
      color: darkColor,
      fontSize: '0.7em',
      position: 'relative'
    };

    const isParentOrChild = (stop.isParent || stop.isChildOfParent);
    const isFutureOrExpired = (stop.isFuture || stop.hasExpired);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
        <span>{stop.name}</span>
        <div style={{ display: 'flex', marginTop: 3, marginLeft: 5, flexDirection: 'column'}}>
          {isFutureOrExpired &&
            <span style={{ ...infoTextStyle, color: stop.hasExpired ? '#ae1d1d' : '#2f3526', marginRight: 5 }}>
              {stop.hasExpired ? formatMessage({ id: 'search_result_expired' })
                : <div style={{display: 'flex', color: '#ffa500'}}>
                    <div>{formatMessage({id: 'valid_from'})}</div>
                    <div style={{marginLeft: 5}}>{moment(stop.validBetween.fromDate).format('YYYY-MM-DD')}</div>
                </div>}
            </span>}
          {isParentOrChild &&
          <span style={{...infoTextStyle, marginRight: 5}}>
              {stop.isParent
                ? formatMessage({ id: 'parentStopPlace' })
                : formatMessage({ id: 'childStopPlace' })}
            </span>}
          {stop.validBetween && stop.validBetween.toDate && !isFutureOrExpired &&
          <span style={{ ...infoTextStyle, color: '#ffa500'}}>
            {formatMessage({id: 'expires'})} {moment(stop.validBetween.toDate).format('YYYY-MM-DD')}
            </span>}
        </div>
      </div>
    );
  },
  modality: stop => {
    if (!stop.isParent) {
      const iconColor = !stop.stopPlaceType || stop.stopPlaceType === 'other'
        ? 'red'
        : '#000';
      return (
        <ModalityIconSvg
          submode={stop.submode}
          svgStyle={{
            color: iconColor,
            marginTop: -5,
            transform: 'scale(0.8)'
          }}
          type={stop.stopPlaceType}
        />
      );
    } else {
      return <ModalityIconTray modalities={stop.modesFromChildren} />;
    }
  },
  muncipality: stop => stop.topographicPlace,
  county: stop => stop.parentTopographicPlace,
  importedId: stop => stop.importedId.join('\r\n'),
  position: stop => (stop.location ? stop.location.join(',') : ColumnTranslations.notAssigned),
  quays: stop => (stop.quays ? stop.quays.length : 0),
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
      signs.forEach((sign, i) => {
        const { signContentType } = sign;
        const privateCodeValue = getIn(sign, ['privateCode', 'value'], null);
        if (signContentType === 'transportMode' && privateCodeValue) {
          transportModeSigns.push(
            <div key={'sign-' + stop.id + '-' + i}>
              <span
                style={{
                  borderRadius: '50%',
                  padding: 5,
                  position: 'absolute',
                  fontWeight: 600,
                  marginTop: -5,
                  border: '1px solid black'
                }}
              >
                {privateCodeValue}
              </span>
            </div>
          );
        }
      });
      return transportModeSigns;
    }
    return <MdNotChecked color="#B71C1C" />;
  },
  tags: stop =>
    <TagTray
      tags={stop.tags}
      textSize="0.9em"
      direction="column"
      align="left"
    />
};

export const ColumnTransformersStopPlace = {
  ...ColumnTransformerStopPlaceJsx,
  name: stop => stop.name,
  id: stop => stop.id,
  modality: stop => {
    if (stop.isParent)
      return stop.modesFromChildren.map(mode => mode.stopPlaceType).join(',');
    return stop.stopPlaceType;
  },
  importedId: stop => stop.importedId.join(','),
  quays: stop => (stop.quays ? stop.quays.map(quay => quay.id).join(',') : ''),
  parking: stop =>
    stop.parking ? stop.parking.map(parking => parking.id).join(',') : '',
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
      signs.forEach(sign => {
        const privateCodeValue = getIn(sign, ['privateCode', 'value'], null);
        if (sign.signContentType === 'transportMode' && privateCodeValue) {
          signString += privateCodeValue + ';';
        }
      });

      return signString.length
        ? signString.substring(0, signString.length - 1)
        : signString;
    }
    return '';
  },
  tags: stop => stop.tags.map(tag => tag.name).join(',')
};

const getConflictTooltip = conflictMap => {
  if (!conflictMap) return null;
  return (
    <div>
      {Object.keys(conflictMap).map(stopPlaceId => {
        return (
          <div
            key={'tooltip-' + stopPlaceId}
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 5
            }}
          >
            {stopPlaceId}
            <div style={{ textAlign: 'center', marginTop: 2 }}>
              {conflictMap[stopPlaceId].map(quay =>
                <div style={{ fontSize: '0.8em' }} key={'tooltip-' + quay}>
                  {quay}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const ColumnTransformerQuaysJsx = {
  id: quay => quay.id,
  importedId: (quay, duplicateInfo) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {quay.importedId.map((importedId, index) => {
          const isDuplicate = !!duplicateInfo.quaysWithDuplicateImportedIds[
            importedId
          ];

          const confictToolTip = isDuplicate
            ? getConflictTooltip(duplicateInfo.fullConflictMap[importedId])
            : null;

          return (
            <span
              style={{
                color: isDuplicate && confictToolTip ? '#cf1212' : 'initial',
                fontWeight: isDuplicate && confictToolTip ? 600 : 400,
                cursor: isDuplicate && confictToolTip ? 'pointer' : 'initial'
              }}
              key={'importedId-' + quay.id + '-' + index}
            >
              {isDuplicate && confictToolTip
                ? <ToolTippable
                    showToolTip={isDuplicate}
                    toolTipText={confictToolTip}
                  >
                    {importedId}
                  </ToolTippable>
                : <span>{importedId}</span>}
            </span>
          );
        })}
      </div>
    );
  },
  position: quay => (quay.location ? quay.location.join(',') : ColumnTranslations.notAssigned),
  publicCode: quay => quay.publicCode,
  privateCode: quay => quay.privateCode,
  wheelchairAccess: quay =>
    ColumnTransformerStopPlaceJsx.wheelchairAccess(quay),
  sanitaryEquipment: quay =>
    ColumnTransformerStopPlaceJsx.sanitaryEquipment(quay),
  shelterEquipment: quay =>
    ColumnTransformerStopPlaceJsx.shelterEquipment(quay),
  stepFreeAccess: quay => ColumnTransformerStopPlaceJsx.stepFreeAccess(quay),
  generalSign: quay => ColumnTransformerStopPlaceJsx.generalSign(quay),
  waitingRoomEquipment: quay =>
    ColumnTransformerStopPlaceJsx.waitingRoomEquipment(quay)
};

export const ColumnTransformersQuays = {
  ...ColumnTransformerQuaysJsx,
  stopPlaceId: quay => quay.stopPlaceId,
  stopPlaceName: quay => quay.stopPlaceName,
  importedId: quay => quay.importedId.join(','),
  wheelchairAccess: quay => ColumnTransformersStopPlace.wheelchairAccess(quay),
  sanitaryEquipment: quay =>
    ColumnTransformersStopPlace.sanitaryEquipment(quay),
  shelterEquipment: quay => ColumnTransformersStopPlace.shelterEquipment(quay),
  stepFreeAccess: quay => ColumnTransformersStopPlace.stepFreeAccess(quay),
  generalSign: quay => ColumnTransformersStopPlace.generalSign(quay),
  waitingRoomEquipment: quay =>
    ColumnTransformersStopPlace.waitingRoomEquipment(quay)
};

export const ColumnTranslations = {
  nb: {
    name: 'Navn',
    modality: 'Modalitet',
    id: 'Id',
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
    tags: 'Tagger',
    notAssigned: 'N/A'
  },
  en: {
    name: 'Name',
    modality: 'Modality',
    id: 'Id',
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
    tags: 'Tags',
    notAssigned: 'N/A'
  },
  fr: {
    name: 'Nom',
    modality: 'Modalité',
    id: 'Id',
    muncipality: 'Municipalité',
    county: 'Département',
    importedId: 'ID local',
    position: 'Position',
    quays: 'Quais',
    parking: 'Parking',
    privateCode: 'Code privé',
    publicCode: 'Code public',
    wheelchairAccess: 'Accessibilité PMR',
    stepFreeAccess: 'Accès sans escalier',
    shelterEquipment: 'Abri',
    waitingRoomEquipment: "Salle d'attente",
    sanitaryEquipment: 'WC',
    generalSign: 'Information voyageur à l\'arrêt',
    tags: 'Tags',
    notAssigned: 'N/R'
  }
};
