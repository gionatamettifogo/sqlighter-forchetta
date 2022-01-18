// https://www.npmjs.com/package/axios
import axios from 'axios';
import { assert } from 'console';

export async function getApiJson(relativeUrl: string) {
	assert(relativeUrl.startsWith('/'));
	const url = 'https://api.insieme.app' + relativeUrl;
//	const url = 'http://localhost:8055' + relativeUrl;
	const token = 'topolino';
	try {
		const results = await axios.get(url, {
			headers: { Authorization: `Bearer ${token}` },
		});

		return results.data;
	} catch (exception) {
		console.error(`getApiJson - ${url}`, exception);
		throw exception;
	}
}

/** Rounds number to two decimal digits at most */
export function round(value: number) {
  return Math.round(value * 100.0) / 100.0;
}