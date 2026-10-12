# Novarix Agro-Business International

Single-page website for Novarix, an international exporter of organic agricultural products.

## Contents

The site is in [`novarix-site/`](./novarix-site/):

- `index.html` contains the single-page structure.
- `css/styles.css` contains the visual system and responsive layout.
- `js/i18n.js` contains English translations; French is the default HTML content.
- `js/main.js` contains language, product selection and contact interactions.
- `assets/` contains the logos and locally stored Unsplash images used by the page.

## Run locally

Open `novarix-site/index.html` in a browser, or serve the folder with any static web server.

## Contact configuration

Before publishing, set at least one channel in `novarix-site/js/main.js`:

```js
const CONFIG = { whatsapp: '226XXXXXXXX', email: 'contact@example.com' };
```

Use an international WhatsApp number without `+` or spaces. The form opens WhatsApp first when both channels are configured.

## Image credits

The agricultural photographs in `novarix-site/assets/` are downloaded from Unsplash and used locally for stable loading. Keep the source URLs and photographer credits documented when publishing the final version.

Current source pages:

- Hero: https://unsplash.com/photos/1500382017468-9049fed747ef
- Cashew: https://unsplash.com/photos/1608797178974-15b35a64ede9
- Mango: https://unsplash.com/photos/1553279768-865429fa0078
- Sesame: https://unsplash.com/photos/1596040033229-a9821ebd058d
- Farmer: https://unsplash.com/photos/1492496913980-501348b61469
- Origin section: https://commons.wikimedia.org/wiki/File:African_Women_Sorting_their_produce_after_harvest.jpg