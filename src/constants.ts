export const Tool = {
  Name: 'Hugo',
  Org: 'gohugoio',
  Repo: 'hugo',
  CmdName: 'hugo',
  CmdOptVersion: 'version',
  TestVersionLatest: '0.83.1',
  TestVersionSpec: '0.82.1'
} as const;

export enum Action {
  WorkDirName = 'actions_hugo',
  TempDirName = '_temp'
}
