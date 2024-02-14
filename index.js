const core = require("@actions/core");
const github = require("@actions/github");
const DEFAULT_COMMENT_IDENTIFIER = "4YE2JbpAewMX4rxmRnWyoSXoAfaiZH19QDB2IR3OSJTxmjSu"

async function checkForExistingComment(octokit, repo, owner, issue_number, commentIdentifier) {
  const existingComments = await octokit.rest.issues.listComments({
    repo, owner, issue_number
  });

  let existingCommentId = undefined;
  if (Array.isArray(existingComments.data))
    existingComments.data.forEach(({ body, id }) => {
      if (body.includes(commentIdentifier))
        existingCommentId = id;
    })
  return existingCommentId;
}

async function run() {
  try {
    const ctx = github.context;

    const commentMessage = core.getInput('message');
    const commentId = core.getInput('COMMENT_IDENTIFIER') ? core.getInput('COMMENT_IDENTIFIER') : DEFAULT_COMMENT_IDENTIFIER;
    const githubToken =core.getInput('GITHUB_TOKEN');

    const issue_id = core.getInput('ISSUE_ID') ? core.getInput('ISSUE_ID') : ctx.payload.pull_request.number;
    const { owner, repo } = ctx.repo;

    if (!issue_id) {
      core.setFailed("Action must run on a Pull Request.");
      return;
    }

    const octokit = github.getOctokit(token);

    // Suffix comment with hidden value to check for updating later.
    const commentIdSuffix = `\n\n\n<hidden purpose="for-rewritable-pr-comment-action-use" value="${commentId}"></hidden>`;

    // If comment already exists, get the comment ID.
    const existingCommentId = await checkForExistingComment(octokit, repo, owner, issue_id, commentIdSuffix)

    const commentBody = commentMessage + commentIdSuffix;
    let comment = undefined;
    if (existingCommentId) {
      comment = await octokit.rest.issues.updateComment({
        repo, owner,
        comment_id: existingCommentId,
        body: commentBody
      })
    } else {
      comment = await octokit.rest.issues.createComment({
        repo, owner,
        issue_number: issue_id,
        body: commentBody
      });
    }

    core.setOutput("comment-id",comment.data.id);

  } catch (e) {
    core.setFailed(e.message);
  }
}

run().then();
