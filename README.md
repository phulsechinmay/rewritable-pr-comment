# rewritable-pr-comment

Github Action that posts a PR / issue comment that re-writes itself on update

Updated fork of [phulsechinmay/rewritable-pr-comment](https://github.com/phulsechinmay/rewritable-pr-comment)

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
    steps:
    # ... Steps that build / test / anything else that's needed
    - uses: sammcj/rewritable-pr-comment@v0.3.2
      with:
        message: ${{ steps.ci-tests.output.message }} # Print the output message from a step that tests something
        GITHUB_TOKEN: ${{ secrets.ACTION_TOKEN }}
        COMMENT_IDENTIFIER: "test-output-comment-rewritable-action" # Put some identifier here that will be unique among comments in the PR
```

## Configuration options

| Variable or Argument  | Location | Description                                                                                                                 | Required |
| --------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- | -------- |
| message               | with     | The message to be displayed in the comment, supports Markdown, HTML and Unicode.                                      | yes      |
| GITHUB_TOKEN            | with     | A valid GitHub token, either the temporary token GitHub provides or a personal access token.                                | yes    |
| COMMENT_IDENTIFIER | with     | This will be used to identify the comment that is to be overwritten. You could put some random strings here or just describe what the comment will contain. Check usage for example. | no (Only needed when using the bot for multiple PR workflows).        |
| ISSUE_ID | with     | Identifier for the PR / issue the comment should be made on. Defaults to the PR the workflow / action is running on.  | no        |

