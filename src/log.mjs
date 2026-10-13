const clean = (s) => s.split("\n")[0].replace(/^\p{Extended_Pictographic}\s*/u, "").replace(/\|/g, "/").trim().slice(0, 72);

// commits: [{ repo: "owner/name", date: ISO string, message }], one per repo.
export function renderLog(commits, limit = 6) {
  return [...commits]
    .sort((x, y) => y.date.localeCompare(x.date))
    .slice(0, limit)
    .map(({ repo, date, message }) => `| ${date.slice(0, 10)} | [${repo.split("/")[1]}](https://github.com/${repo}) | ${clean(message)} |`)
    .join("\n");
}

export function inject(readme, table, name = "agent-log") {
  const re = new RegExp(`(<!-- ${name}:start -->)[\\s\\S]*?(<!-- ${name}:end -->)`);
  return readme.replace(re, `$1\n${table}\n$2`);
}
