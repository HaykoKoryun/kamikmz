# kamikmz-viewer
`kamikmz` is a JavaScript library capable of displaying `.kmz` files without the need to extract them first. It was built to display self hosted SketchUp `.skp` files which are converted to `.kmz` files by a companion service [kamikmz-service](https://github.com/HaykoKoryun/kamikmz-service/).

`kamikmz` depends on the following libraries:

- [three.js](https://github.com/mrdoob/three.js/) - for rendering the Collada model in 3D
- [jszip](https://github.com/Stuk/jszip/) - for unzipping the .kmz file in the browser

To use the library just call the `kamikmz` function like in the example below (as used by the [demo](https://haykokoryun.github.io/kamikmz/) page):

```html
<doctype !html>
<html>
  <head>
  </head>
  <body>
    <div id="kamikmz-viewer"></div>
    <script src="lib/jszip.min.js"></script>
    <script src="lib/jszip-utils.min.js"></script>
    <script src="lib/three.min.js"></script>
    <script src="lib/ColladaLoader.js"></script>
    <script src="lib/OrbitControls.js"></script>
    <script src="lib/kamikmz.js"></script>
    <script>
      (function()
      {
        kamikmz
        (
          "assets/zero.kmz",
          document.querySelector("#kamikmz-viewer"),
          function()
          {
            // do something once the model is loaded and ready
          }
        );
      })();
    </script>

  </body>
</html>
```
