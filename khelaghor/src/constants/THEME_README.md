# Global Theme Configuration

## How to Change Theme

Edit `src/constants/theme.ts` - all changes will reflect across the project.

## Section-wise Config

| Section       | Config Key      | What it controls                                                      |
| ------------- | --------------- | --------------------------------------------------------------------- |
| Header        | `header`        | Background, logo, buttons (login/signup/deposit/wallet), profile menu |
| Mobile Bar    | `mobile_bar`    | Bottom navigation on mobile                                           |
| Banner        | `banner`        | Hero slider nav buttons, indicators, heights                          |
| Popular Games | `popular_games` | Section title, game cards, play button                                |
| Footer        | `footer`        | Background, headings, links, dividers                                 |
| Sidebar       | `sidebar`       | Navigation menu colors                                                |
| Modals        | `modals`        | Popup dialogs styling                                                 |
| Forms         | `forms`         | Input fields, labels                                                  |
| Buttons       | `buttons`       | Global button styles (primary/danger/secondary)                       |
| Typography    | `typography`    | Font sizes for headings and body                                      |
| Brand         | `brand`         | Site name, logo path, favicon                                         |
| Colors        | `colors`        | Global color palette                                                  |

## Quick Examples

### Change Header Background

```ts
header: {
  background: "#ff0000", // Change this
  ...
}
```

### Change Login Button Color

```ts
header: {
  buttons: {
    login: {
      bg: "linear-gradient(to bottom, #00ff00, #008800)", // Change this
      text: "#ffffff",
    },
    ...
  }
}
```

### Change Logo

```ts
header: {
  logo: {
    src: "/images/new-logo.png", // Change this
    height_mobile: 24,
    height_desktop: 40, // Make logo bigger on desktop
  },
}
```

### Change Popular Games Card Color

```ts
popular_games: {
  card: {
    bg: "#1a1a2e", // Card background
    footer_bg: "#16213e", // Card footer
    text_color: "#ffffff",
    play_button_bg: "#e94560", // Play button
  },
}
```

### Change Footer Heading Color

```ts
footer: {
  heading_color: "#f7b500", // Yellow headings
  ...
}
```
