// Pin the available source build until npm 0.3.0 is released.
export const GYM_SOURCE = 'https://github.com/mager/loooom/archive/f45997f86ced5d8db2020ab74b9e761fc1f30a39.tar.gz';
export const GYM_GUIDE = 'https://github.com/mager/loooom/tree/codex/skills-gym/gym';
export const shellArg = (value: string) => `'${value.replaceAll("'", "'\"'\"'")}'`;
export const gymCommand = (mode: 'run' | 'climb', id: string, model: string, flags = '') => `npx --yes ${GYM_SOURCE} gym ${mode} ${shellArg(id)}${flags}${model==='CLI default (unconfigured)'?'':` --model ${shellArg(model)}`}`;
