import { Octokit } from '.'

export const getPullRequestData = async (
  octokit: Octokit,
  variables: { owner: string; repo: string; pullRequestNumber: number }
): Promise<{ fileNames: string[]; commitOid: string }> => {
  const query = /* GraphQL */ `
    query ($owner: String!, $repo: String!, $pullRequestNumber: Int!) {
      repository(owner: $owner, name: $repo) {
        pullRequest(number: $pullRequestNumber) {
          files(first: 100) {
            nodes {
              path
            }
          }
          headRef {
            target {
              ... on Commit {
                history(first: 1) {
                  nodes {
                    oid
                  }
                }
              }
            }
          }
        }
      }
    }
  `
  type QueryResponse = {
    repository: {
      pullRequest: {
        files: { nodes: { path: string }[] }
        headRef: {
          target: { history: { nodes: [{ oid: string }] } }
        }
      }
    }
  }
  const { repository } = await octokit.graphql<QueryResponse>(query, variables)

  const fileNames = repository.pullRequest.files.nodes
    .map(node => node.path)
    .filter(path => /^.+\.sc\.ya?ml$/.test(path))

  const commitOid = repository.pullRequest.headRef.target.history.nodes.at(0)?.oid
  if (!commitOid) {
    throw new Error('Commit Oid is not found')
  }

  return { fileNames, commitOid }
}
