import axios from 'axios';
import { useState } from 'react';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URI,
  headers: {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  },
  responseType: 'json',
});

function getNewToken() {
  return new Promise((resolve, reject) => {
    axios
      .post('http://localhost:5000/api/users/auth/refresh', null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('refresh_token')}`,
        },
      })
      .then(({ data }) => {
        localStorage.setItem('access_token', data.access_token);
        resolve({ token: data.access_token });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status !== 401) {
      return new Promise((resolve, reject) => reject(error));
    }
    // Logout user if token refresh didn't work or user is disabled
    if (
      error.config.url === '/api/users/refresh' ||
      error.response.message === 'Account is disabled.' ||
      error.response.data.message === 'username or password not valid'
    ) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return new Promise((resolve, reject) => reject(error));
    }
    const responseData = getNewToken()
      .then(({ token }) => {
        // New request with new token
        const { config } = error;
        config.headers.Authorization = `Bearer ${token}`;
        localStorage.setItem('access_token', token);

        return new Promise((resolve, reject) => {
          api
            .request(config)
            .then((response) => {
              resolve(response);
            })
            .catch((dataError) => {
              reject(dataError);
            });
        });
      })
      .catch((tokenError) => {
        Promise.reject(tokenError);
      });
    return responseData;
  }
);

export const useGet = (resources) => {
  const [payload, setPayload] = useState(null);
  const [error, onError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const get = (primaryKey = null) => {
    setIsPending(true);
    api
      .get(primaryKey ? `${resources}/${primaryKey}` : resources)
      .then(({ data }) => {
        setPayload(data);
        setIsPending(false);
      })
      .catch((err) => {
        onError(err);
        setIsPending(false);
      });
  };
  const getAll = () => get();
  const getByPK = (primaryKey) => get(primaryKey);
  return { isPending, error, payload, getAll, getByPK, setPayload };
};

export const useCreate = (resources, onCreated) => {
  const [payload, setPayload] = useState(null);
  const [error, onError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const create = (formData) => {
    setIsPending(true);
    api
      .post(resources, formData)
      .then(({ data }) => {
        setPayload(data);
        setIsPending(false);
        onCreated(data);
      })
      .catch((err) => {
        onError(err);
        setIsPending(false);
      });
  };
  return { isPending, error, payload, create, setPayload, onError };
};

export const useUpdate = (resources, onSuccess) => {
  const [payload, setPayload] = useState(null);
  const [error, onError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const update = (formData, primaryKey = null) => {
    setIsPending(true);
    api
      .patch(primaryKey ? `${resources}/${primaryKey}` : resources, formData)
      .then(({ data }) => {
        setPayload(data);
        setIsPending(false);
        onSuccess(data);
      })
      .catch((err) => {
        onError(err);
        setIsPending(false);
      });
  };
  return { isPending, error, payload, update, setPayload };
};

export const useDelete = (resources, onDeleted) => {
  const [payload, setPayload] = useState(null);
  const [error, onError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const deleteItem = (primaryKey) => {
    setIsPending(true);
    api
      .delete(`${resources}/${primaryKey}`)
      .then(({ data }) => {
        setPayload(data);
        setIsPending(false);
        onDeleted(primaryKey);
      })
      .catch((err) => {
        onError(err);
        setIsPending(false);
      });
  };
  const deleteItems = (formData, primaryKey) => {
    setIsPending(true);
    api
      .delete(primaryKey ? `${resources}/${primaryKey}` : resources, {
        data: formData,
      })
      .then(({ data }) => {
        setPayload(data);
        setIsPending(false);
        onDeleted(data);
      })
      .catch((err) => {
        onError(err);
        setIsPending(false);
      });
  };
  return { isPending, error, payload, deleteItem, deleteItems };
};

export const useSend = (resources) => {
  const [payload, setPayload] = useState(null);
  const [error, onError] = useState(null);
  const [progress, setProgress] = useState(0);
  const onUploadProgress = (event) => {
    setProgress(Math.floor((event.loaded / event.total) * 100));
  };
  const send = (formData) => {
    api
      .post(resources, formData, {
        onUploadProgress,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({ data }) => setPayload(data))
      .catch((err) => onError(err));
  };
  return { progress, error, payload, send, setProgress, setPayload };
};

export const usePublish = (topic) => {
  const [payload, setPayload] = useState(null);
  const [error, onError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const publish = (message) => {
    setIsPending(true);
    api
      .post(topic, {
        msg: message,
        baseURL: 'waste-management-red-node.herokuapp.com',
      })
      .then(({ data }) => {
        setPayload(data);
        setIsPending(false);
      })
      .catch((err) => {
        onError(err);
        setIsPending(false);
      });
  };
  return { isPending, error, payload, publish };
};

export const useUpdateDevice = () => {
  const [payload, setPayload] = useState(null);
  const [error, onError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const update = (deviceId, version) => {
    setIsPending(true);
    api
      .post(`baskets/${deviceId}/update`, {
        version,
        baseURL: process.env.API_URL,
      })
      .then(({ data }) => {
        setPayload(data);
        setIsPending(false);
      })
      .catch((err) => {
        onError(err);
        setIsPending(false);
      });
  };
  return { isPending, error, payload, update };
};
export default api;
