import redis from 'redis';
import JWTR from 'jwt-redis';
import { promisify } from 'util';

export const client = redis.createClient({
  port: 6379,
  host: 'localhost',
});

export const jwtr = new JWTR(client);

export const getClientAsync = promisify(client.get).bind(client);

client.on('connect', () => {
  console.log('client connected');
});

client.on('error', err => {
  console.log(err.message);
});

client.on('end', () => {
  console.log('client disconnected from redis');
});

process.on('SIGINT', () => {
  client.quit();
});
