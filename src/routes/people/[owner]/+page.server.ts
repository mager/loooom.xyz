import {error} from '@sveltejs/kit';
import {listHarnesses} from '$lib/server/harness-store';
import type {PageServerLoad} from './$types';
export const load:PageServerLoad=async ({params})=>{const {harnesses}=await listHarnesses({owners:[params.owner]});if(!harnesses.length)error(404,'This person has no shared files yet.');return {owner:harnesses[0].snapshot.owner,harnesses};};
