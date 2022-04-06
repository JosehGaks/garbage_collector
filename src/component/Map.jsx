import React, { memo, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { makeStyles, Backdrop, CircularProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import mapStyle from '../mapStyle';

const useStyles = makeStyles(() => ({
  mapContainer: {
    flex: 1,
    height: '100%',
  },
}));

function Map({ data, onClick, markerClick, options }) {
  const classes = useStyles();
  const mapRef = React.useRef(null);
  const [mapOptions, setMapOptions] = React.useState({
    center: {
      lat: 30.249911727927323,
      lng: 31.692982161596838,
    },
    zoom: 12,
  });
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API,
  });

  const handleLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const positionHandler = () => {
    if (!mapRef.current) return;
    const center = mapRef.current.getCenter().toJSON();
    const zoom = mapRef.current.getZoom();
    setMapOptions((prevOptions) => ({ ...prevOptions, center, zoom }));
  };

  return isLoaded ? (
    <GoogleMap
      onClick={onClick}
      onLoad={handleLoad}
      onDragEnd={positionHandler}
      options={
        options || {
          disableDefaultUI: true,
          styles: mapStyle,
          center: mapOptions?.center,
          zoom: mapOptions?.zoom,
        }
      }
      mapContainerClassName={classes.mapContainer}
    >
      {data &&
        data.baskets.map(({ id, latitude: lat, longitude: lng }) => (
          <Marker
            key={id}
            icon="/basket.png"
            position={{ lat, lng }}
            onClick={(event) => markerClick(event, id)}
          />
        ))}
    </GoogleMap>
  ) : (
    <Backdrop open={!isLoaded}>
      <CircularProgress />
    </Backdrop>
  );
}

Map.defaultProps = {
  data: null,
  options: null,
  onClick: () => {},
  markerClick: () => {},
};

Map.propTypes = {
  data: PropTypes.shape({
    baskets: PropTypes.arrayOf(
      PropTypes.shape({
        disableDefaultUI: PropTypes.bool,
        styles: PropTypes.objectOf(PropTypes.any),
        center: PropTypes.number,
        zoom: PropTypes.number,
      })
    ),
  }),
  options: PropTypes.shape({
    id: PropTypes.number,
    longitude: PropTypes.number,
    latitude: PropTypes.number,
    micro_controller: PropTypes.string,
    software_version: PropTypes.string,
    sections_levels_in_the_basket: PropTypes.arrayOf(PropTypes.number),
    wastes_level_in_the_section: PropTypes.arrayOf(PropTypes.number),
  }),
  onClick: PropTypes.func,
  markerClick: PropTypes.func,
};
export default memo(Map);
