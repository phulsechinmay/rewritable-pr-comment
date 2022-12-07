const core = require('@actions/core');
const github = require('@actions/github');

const DEFAULT_COMMENT_IDENTIFIER = '4YE2JbpAewMX4rxmRnWyoSXoAfaiZH19QDB2IR3OSJTxmjSu';

async function checkForExistingComment(octokit, repo, owner, issueNumber, commentIdentifier) {
  const { data: existingComments } = await octokit.issues.listComments({
    repo,
    owner,
    issue_number: issueNumber,
  });

  let existingCommentId;
  existingComments.forEach(({ body, id }) => {
    if (body.includes(commentIdentifier)) existingCommentId = id;
  });

  return existingCommentId;
}

async function run() {

  try {
    const { repo, payload } = github.context;
    const { owner, number: issueNumber } = payload.pull_request;

    if (!issueNumber) {
      core.setFailed('Action must run on a Pull Request.');
      return;
    }

    const commentMessage = core.getInput('message');
    const commentId = core.getInput('COMMENT_IDENTIFIER', { default: DEFAULT_COMMENT_IDENTIFIER });
    const githubToken = core.getInput('GITHUB_TOKEN');

    const octokit = new github.GitHub(githubToken);

    // Suffix comment with hidden value to check for updating later.
    const commentIdSuffix = `\n\n\n<hidden purpose="for-rewritable-pr-comment-action-use" value="${commentId}"></hidden>`;

    // If comment already exists, get the comment ID.
    const existingCommentId = await checkForExistingComment(
      octokit,
      repo,
      owner,
      issueNumber,
      commentIdSuffix,
    );

    const commentBody = `${commentMessage}${commentIdSuffix}`;
    let comment;
    if (existingCommentId) {
      comment = await octokit.issues.updateComment({
        repo,
        owner,
        comment_id: existingCommentId,
        body: commentBody,
      });
    } else {
      comment = await octokit.issues.createComment({
        repo,
        owner,
        issue_number: issueNumber,
        body: commentBody,
      });
    }

    core.setOutput('comment-id', comment.data.id);

    return comment;

  } catch (e) {
    core.setFailed(e.message);
  }

}

module.exports = { run };

// call and export run function
run();
