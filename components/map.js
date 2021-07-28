import { icon } from "leaflet";
import React, { createRef, useEffect, useState } from "react";
import {
  Map,
  Marker,
  Polygon,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import styled from "styled-components";

const center = {
  lat: 51.505,
  lng: -0.09,
};

const Wrapper = styled.div`
   .leaflet-bottom.leaflet-right {
    display: none;
  } 
`;

export default function MyMap() {
  const [data, setData] = useState([]);
  const [markers, setMarkers] = useState([
    center,
    { lat: center.lat + 0.03, lng: center.lng - 0.03 },
    { lat: center.lat + 0.03, lng: center.lng + 0.03 },
  ]);
  // const [refMarkers, setRefMarkers] = useState(markers.map(createRef));
  // create array of ref markers
  const [refMarkers, setRefMarkers] = useState(
    markers.map((marker) => {
      return createRef(marker);
    })
  );
  const [zoom, setZoom] = useState(13);
  const position = [center.lat, center.lng];
  // when adding marker to polygon handleAdd gets called
  const handleAdd = ({ latlng }) => {
    const newVal = latlng;
    setMarkers((a) => [...a, newVal]);  // add new marker to array (for polygon)
    setRefMarkers((a) => [...a, createRef(newVal)]);    // add ref of marker to array
  };
  // when markers changed this is called
  useEffect(() => {
    fetch("https://livevehicle.pubggamer1.repl.co/", {
      body: JSON.stringify({ markers }),
      method: "post",//
      headers: { "Content-Type": "application/json" },
    }).then((a) => a.json().then(setData)); // https request to get json then set data
  }, [markers]);// listen to markers changes

  return (
    <Wrapper className="map-root">
      <div style={{gridTemplateColumns: 'auto 18%', display: 'grid'}} className="vehicle-list">
      <Map
        onClick={handleAdd} // call when click
        center={position}
        zoom={zoom}
        style={{height: "90vh"}}
        onZoom={({ target }) => setZoom(target.zoom)}> // when zoom changes update zoom with target.zoom
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {data.map((a, i) => {
          return (
              // for each car(within polygon) create marker
            <Marker
              position={a.location}
              key={i}
              icon={icon({
                iconUrl: `https://img.icons8.com/color/50/000000/${
                  a.class.name === "D" ? "car" : "truck"
                }-top-view.png`,
                iconSize: "30",

              })}
            >
              <Tooltip direction="top">{a.id}</Tooltip>
            </Marker>
          );
        })}
        <Polygon pathOptions={{ color: "purple" }} positions={markers} />
        {markers.map((position, i) => (
          <Marker
            onClick={() => {
                const newMarkers = [...markers];
                if (newMarkers.length < 4) return;  // there must be at least 3 markers (polygon has 3 or more sides)
                newMarkers.splice(i, 1);
                setMarkers(newMarkers);
            }}
            key={i}
            onDragend={() => {
              const newMarkers = [...markers];
              newMarkers[i] = refMarkers[i].current.leafletElement.getLatLng();
              setMarkers(newMarkers);
            }}
            draggable
            position={position}
            animate
            ref={refMarkers[i]}
          />
        ))}
      </Map>
      {/* vehicle id list ui */}
        <table style={{overflowY: 'scroll', height: "90vh", display: 'block',  border: '3px solid black', padding: '10px'}}>
            <thead>
                <tr>
                    <th>
                        <p style={{fontSize: '2rem', marginBottom: '0', marginTop: '15px'}}>Vehicle ID list</p>
                        <p style={{fontSize: '1rem', marginTop: '0'}}>selected vehicles: {data.length}</p>
                    </th>
                </tr>
            </thead>
            <tbody>
                {data.map((a, i) => {
                  return (
                    <tr key={i}>
                        <td style={{backgroundColor: '#c9fbff', padding: '8px', margin: '4px 0 4px 0'}}>
                          {a.id}
                        </td>
                    </tr>
                )
              })}
            </tbody>
              
        </table>
      </div>
    </Wrapper>
  );
}
