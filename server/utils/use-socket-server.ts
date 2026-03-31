import Ably from 'ably';

// https://ably.com/docs
export type SocketCapability = Ably.Types.capabilityOp;

export default () => {
    const config = useRuntimeConfig();
    const client = new Ably.Realtime({ key: config.ably.root });

    // createTokenRequest()
    async function requestToken(clientId: string, capability?: { [key: string]: Ably.Types.capabilityOp[]; }) {
        return new Promise<Ably.Types.TokenDetails>((resolve, reject) => {
            client.auth.requestToken({ clientId, capability }, (err, token) => {
                if (err) reject(err);
                if (token) resolve(token);
            })
        })
    }

    async function refresh(socket: Ably.Types.TokenDetails) {
        return new Promise<Ably.Types.TokenDetails>((resolve, reject) => {
            client.auth.requestToken({ clientId: socket.clientId, capability: socket.capability }, (err, token) => {
                if (err) reject(err);
                if (token) resolve(token);
            })
        })
    }

    const auth = client.auth;
    const channels = client.channels;
    const close = () => client.close();

    return {
        auth,
        channels,
        close,
        requestToken,
        refresh
    }

}