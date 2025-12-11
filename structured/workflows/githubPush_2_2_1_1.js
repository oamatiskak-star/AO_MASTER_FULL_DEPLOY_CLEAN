import simpleGit from "simple-git";
import fs from "fs";
import path from "path";

const git = simpleGit({
  baseDir: "/opt/render/project/src", // Render git root
});

export default async function pushToGithub(extractDir, moduleName) {
  console.log("Start GitHub push voor:", moduleName);

  try {
    const commitMessage = `Module update: ${moduleName}`;

    await git.add("./*");
    await git.commit(commitMessage);
    await git.push();

    console.log("GitHub push voltooid.");
  } catch (err) {
    console.error("GitHub push fout:", err);
  }
}
