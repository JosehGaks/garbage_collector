import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { Switch, Route } from 'react-router-dom';
import AddBasketDialog from '../../component/AddBasketDialog';
import Map from '../../component/Map';
import { useGet } from '../../api';
import UpdateBasketDialog from '../../component/UpdateBasketDialog';

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

function MapView() {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const [basketPosition, setBasketPosition] = useState(null);
  const [selectedBasket, setSelectedBasket] = useState();
  const { payload, getAll: getAllBasket } = useGet('/baskets');

  const handleAddBasket = ({ latLng }) => {
    setBasketPosition({ lat: latLng.lat(), lng: latLng.lng() });
    setOpenDialog(true);
  };

  const handleShowBaskets = () => {
    setOpenDialog(!openDialog);
  };

  const handleUpdateBasket = (event, id) => {
    setOpenDialog(!openDialog);
    setSelectedBasket(id);
  };

  useEffect(getAllBasket, []);

  return (
    <div className={classes.mapContainer}>
      <Switch>
        <Route path="/baskets/add">
          <Map
            markerClick={handleShowBaskets}
            data={payload}
            onClick={handleAddBasket}
          />
          <AddBasketDialog
            setOpenDialog={setOpenDialog}
            openDialog={openDialog}
            coordinates={basketPosition}
            onSuccess={getAllBasket}
          />
        </Route>
        <Route path="/baskets/show">
          <Map markerClick={handleShowBaskets} data={payload} />
        </Route>
        <Route path="/baskets/update">
          <Map markerClick={handleShowBaskets} data={payload} />
        </Route>
        <Route path="/baskets/update-software">
          <Map markerClick={handleUpdateBasket} data={payload} />
          {selectedBasket && (
            <UpdateBasketDialog
              basket={selectedBasket}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
            />
          )}
        </Route>
      </Switch>
    </div>
  );
}

export default MapView;
