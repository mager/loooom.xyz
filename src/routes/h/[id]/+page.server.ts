import {error} from '@sveltejs/kit';
import {getHarness} from '$lib/server/harness-store';
import type {PageServerLoad} from './$types';
export const load:PageServerLoad=async ({params})=>{const harness=await getHarness(params.id);if(!harness)error(404,'This file was not found.');return {harness};};
