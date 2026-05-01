/**
 * Zoppax Clickable Image Lightbox
 *
 * Author: Macc Liu <maccliu@hotmail.com>
 * Version: 1.0.1
 * Date: 2023-08-01
 * GitHub: https://github.com/maccliu/zoppax-clickable-image-lightbox
 * License: MIT
 *
 * Purpose:
 *   Provide a universal image lightbox for blocklets and pages.
 *   Any <img> with class "zoppax-clickable-image" becomes clickable,
 *   opening a fullscreen overlay to display the original-size image.
 *
 * Usage:
 *   1. Include this script in the page (layout or head_once.liquid):
 *      <script src="/static/js/zoppaxclickableimage.js"></script>
 *   2. Add class "zoppax-clickable-image" to any <img> element:
 *      <img src="photo.jpg" class="zoppax-clickable-image" alt="">
 *
 * Behavior:
 *   - Click image → open fullscreen lightbox overlay (80vw x 80vh max)
 *   - Click overlay background or press Escape → close lightbox
 *   - Script is idempotent: safe to include multiple times
 *   - Styles are auto-injected, no CSS dependency required
 */
;(function () {
  if (window.__zoppax_clickable_image_ready) return
  window.__zoppax_clickable_image_ready = true

  var overlay = null
  var bigImg = null

  function injectStyles() {
    if (document.getElementById("zoppax-clickable-image-styles")) return
    var style = document.createElement("style")
    style.id = "zoppax-clickable-image-styles"
    style.textContent =
      ".zoppax-clickable-image{cursor:pointer}" +
      ".zoppax-clickable-image-lightbox{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center}" +
      ".zoppax-clickable-image-lightbox img{max-width:80vw;max-height:80vh;object-fit:contain}"
    document.head.appendChild(style)
  }

  function ensureOverlay() {
    if (overlay) return
    injectStyles()
    overlay = document.createElement("div")
    overlay.className = "zoppax-clickable-image-lightbox"
    overlay.style.display = "none"
    bigImg = document.createElement("img")
    overlay.appendChild(bigImg)
    document.body.appendChild(overlay)

    overlay.addEventListener("click", close)
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close()
    })
  }

  function open(src) {
    ensureOverlay()
    bigImg.src = src
    overlay.style.display = ""
    document.body.style.overflow = "hidden"
  }

  function close() {
    if (!overlay) return
    overlay.style.display = "none"
    bigImg.src = ""
    document.body.style.overflow = ""
  }

  function init() {
    var imgs = document.querySelectorAll(".zoppax-clickable-image")
    imgs.forEach(function (img) {
      img.addEventListener("click", function (e) {
        e.stopPropagation()
        open(img.src)
      })
    })
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
})()
