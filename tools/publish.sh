#!/bin/sh
# Publish the site on GitHub Pages: builds dist/ and commits it to the gh-pages branch, then pushes.
# Only new or changed files are uploaded (photos and videos are the same objects already on main).
# Usage: sh tools/publish.sh
set -e
cd "$(dirname "$0")/.."
URL=https://ilaria1604.github.io/pionier-etrusco
NODE=$(command -v node || echo "$HOME/.local/node/bin/node")

"$NODE" tools/build.mjs "$URL"
touch dist/.nojekyll

GITDIR=$(git rev-parse --absolute-git-dir)
IDX="$GITDIR/gh-pages.index"
rm -f "$IDX"
(cd dist && GIT_INDEX_FILE="$IDX" git --git-dir="$GITDIR" --work-tree=. add -A .)
TREE=$(GIT_INDEX_FILE="$IDX" git write-tree)
rm -f "$IDX"

PARENT=$(git rev-parse -q --verify refs/heads/gh-pages || true)
if [ -n "$PARENT" ] && [ "$(git rev-parse "$PARENT^{tree}")" = "$TREE" ]; then
  echo "gh-pages già aggiornato, niente da pubblicare"
else
  COMMIT=$(git commit-tree "$TREE" ${PARENT:+-p "$PARENT"} -m "Pubblica main@$(git rev-parse --short HEAD)")
  git update-ref refs/heads/gh-pages "$COMMIT"
fi
git push origin gh-pages
echo "Online tra circa un minuto: $URL/"
