import { GitHub } from '@actions/github/lib/utils'
export type Octokit = InstanceType<typeof GitHub>

export { commitFiles } from './commit-files'
export { getFilesContent } from './files-content'
export { getPullRequestData } from './pull-request-data'
