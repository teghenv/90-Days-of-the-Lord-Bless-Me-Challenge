# Challenge Flyer Generator

A free, static website. Visitors enter their name, upload a photo, generate a personalised flyer,
download it as a PNG, share it, and click through to your Facebook page or community.
Everything runs in the visitor's browser: no server, no database, no cost. Photos are never uploaded anywhere.

## Files
- `index.html` the page
- `style.css` the look
- `script.js` flyer drawing, download and sharing. **Settings are at the top (`CONFIG`).**
- `assets/` optional place for your own template (`flyer-template.png`)
- `.nojekyll` tells GitHub Pages to serve files as-is

## 1. Customise (2 minutes)
Open `script.js` and edit `CONFIG`:
- `titleLines`, `joiningLabel`, `dateLine`, `footer` text on the built-in flyer
- `joinUrl` **your Facebook Page or group link** (the Join the challenge button)
- `shareText` the message shared with the flyer
- `colors` brand colours

### Use your own flyer design instead
1. Design a **1080 x 1350 px** PNG in Canva or similar. Leave a blank area for the photo and name.
2. Save it as `assets/flyer-template.png`.
3. Adjust `photo` (`x`, `y`, `r` = centre and radius of the photo circle) and `nameBox.y` in `CONFIG` to match your blank areas.
When this file exists it is used automatically; delete it to go back to the built-in design.

## 2. Publish on GitHub Pages
1. Create a new repository on GitHub (e.g. `flyer-generator`), set to **Public**.
2. Upload all files from this folder (drag and drop on the repo page, keep the `assets` folder and `.nojekyll`).
3. Go to **Settings > Pages**. Under *Build and deployment*, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then Save.
4. After about a minute your site is live at `https://YOUR-USERNAME.github.io/flyer-generator/`.

## 3. Test it
Open the live link on a phone and a computer: enter a name, upload a photo, press Generate, then try Download and each share button.

## Notes on sharing
- **Phones:** *Share flyer*, *WhatsApp* and *Instagram* open the phone's share sheet with the image attached (needs HTTPS, which GitHub Pages provides).
- **Computers:** browsers cannot attach images to WhatsApp, Facebook or Instagram posts automatically, so the flyer is downloaded first and the app opens for the person to attach it. This is a platform limit, not a bug.
- Instagram has no web sharing link, so people post the downloaded image from the app.
- Facebook previews of your site link can be improved by adding Open Graph tags (`og:title`, `og:image`) to `index.html`.
