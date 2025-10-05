
# Teddy Travels — Kid-Friendly RFID Travel Log (PWA)

This build gives the whole app a child-friendly teddy-bear theme:
- Warm colors, big buttons, rounded panels
- Home hero with a teddy illustration
- Renamed sections: Postcard, Stories, Ideas
- Invite page with simple language
- Still includes: map, postcards, stories, invite/share, recommendations
- PWA installable

## Quick start
1) Copy `.env.example` to `.env` and set:
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_DEFAULT_TAG_ID="demo-tag"

2) In VS Code terminal:
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev

Open http://localhost:3001

## Pages
- Home: /
- Map: /map
- Postcard: /postcard/new
- Stories: /logs
- Invite followers: /invite  (public view: /share/XXXX)
- Trip Ideas: /recommendations
