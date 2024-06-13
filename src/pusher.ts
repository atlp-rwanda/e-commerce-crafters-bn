import Pusher from 'pusher';

const pusher = new Pusher({
  appId: '1818484',
  key: '14c00842ec0cbdd7efd4',
  secret: '4a02996b7364796b523c',
  cluster: 'ap2',
  useTLS: true
});

export default pusher