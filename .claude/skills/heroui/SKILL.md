---
name: heroui
description: Use when building UI components in this project. Enforces HeroUI component usage, theme tokens, and design consistency rules.
---

# HeroUI UI Development

This project uses `@heroui/react` v3. Always use HeroUI components and theme tokens — never raw HTML elements or hardcoded colors.

## Core Rules

### Never hardcode colors
```tsx
// BAD
<div style={{ color: '#3b82f6' }} />
<div className="text-[#3b82f6]" />
<div className="bg-blue-500" />

// GOOD
<div className="text-primary" />
<div className="bg-primary" />
<div className="text-default-500" />
```

Use semantic color tokens: `primary`, `secondary`, `success`, `warning`, `danger`, `default`.
Use shade variants: `{color}-50` through `{color}-900`, or `{color}-foreground`.

### Never use raw HTML elements when HeroUI has a component
| Instead of        | Use                          |
| ----------------- | ---------------------------- |
| `<button>`        | `<Button>`                   |
| `<input>`         | `<Input>`                    |
| `<a>`             | `<Link>` or NextImage        |
| `<select>`        | `<Select>` + `<SelectItem>`  |
| `<img>`           | HeroUI `<Image>` or Next.js  |
| `<div>` as card   | `<Card>` + `<CardBody>`      |
| `<ul>/<li>` list  | `<Listbox>` or `<Dropdown>`  |
| `<table>`         | `<Table>` components         |
| `<form>` field    | `<Form>` + HeroUI inputs     |
| Modal/dialog      | `<Modal>` components         |
| Tabs              | `<Tabs>` + `<Tab>`           |
| Tooltip           | `<Tooltip>`                  |
| Loading spinner   | `<Spinner>`                  |
| Progress bar      | `<Progress>`                 |
| Chip/tag/badge    | `<Chip>`                     |
| Avatar            | `<Avatar>`                   |
| Divider           | `<Divider>`                  |
| Breadcrumb        | `<BreadcrumbItem>`           |
| Switch/toggle     | `<Switch>`                   |
| Checkbox          | `<Checkbox>`                 |
| Radio             | `<RadioGroup>` + `<Radio>`   |
| Slider            | `<Slider>`                   |
| Textarea          | `<Textarea>`                 |
| Skeleton          | `<Skeleton>`                 |
| Popover           | `<Popover>` components       |
| Accordion         | `<Accordion>` + `<AccordionItem>` |
| Navbar            | `<Navbar>` components        |

## Component Patterns

### Button
```tsx
import { Button } from "@heroui/react";

<Button color="primary" variant="solid">Submit</Button>
<Button color="danger" variant="flat">Delete</Button>
<Button isLoading={loading} color="primary">Save</Button>
<Button as="a" href="/path" color="default" variant="light">Link</Button>
```

### Input / Form fields
```tsx
import { Input, Textarea, Select, SelectItem } from "@heroui/react";

<Input label="Username" placeholder="Enter username" variant="bordered" />
<Input type="password" label="Password" variant="bordered" isInvalid={!!error} errorMessage={error} />
<Textarea label="Description" variant="bordered" />
<Select label="Category" variant="bordered">
  {items.map(i => <SelectItem key={i.value}>{i.label}</SelectItem>)}
</Select>
```

### Card
```tsx
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";

<Card>
  <CardHeader><h3 className="text-lg font-semibold">{title}</h3></CardHeader>
  <CardBody>{content}</CardBody>
  <CardFooter><Button color="primary">Action</Button></CardFooter>
</Card>
```

### Modal
```tsx
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";

const { isOpen, onOpen, onClose } = useDisclosure();
<Button onPress={onOpen}>Open</Button>
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalContent>
    <ModalHeader>Title</ModalHeader>
    <ModalBody>Content</ModalBody>
    <ModalFooter>
      <Button variant="flat" onPress={onClose}>Cancel</Button>
      <Button color="primary" onPress={handleConfirm}>Confirm</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

### Chip (tag/badge)
```tsx
import { Chip } from "@heroui/react";

<Chip color="primary" variant="flat">New</Chip>
<Chip color="success" size="sm">Active</Chip>
```

### Table
```tsx
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

<Table aria-label="Data table">
  <TableHeader>
    <TableColumn>Name</TableColumn>
    <TableColumn>Status</TableColumn>
  </TableHeader>
  <TableBody>
    {rows.map(row => (
      <TableRow key={row.id}>
        <TableCell>{row.name}</TableCell>
        <TableCell><Chip color="success" size="sm">{row.status}</Chip></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Skeleton (loading state)
```tsx
import { Skeleton, Card } from "@heroui/react";

<Card className="space-y-3 p-4">
  <Skeleton className="rounded-lg h-6 w-3/5" />
  <Skeleton className="rounded-lg h-4 w-4/5" />
  <Skeleton className="rounded-lg h-4 w-2/5" />
</Card>
```

## Color Token Reference

| Token                   | Use case                        |
| ----------------------- | ------------------------------- |
| `text-foreground`       | Primary text                    |
| `text-default-500`      | Secondary/muted text            |
| `text-default-400`      | Placeholder/disabled text       |
| `text-primary`          | Brand/action color text         |
| `text-danger`           | Error text                      |
| `text-success`          | Success text                    |
| `text-warning`          | Warning text                    |
| `bg-background`         | Page background                 |
| `bg-content1`           | Card/surface background         |
| `bg-content2`           | Secondary surface               |
| `bg-default-100`        | Subtle background (hover, etc.) |
| `border-divider`        | Divider/border color            |
| `bg-primary`            | Primary brand background        |
| `bg-danger`             | Danger/error background         |

## Anti-patterns to avoid

- Do NOT use Tailwind color classes (`bg-blue-500`, `text-gray-700`) — use HeroUI tokens
- Do NOT use inline `style={{ color: '...' }}` for theming colors
- Do NOT use `<div>` / `<span>` for interactive elements — use `<Button>` with appropriate variant
- Do NOT use `<hr>` — use `<Divider>`
- Do NOT rebuild loading states from scratch — use `<Skeleton>` or `Button isLoading`
- Do NOT use plain `<input>` — always use `<Input>` or `<Checkbox>` etc.
