<script lang="ts">
 let {name,size=20}: {name:string;size?:number}=$props();
 const paths:Record<string,string>={
  discover:'M12 3 21 12 12 21 3 12Z M15 9 13 13 9 15 11 11Z',
  people:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M17 4a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  bookmark:'M6 3h12v18l-6-4-6 4Z',
  arrow:'M5 12h14 M13 6l6 6-6 6',
  external:'M14 3h7v7 M21 3 10 14 M10 3H3v18h18v-7',
  plus:'M12 5v14 M5 12h14',
  search:'M21 21l-6-6 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  file:'M14 2H4v20h16V8Z M14 2v6h6 M8 13h8 M8 17h5',
  code:'m8 7-5 5 5 5 m8-10 5 5-5 5 M14 4l-4 16',
  flask:'M9 3h6 M10 3v7l-6 9a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2l-6-9V3 M8 15h8',
  layers:'m12 3 10 5-10 5L2 8Z M2 12l10 5 10-5 M2 16l10 5 10-5',
  git:'M6 3v12a4 4 0 0 0 8 0V9 M14 9h4 M9 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M21 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  clock:'M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  check:'m5 12 4 4L19 6',
  copy:'M9 9h12v12H9Z M5 15H3V3h12v2',
  heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
  refresh:'M20 11a8 8 0 0 0-14-5L3 9 M3 3v6h6 M4 13a8 8 0 0 0 14 5l3-3 M21 21v-6h-6',
  github:'M9 19c-4 1-4-2-6-2 M15 22v-4a3 3 0 0 0-1-2c3 0 6-1 6-6a5 5 0 0 0-1-4 5 5 0 0 0 0-4s-1 0-4 2a14 14 0 0 0-6 0C6 2 5 2 5 2a5 5 0 0 0 0 4 5 5 0 0 0-1 4c0 5 3 6 6 6a3 3 0 0 0-1 2v4'
 };
</script>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d={paths[name]??paths.file}/></svg>
