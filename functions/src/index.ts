/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as logger from 'firebase-functions/logger';

import { initializeApp } from 'firebase-admin/app';
import { defineString } from 'firebase-functions/params';
import axios, { isAxiosError } from 'axios';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

const RAPID_API_KEY = defineString('RAPID_API_KEY');
const QUOTES_API_URL = 'https://quotes15.p.rapidapi.com/quotes/random/';
const QUOTES_COLLECTION = 'quotes';

initializeApp();

interface Originator {
	id: number;
	language_code: string;
	description: string;
	master_id: number;
	name: string;
	url: string;
}

interface Quote {
	id: number;
	originator: Originator;
	language_code: string;
	content: string;
	url: string;
	tags: string[];
}

export const fetchAndStoreRandomQuote = onSchedule(
	'every day 00:00',
	async () => {
		const config = {
			method: 'get',
			maxBodyLength: Infinity,
			url: QUOTES_API_URL,
			headers: {
				'x-rapidapi-key': RAPID_API_KEY.value(),
				'x-rapidapi-host': 'quotes15.p.rapidapi.com',
			},
		};
		try {
			const result = await axios.request<Quote>(config);
			const quote = result.data;

			logger.info('Received quote:', { structuredData: true, quote });
			const docRef = getFirestore()
				.collection(QUOTES_COLLECTION)
				.doc(quote.id.toString());
			await docRef.set(
				{
					...quote,
					timestamp: FieldValue.serverTimestamp(),
				},
				{ merge: true }
			);

			logger.info('Saved quote:', { structuredData: true, quoteId: quote.id });
		} catch (error) {
			if (isAxiosError(error)) {
				logger.error(
					'Error fetching quote:',
					error.message,
					error.response?.data
				);
			} else if (error instanceof Error) {
				logger.error('Error storing quote:', error.message);
			} else {
				logger.error('Unknown error:', error);
			}
		}
	}
);
