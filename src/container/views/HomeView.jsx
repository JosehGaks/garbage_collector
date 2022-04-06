import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import Map from '../../component/Map';
import { useGet } from '../../api';
import mapStyle from '../../mapStyle';

const useStyles = makeStyles((theme) => ({
  mapContainer: {
    flex: 1,
    position: 'relative',
    '@media (min-width:0px) and (orientation: landscape)': {
      height: `calc(100% - ${theme.mixins.toolbar['@media (min-width:0px) and (orientation: landscape)'].minHeight}px)`,
    },
    '@media (min-width:600px)': {
      height: `calc(100% - ${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px)`,
    },
    height: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
  },
  '@global': {
    'html, body, #root': {
      height: '100%',
    },
  },
}));

const Home = () => {
  const classes = useStyles();

  const { payload: baskets, getAll: getAllBasket } = useGet('/baskets');
  const [position, setPosition] = React.useState(null);
  const options = React.useMemo(() => {
    return {
      disableDefaultUI: true,
      styles: mapStyle,
      center: position,
      zoom: 16,
    };
  }, [position]);
  useEffect(getAllBasket, []);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude });
      });
    }
  }, []);

  return (
    <div className={classes.mapContainer}>
      <Map data={baskets} options={options} />
    </div>
  );
};

Home.propTypes = {};

export default Home;
