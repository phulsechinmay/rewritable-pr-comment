const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const ctx = github.context;

    const commentMessage = core.getInput('message');
    const commentId = core.getInput('COMMENT_IDENTIFIER');
    const githubToken =core.getInput('GITHUB_TOKEN');

    const pr_number = ctx.payload.pull_request;
    const { owner, repo } = ctx.repo;

    if (!pr_number) {
      core.setFailed("Action must run on a Pull Request.");
      return;
    }

    const octokit = new github.GitHub(githubToken);
    const existingComments = await octokit.issues.listComments({
      repo,
      owner,
      issue_number: pr_number
    });

    // Suffix 
    const commentIdSuffix = `\n\n\n<hidden purpose="for-rewritable-pr-comment-action-use" value="${commentId}"></hidden>`;

    // If comment already exists, get the comment ID.
    let existingCommentId = undefined;
    if (Array.isArray(existingComments.data))
      existingComments.data.forEach(({ body, id }) => {
        if (body.includes(commentIdSuffix))
          existingCommentId = id;
      })
    
    const commentBody = commentMessage + commentIdSuffix;
    let comment = undefined;
    if (existingCommentId) {
      comment = await octokit.issues.updateComment({
        repo,
        owner,
        comment_id: existingCommentId,
        body: commentBody
      })
    } else {
      comment = await octokit.issues.createComment({
        repo,
        owner,
        issue_number: pr_number,
        body: commentBody
      });
    }

    console.log(comment);

  } catch (e) {
    core.setFailed(e.message);
  }
}

run().then();