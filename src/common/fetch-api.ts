import fetch from 'node-fetch';
import { EndpointeEnum } from '../enpoints.enum';
import * as dotenv from 'dotenv';

dotenv.config();

const url = process.env.API_URL;

export const fetchApi = (endpoint: EndpointeEnum, init: RequestInit) => {
	return fetch(url + endpoint, {
		...init,
		headers: {
			'x-bodzio-secret': process.env.API_SECRET as string
		}
	});
};
