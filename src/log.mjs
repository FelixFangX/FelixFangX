const clean = (s) => s.split("\n")[0].replace(/^\p{Extended_Pictographic}\s*/u, "").replace(/\|/g, "/").replace(/\s+/g, " ").trim();

// projects: [{ name, repo: "owner/name", description, date }], in display order.
export function renderProjects(projects) {
  return projects
    .map((p) => `| [${p.name}](https://github.com/${p.repo}) | ${clean(p.description || "no description")} | ${p.date ? p.date.slice(0, 10) : "no data"} |`)
    .join("\n");
}

export function inject(readme, table, name = "projects") {
  const re = new RegExp(`(<!-- ${name}:start -->)[\\s\\S]*?(<!-- ${name}:end -->)`);
  return readme.replace(re, `$1\n${table}\n$2`);
}
