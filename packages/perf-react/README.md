# A PoC for assembling Lexical, PERF, Epitelete and Proskomma

## TODO

Low hanging:

- Reorganize conversion code.
- Make Lexical's custom OnChange plugin fire only when there are changes.

Epics:

- Save snapshots to epitelete (onChange with debounce and special handling, or using JSON path)
- Create Plugins for grafts and marks (verses, chapter, headings ,introduction, footnote, etc.)
- Support start translating from a blank editor.

[![Edit in CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/github/codesandbox/codesandbox-template-vite-react/main)

[Configuration](https://codesandbox.io/docs/projects/learn/setting-up/tasks) `.codesandbox/tasks.json` has been added to optimize it for [CodeSandbox](https://codesandbox.io/dashboard).

## Resources

- [CodeSandbox — Docs](https://codesandbox.io/docs/learn)
- [CodeSandbox — Discord](https://discord.gg/Ggarp3pX5H)
- [Vite — GitHub](https://github.com/vitejs/vite)
- [Vite — Docs](https://vitejs.dev/guide/)

## JavaScript Tool Manager

You can use [Volta](https://volta.sh/) with this repo to use the right version of tools such as node and pnpm.

If you don't use Volta just look at the `volta` property in [package.json](https://github.com/abelpz/bible-lexical-editor/blob/main/package.json) to see the right tool versions to install in your preferred way.
