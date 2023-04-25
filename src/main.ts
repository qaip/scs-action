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

  // Get the names of changed sc-yaml files and the oid of the last commit
  const { fileNames, commitOid } = await getPullRequestData(octokit, {
    ...github.context.repo,
    pullRequestNumber: payload.pull_request.number
  })

  // Exit if no files are changed
  if (!fileNames.length) {
    core.info(`No changes detected`)
    return
  }

  core.info(`Detected new changes in files: { ${fileNames.join(',')} }`)

  // Get the content of changed files
  let filesContent = await getFilesContent(octokit, github.context.repo, {
    fileNames,
    branch: payload.pull_request.head.ref
  })

  // Exclude empty files if ignore_empty input is set
  const ignoreEmpty = core.getInput('ignore_empty')
  if (ignoreEmpty === 'always') {
    filesContent = filesContent.filter(content => content.trim())
  }

  // Generate scs files
  const ignoreErrors = core.getInput('ignore_errors')
  const nonNullable = <T>(value: T): value is NonNullable<T> => value !== undefined
  const files = filesContent
    .map((content, index) => {
      try {
        return generateScsFile(...parse(content, fileNames[index]))
      } catch (e) {
        if (e instanceof Error) {
          core.error(e.message)
          if (ignoreErrors === 'always') {
            return undefined
          }
          process.exit(1)
        } else {
          throw e
        }
      }
    })
    .filter(nonNullable)

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
