#!/bin/bash
# For this specific machine only (macOS 13 Ventura or earlier).
# Installs dependencies from the lockfile as normal, then locally
# downgrades just @playwright/test so its browser install works on
# this OS. Nothing here touches package.json or package-lock.json —
# --no-save and --no-package-lock guarantee that — so there is
# nothing to accidentally commit from this machine.
#
# Windows, Linux, and CI never run this script; they use the latest
# pinned version from the lockfile as-is.

set -e

echo "Installing dependencies from lockfile (latest Playwright)..."
npm ci

echo "Overriding local Playwright install to a macOS 13-compatible version..."
npm install @playwright/test@1.57.0 --no-save --no-package-lock

echo "Installing browsers for the downgraded version..."
npx playwright install

echo "Done. Reminder: run 'git status' before committing on this machine —"
echo "package.json and package-lock.json should show no changes."
