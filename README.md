# rewritable-pr-comment

Github Action that posts a PR / issue comment that re-writes itself on update

## Inspiration

Are you tired of the same test output bot commenting on your pull request after every commit, ruining the look and the number of comments on your PR? Well, you've come to the right place. The inspiration behind this action comes from a similar frustration. This action will leave a custom comment on your PR and will update *just that comment* on an update, rather than create a new one.

## Usage

```yaml
on:
  pull_request:
    branches: [ master ]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      issues: write       # needed for the action to post / update comments
      pull-requests: write
    steps:
    # ... Steps that build / test / anything else that's needed
    - uses: phulsechinmay/rewritable-pr-comment@v0.4.0
      with:
        message: ${{ steps.ci-tests.output.message }} # Print the output message from a step that tests something
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        COMMENT_IDENTIFIER: "test-output-comment-rewritable-action" # Put some identifier here that will be unique among comments in the PR
```

### Permissions

The action needs to create and update comments on your PRs / issues, so the
workflow must grant it write access:

```yaml
permissions:
  issues: write
  pull-requests: write
```

(For `pull_request` / `pull_request_target` events `pull-requests: write` is
what grants comment permissions on the PR; `issues: write` covers `issues`
events and lets the action use the `ISSUE_ID` input on plain issues.)

## Configuration options

| Variable or Argument  | Location | Description                                                                                                                 | Required |
| --------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- | -------- |
| message               | with     | The message to be displayed in the comment, supports Markdown, HTML and Unicode.                                      | yes      |
| GITHUB_TOKEN            | with     | A valid GitHub token, either the temporary token GitHub provides or a personal access token.                                | yes    |
| COMMENT_IDENTIFIER | with     | This will be used to identify the comment that is to be overwritten. You could put some random strings here or just describe what the comment will contain. Check usage for example. | no (Only needed when using the bot for multiple PR workflows).        |
| ISSUE_ID | with     | Identifier for the PR / issue the comment should be made on. Defaults to the PR the workflow / action is running on.  | no        |

## Outputs

| Output     | Description                                    |
| ---------- | ---------------------------------------------- |
| comment-id | The ID of the newly created / updated comment. |

```yaml
- uses: phulsechinmay/rewritable-pr-comment@v0.4.0
  id: pr-comment
  with:
    message: "Hello!"
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
- run: echo "Comment ID is ${{ steps.pr-comment.outputs.comment-id }}"
```
