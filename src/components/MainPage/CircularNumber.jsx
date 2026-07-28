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

export default ({ number, color }) => {
  let numberCircleStyle = {
    display: "flex",
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: color || "#000",
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
    alignItems: "center",
    justifyContent: "center",
  };

  const offSet = !isNaN(number) && String(number).length === 2 ? -2 : 0;

  return (
    <div style={numberCircleStyle}>
      <div style={{ marginLeft: offSet }}>{number}</div>
    </div>
  );
};
