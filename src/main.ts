import * as core from '@actions/core'
import * as github from '@actions/github'
// eslint-disable-next-line import/no-unresolved
import { PullRequestEvent } from '@octokit/webhooks-definitions/schema'
import { generateScsFile } from './generate'
import { commitFiles, getFilesContent, getPullRequestData } from './requests/'
import { parse } from './validate'

async function run(): Promise<void> {
  const githubToken = core.getInput('github_token')
  const octokit = github.getOctokit(githubToken)
  const payload = github.context.payload as PullRequestEvent

  const { fileNames, commitOid } = await getPullRequestData(octokit, {
    ...github.context.repo,
    pullRequestNumber: payload.pull_request.number
  })

  if (!fileNames.length) {
    core.info(`No changes detected`)
    return
  }

  core.info(`Detected new changes in files: { ${fileNames.join(',')} }`)

  const fileContents = await getFilesContent(octokit, github.context.repo, {
    fileNames,
    branch: payload.pull_request.head.ref
  })

  // Generate files
  const files = fileContents.map((content, index) => generateScsFile(parse(content), fileNames[index]))

  // Commit and push generated scs files
  const commitUrl = await commitFiles(
    octokit,
    {
      repo: payload.repository.full_name,
      branch: payload.pull_request.head.ref,
      oid: commitOid
    },
    { files }
  )

  core.info(`Successfully made a commit: ${commitUrl}`)
}

try {
  run()
} catch (error) {
  core.setFailed((error as Error).message)
}
