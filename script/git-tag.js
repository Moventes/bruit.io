const exec = require("child_process").exec;
const package = require("./../package");

function getCurrentVersion() {
  return package.version;
}

function getLastGitTag() {
  return new Promise((resolve, reject) => {
    exec("git tag", (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(
          stdout
            .split("\n")
            .filter(version => version.length >= 5)
            .pop()
        );
      }
    });
  });
}

getLastGitTag()
  .then(lastGitTag => {
    const currentVersion = getCurrentVersion();
    console.log("current version = ", currentVersion);
    console.log("latest tag      = ", lastGitTag);
    if (currentVersion !== lastGitTag) {
      exec(
        `git tag ${currentVersion} -m v${currentVersion} && git push --tags`,
        err => {
          if (err) {
            console.error("git tag error : ", err);
          } else {
            console.log("successfully tagged to ", currentVersion);
          }
        }
      );
    } else {
      console.log("same tag/version => no need to tag.");
    }
  })
  .catch(err => console.error("git tag (get) error : ", err));
