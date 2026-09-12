const core = require("@actions/core");
const github = require("@actions/github");
const DEFAULT_COMMENT_IDENTIFIER = "4YE2JbpAewMX4rxmRnWyoSXoAfaiZH19QDB2IR3OSJTxmjSu";

async function findExistingComment(octokit, owner, repo, issue_number, commentIdentifier) {
  // Paginate through *all* comments so PRs with many comments are handled,
  // not just the first page of results.
  const comments = await octokit.paginate(octokit.rest.issues.listComments, {
    owner,
    repo,
    issue_number,
  });

  let existingCommentId;
  for (const comment of comments) {
    // Guard against null/undefined bodies (e.g. deleted or body-less comments).
    if (typeof comment.body === "string" && comment.body.includes(commentIdentifier)) {
      existingCommentId = comment.id;
    }
  }
  return existingCommentId;
}

async function run() {
  try {
    const ctx = github.context;

    const commentMessage = core.getInput("message", { required: true });
    const commentId = core.getInput("COMMENT_IDENTIFIER") || DEFAULT_COMMENT_IDENTIFIER;
    const githubToken = core.getInput("GITHUB_TOKEN", { required: true });

    // Resolution order: explicit ISSUE_ID input first, then the PR / issue
    // number from the event payload (covers pull_request, pull_request_target
    // and issues events), otherwise fail with a clear message.
    const issueIdInput = core.getInput("ISSUE_ID");
    let issue_number;
    if (issueIdInput) {
      issue_number = Number(issueIdInput);
    } else if (ctx.issue && ctx.issue.number) {
      issue_number = ctx.issue.number;
    }
    const { owner, repo } = ctx.repo;

    if (!issue_number || Number.isNaN(issue_number)) {
      core.setFailed(
        "Could not determine the PR / issue number. Run this action on a pull_request, pull_request_target or issues event, or pass the ISSUE_ID input."
      );
      return;
    }

    const octokit = github.getOctokit(githubToken);

    // Suffix comment with hidden value to check for updating later.
    const commentIdSuffix = `\n\n\n<hidden purpose="for-rewritable-pr-comment-action-use" value="${commentId}"></hidden>`;

    // If comment already exists, get the comment ID.
    const existingCommentId = await findExistingComment(octokit, owner, repo, issue_number, commentIdSuffix);

    const commentBody = commentMessage + commentIdSuffix;
    let comment;
    if (existingCommentId) {
      comment = await octokit.rest.issues.updateComment({
        owner,
        repo,
        comment_id: existingCommentId,
        body: commentBody,
      });
    } else {
      comment = await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number,
        body: commentBody,
      });
    }

    core.setOutput("comment-id", comment.data.id);
  } catch (e) {
    core.setFailed(e.message);
  }
}

run();
