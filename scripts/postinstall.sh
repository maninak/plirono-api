#!/bin/sh

# Installs git hook that verifies commit messages comply with the angular convention
ln -sfn ../../node_modules/angular-precommit/index.js .git/hooks/commit-msg

# Removes spammy console.log for each single compiled file by grunt-ts package
sed -i "s/^.*### Fast Compile.*$//" node_modules/grunt-ts/tasks/modules/compile.js