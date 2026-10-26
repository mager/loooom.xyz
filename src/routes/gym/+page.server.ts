import { savedGymReports } from '$lib/server/gym';
export function load() { return {reports:savedGymReports()}; }
