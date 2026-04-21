# Claude Code

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

This project uses HeroUI (`@heroui/react` v3) for all UI components.
See `.claude/skills/heroui/SKILL.md` for component usage rules and color token reference.

**UI rules (always apply):**

- Uss `pnpm` instead of yarn or npm
- Never hardcode colors — use HeroUI semantic tokens (`text-primary`, `bg-content1`, etc.)
- Never use raw HTML elements when HeroUI has an equivalent component (`<Button>` not `<button>`, `<Input>` not `<input>`, `<Chip>` not `<span>`, etc.)
- Never use Tailwind color classes (`bg-blue-500`, `text-gray-700`) — use theme tokens only
