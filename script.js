/* ============ EDIT THIS SECTION ============ */
const CONFIG = {
  // Optional: drop a 1080x1350 PNG at assets/flyer-template.png to use your own design.
  // If the file is missing, the built-in design below is used.
  templateImage: 'assets/flyer-template.png',
  // Where the photo circle and name sit (used by both built-in and custom templates).
  photo: { x: 555, y: 710, r: 190 },
  nameBox: { y: 955, maxWidth: 900, size: 88 },

  // Built-in design text
  titleLines: ['90-DAY', 'THE', 'LORD', 'BLESS', 'ME', 'CHALLENGE'],
  joiningLabel: "I'M JOINING THE CHALLENGE",
  dateLine: 'Starts 1 November 2026',
  footer: 'yourwebsite.com',

  // Links
  joinUrl: 'https://www.facebook.com/YOUR-PAGE-OR-GROUP',
  shareUrl: '', // leave empty to use this page's address
  shareText: "I'm taking part in the 90-Day Challenge to declare 'THE Lord BLESS ME' on my Life & Family! Make your flyer and join me in the Lord's Blessings:",

  colors: { bg1: '#1b1464', bg2: '#0c0830', gold: '#ffb627', coral: '#ff5d73', white: '#ffffff' }
};
/* ============================================ */

const W = 1080, H = 1350;
const $ = id => document.getElementById(id);
const canvas = $('canvas'), ctx = canvas.getContext('2d');
let photo = null, template = null, generated = false;

$('join').href = CONFIG.joinUrl;

function loadImage(src) {
  return new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

function drawBuiltIn() {
  const c = CONFIG.colors;
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, c.bg1); g.addColorStop(1, c.bg2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // decorative circles
  ctx.fillStyle = c.coral; ctx.globalAlpha = .9;
  ctx.beginPath(); ctx.arc(960, 560, 150, 0, 7); ctx.fill();
  ctx.fillStyle = c.gold; ctx.globalAlpha = .95;
  ctx.beginPath(); ctx.arc(110, 830, 110, 0, 7); ctx.fill();
  ctx.globalAlpha = 1;

  // title
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = c.gold; ctx.font = '120px Anton, Impact, sans-serif';
  ctx.fillText(CONFIG.titleLines[0] || '', W / 2, 130);
  ctx.fillStyle = c.white; ctx.font = '150px Anton, Impact, sans-serif';
  ctx.fillText(CONFIG.titleLines[1] || '', W / 2, 260);
  ctx.fillStyle = c.gold; ctx.font = '120px Anton, Impact, sans-serif';
  ctx.fillText(CONFIG.titleLines[2] || '', W / 2, 375);

  // joining label
  ctx.fillStyle = c.white; ctx.font = '700 34px "DM Sans", Arial, sans-serif';
  ctx.fillText(CONFIG.joiningLabel, W / 2, CONFIG.nameBox.y - 105);

  // footer
  ctx.fillStyle = c.gold; ctx.font = '700 40px "DM Sans", Arial, sans-serif';
  ctx.fillText(CONFIG.dateLine, W / 2, 1230);
  ctx.fillStyle = c.white; ctx.font = '400 32px "DM Sans", Arial, sans-serif';
  ctx.fillText(CONFIG.footer, W / 2, 1285);
}

function drawPhoto() {
  const { x, y, r } = CONFIG.photo;
  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
  if (photo) {
    const z = parseFloat($('zoom').value);
    const scale = Math.max(2 * r / photo.width, 2 * r / photo.height) * z;
    const w = photo.width * scale, h = photo.height * scale;
    ctx.drawImage(photo, x - w / 2, y - h / 2, w, h);
  } else {
    ctx.fillStyle = '#e8e4f5'; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
    ctx.fillStyle = '#9d96c9';
    ctx.beginPath(); ctx.arc(x, y - r * .18, r * .3, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x, y + r * .75, r * .55, r * .5, 0, 0, 7); ctx.fill();
  }
  ctx.restore();
  if (!template) { // ring only on built-in design
    ctx.lineWidth = 16; ctx.strokeStyle = CONFIG.colors.gold;
    ctx.beginPath(); ctx.arc(x, y, r + 8, 0, Math.PI * 2); ctx.stroke();
  }
}

function drawName() {
  const name = $('name').value.trim() || 'Your Name';
  const { y, maxWidth, size } = CONFIG.nameBox;
  let s = size;
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  do { ctx.font = `${s}px Anton, Impact, sans-serif`; s -= 2; }
  while (ctx.measureText(name.toUpperCase()).width > maxWidth && s > 24);
  ctx.fillStyle = template ? '#ffffff' : CONFIG.colors.white;
  ctx.fillText(name.toUpperCase(), W / 2, y + 30);
}

function render() {
  ctx.clearRect(0, 0, W, H);
  if (template) ctx.drawImage(template, 0, 0, W, H); else drawBuiltIn();
  drawPhoto();
  drawName();
}

function setMsg(t) { $('msg').textContent = t; }

$('name').addEventListener('input', () => { render(); });
$('zoom').addEventListener('input', render);

$('photo').addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  if (!f.type.startsWith('image/')) { setMsg('Please choose an image file (JPG or PNG).'); return; }
  const url = URL.createObjectURL(f);
  loadImage(url).then(img => {
    photo = img; $('zoomRow').hidden = false; $('zoom').value = 1; setMsg(''); render();
  }).catch(() => setMsg('That image could not be read. Try a JPG or PNG.'));
});

function getBlob() {
  return new Promise(res => canvas.toBlob(res, 'image/png'));
}
function fileName() {
  const n = $('name').value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'my';
  return `${n}-challenge-flyer.png`;
}
function pageUrl() { return CONFIG.shareUrl || location.href.split('#')[0]; }

$('generate').addEventListener('click', () => {
  if (!$('name').value.trim()) { setMsg('Enter your name to continue.'); $('name').focus(); return; }
  if (!photo) { setMsg('Upload your photo to continue.'); $('photo').focus(); return; }
  setMsg(''); render(); generated = true;
  $('actions').hidden = false;
  $('actions').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

async function download() {
  const blob = await getBlob();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = fileName();
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
$('download').addEventListener('click', download);

async function nativeShare() {
  const blob = await getBlob();
  const file = new File([blob], fileName(), { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], text: CONFIG.shareText + ' ' + pageUrl() }); return true; }
    catch (e) { return e.name === 'AbortError'; }
  }
  return false;
}

$('share').addEventListener('click', async () => {
  const ok = await nativeShare();
  if (!ok) { await download(); $('hint').textContent = 'Sharing is not supported in this browser, so the flyer was downloaded. Post it from your gallery.'; }
});

$('wa').addEventListener('click', async () => {
  // On phones, sharing the image file directly works best.
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  if (isMobile && await nativeShare()) return;
  await download();
  $('hint').textContent = 'Flyer downloaded. WhatsApp is opening: attach the image to your message.';
  window.open('https://wa.me/?text=' + encodeURIComponent(CONFIG.shareText + ' ' + pageUrl()), '_blank', 'noopener');
});

$('fb').addEventListener('click', async () => {
  await download();
  $('hint').textContent = 'Flyer downloaded. Facebook is opening: add the image to your post.';
  window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl()) +
    '&quote=' + encodeURIComponent(CONFIG.shareText), '_blank', 'noopener');
});

$('ig').addEventListener('click', async () => {
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  if (isMobile && await nativeShare()) return;
  await download();
  $('hint').textContent = 'Flyer downloaded. Instagram does not allow web sharing: open Instagram and post it from your gallery.';
  window.open('https://www.instagram.com/', '_blank', 'noopener');
});

// Start: wait for fonts and optional custom template, then draw preview.
(async function init() {
  try { await Promise.all([document.fonts.load('120px Anton'), document.fonts.load('700 34px "DM Sans"')]); } catch (e) {}
  try { template = await loadImage(CONFIG.templateImage); } catch (e) { template = null; }
  render();
})();
