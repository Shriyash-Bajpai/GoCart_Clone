import ImageKit from '@imagekit/nodejs';

export const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  
});

export default client;