import {listHarnesses} from '$lib/server/harness-store';
export const load=async()=>({storageAvailable:(await listHarnesses()).storageAvailable});
