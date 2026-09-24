# Mama's Cakes & Bakes — website

A static site with four pages (Home, Gallery, Classes, Contact Us). There's no build step, so it runs on GitHub Pages as it is.

## Folder structure
```
index.html          Home
gallery.html        Gallery (filters, search, lightbox)
contact.html        Contact + enquiry form (sends via WhatsApp or email)
classes.html        Cake Decorating Class (course details, booking)
CNAME               Custom domain for GitHub Pages (mamascakesnbakes.com)
css/style.css       All styles (brand colours are at the top in :root)
js/main.js          Shared: menu, sparkles, animations, contact details (SITE)
js/home.js          Home page: card deck, carousel, cake sketcher
js/gallery.js       Gallery logic
js/contact.js       Enquiry form logic
js/classes.js       Classes page: learning journey, included checklist, booking
js/gallery-data.js  THE LIST OF GALLERY PHOTOS  <- edit this to add cakes
images/brand/       Logo (gold / black / cream), mark, favicon
images/gallery/     Full-size photos (max 1400px)
images/thumbs/      Small versions (max 640px) used in grids
```

## Publish on GitHub Pages
1. Create a repository, e.g. `mamas-cakes`.
2. Upload **everything inside this folder** to the root of the repo, keeping the folders as they are.
3. Go to **Settings → Pages → Source: Deploy from branch → `main` / root** and save.
4. After a minute or so the site is live at `https://<username>.github.io/mamas-cakes/`.

## Custom domain: mamascakesnbakes.com
The `CNAME` file is already included. To finish the setup:
1. In your domain provider's DNS settings, add **A records** for `@` pointing to GitHub Pages:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
2. Add a **CNAME record** for `www` pointing to `<your-github-username>.github.io`.
3. In GitHub, go to **Settings → Pages → Custom domain**, enter `mamascakesnbakes.com`, then tick **Enforce HTTPS** once it becomes available.

## Share links (each tab is its own page)
- Home: https://mamascakesnbakes.com/
- Gallery: https://mamascakesnbakes.com/gallery (one collection: `/gallery#kids`, `#birthday`, `#christening`, `#celebration`, `#floral`, `#treats`)
- Classes: https://mamascakesnbakes.com/classes
- Contact: https://mamascakesnbakes.com/contact

Every page also has a gold **share** button (bottom right). On phones it opens the share menu; on computers it copies the page link.

## Add a new cake to the gallery
1. Save the photo as `cake-101.jpg` (use the next number) in **both** `images/gallery/` (about 1400px) and `images/thumbs/` (about 640px).
2. Add a line to `js/gallery-data.js`:
   ```js
   {file:"cake-101.jpg", cat:"birthday", title:"Unicorn rainbow cake"},
   ```
   You can use these categories: `birthday`, `kids`, `christening`, `celebration`, `floral`, `treats`.

The category counts and filters update on their own.

## Things to check
- **Facebook link**: the page's exact URL wasn't available, so for now it links to a Facebook search. Search for `facebook.com/search` in the HTML files and replace it with the real page URL.
- Contact details are in `js/main.js` (`SITE`) and in the footers of the HTML files.
- Photo titles and categories were guessed from the pictures, so correct any names or occasions that are wrong in `gallery-data.js`.
