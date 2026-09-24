# Design Direction

## Surface

Clinic Tasks is an operate-first receptionist workboard for a small clinic.

## Visual World

A paper-white work surface is framed by a deep ink-navy clinic rail. Coral marks the primary action and changes of importance; mint signals completed work; warm yellow provides a small, high-visibility navigation accent. The result feels clear in a busy reception environment without becoming sterile or overly corporate.

## Typography

Manrope gives the product name and headings a compact, confident voice. DM Sans keeps task copy and controls practical and highly readable.

## Composition

Desktop uses a fixed navigation rail with a generous, single-column work area. The first viewport places the receptionist greeting, completion count, composer, and live task list together. Mobile collapses navigation into a scrollable strip and stacks the task composer for comfortable touch use.

## Interaction

Tasks are rendered from state and updated immediately through delegated DOM events. Add, edit, delete, complete, and active-only filtering each announce their result, and tasks persist in local browser storage.
