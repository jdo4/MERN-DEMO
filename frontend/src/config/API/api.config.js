// const protocol = `${process.env.REACT_APP_PROTOCOL}`;
// const host = `${process.env.REACT_APP_HOST}`;
// const apiPort = `${process.env.REACT_APP_PORT}`;
// const trailUrl = `${process.env.REACT_APP_TRAIL_URL}`;

const protocol = `http`;
const host = `192.168.1.3`;
const apiPort = `8080`;
const trailUrl = `api/v1`;

const hostUrl = `${protocol}://${host}/`;
const endpoint = `${protocol}://${host}:${apiPort}/${trailUrl}`;
const imagePoint = `${protocol}://${host}:${apiPort}`;

const API_LOCAL = {
    protocol: protocol,
    host: host,
    port: apiPort,
    apiUrl: trailUrl,
    endpoint: endpoint,
    hostUrl: hostUrl,
    imagePoint
};

export const API = API_LOCAL
