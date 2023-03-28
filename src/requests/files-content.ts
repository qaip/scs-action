import { GitHub } from '@actions/github/lib/utils'
type Octokit = InstanceType<typeof GitHub>

export const getFilesContent = async (
  octokit: Octokit,
  variables: { owner: string; repo: string },
  payload: { branch: string; fileNames: string[] }
): Promise<string[]> =>
  payload.fileNames.length
    ? Object.values(
        (
          await octokit.graphql<{ repository: Record<`file${number}`, { text: string } | null> }>(
            /* GraphQL-Factory */ `
          query ($owner: String!, $repo: String!) {
            repository(owner: $owner, name: $repo) {
              ${payload.fileNames.map(
                (fileName, index) => `
                  file${index}: object(expression: "${payload.branch}:${fileName}") {
                    ... on Blob {
                      text
                    }
                  }
                `
              )}
            }
          }
        `,
            variables
          )
        ).repository
      ).map(node => node?.text ?? '')
    : []
