import { Octokit } from '.'

export const commitFiles = async (
  octokit: Octokit,
  variables: { repo: string; branch: string; oid: string },
  payload: { files: { name: string; content: string }[] }
): Promise<string> =>
  (
    await octokit.graphql<{ createCommitOnBranch: { commit: { commitUrl: string } } }>(
      /* GraphQL-Factory */ `
        mutation ($repo: String!, $branch: String!, $oid: GitObjectID!) {
          createCommitOnBranch(
            input: {
              branch: { repositoryNameWithOwner: $repo, branchName: $branch }
              message: { headline: "Update scs files" }
              fileChanges: {
                additions: [
                  ${payload.files.map(file => `{ path: "${file.name}", contents: "${file.content}" }`)}
                ]
              }
              expectedHeadOid: $oid
            }
          ) {
            commit {
              commitUrl
            }
          }
        }
      `,
      variables
    )
  ).createCommitOnBranch.commit.commitUrl
