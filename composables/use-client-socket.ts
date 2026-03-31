import _ from 'lodash';
import Ably from 'ably';

export default () => {
  const stored = inject('ably') as Ably.Realtime;
  const { getSession } = useAuth();
  const client = stored || new Ably.Realtime({
    authCallback: async (data, callback) => {
      const socket = (await getSession() as any)?.socket;
      if (socket) {
        callback(null, socket)
      } else {
        // console.warn('[Error] socket session token is missing ! Are you sure this role can use sockets ?');
        callback('[Error] socket session token is missing ! Are you sure this role can use sockets ?', null);
      }
    },
  });
  provide('ably', client);
  const auth = client.auth;
  const channels = client.channels;
  const close = () => client.close();


  // avoid subscribe stacking
  onBeforeUnmount(() => {
    close();
  })

  return {
    auth,
    channels,
    close,
  }
}