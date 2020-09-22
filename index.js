const core = require("@actions/core");
const github = require("@actions/github");
const DEFAULT_COMMENT_IDENTIFIER = "4YE2JbpAewMX4rxmRnWyoSXoAfaiZH19QDB2IR3OSJTxmjSu"

async function checkForExistingComment(octokit, repo, owner, issue_number, commentIdentifier) {
  const existingComments = await octokit.issues.listComments({
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

    const pr_number = core.getInput('PR_NUMBER') ? core.getInput('COMMENT_IDENTIFIER') : ctx.payload.pull_request.number;
    const { owner, repo } = ctx.repo;

    console.log(pr_number);

    if (!pr_number) {
      core.setFailed("Action must run on a Pull Request.");
      return;
    }

    const octokit = new github.GitHub(githubToken);

    // Suffix comment with hidden value to check for updating later.
    const commentIdSuffix = `\n\n\n<hidden purpose="for-rewritable-pr-comment-action-use" value="${commentId}"></hidden>`;

    // If comment already exists, get the comment ID.
    const existingCommentId = await checkForExistingComment(octokit, repo, owner, pr_number, commentIdSuffix)

    const commentBody = commentMessage + commentIdSuffix;
    let comment = undefined;
    if (existingCommentId) {
      comment = await octokit.issues.updateComment({
        repo, owner,
        comment_id: existingCommentId,
        body: commentBody
      })
    } else {
      comment = await octokit.issues.createComment({
        repo, owner,
        issue_number: pr_number,
        body: commentBody
      });
    }

    core.setOutput("comment-id",comment.data.id);

  } catch (e) {
    core.setFailed(e.message);
  }
}

run().then();