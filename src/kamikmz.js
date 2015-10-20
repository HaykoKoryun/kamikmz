function kamikmz(url, viewer, callback)
{
  var scene;
  var camera;
  var renderer;

  createViewer();
  loadKMZ(url);

  function createViewer()
  {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, viewer.clientWidth / viewer.clientHeight, 1, 10000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xffffff, 1);
    renderer.setSize( viewer.clientWidth, viewer.clientHeight );

    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.addEventListener( 'change', render );

    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 2 );
    scene.add( light );
  }

  function loadKMZ(url)
  {
    prepKMZ(url, function(kmz)
    {
      var loader = new THREE.ColladaLoader();
      loader.load(kmz, function(result)
      {
        var bbox = new THREE.BoundingBoxHelper( result.scene.children[0], 0xff0000 );
        bbox.update();
        scene.add(result.scene);
        camera.position.set
        (
          bbox.position.x,
          bbox.position.y / 15,
          bbox.position.z / 2
        );
        camera.lookAt(scene.position);
        cleanup();
        viewer.appendChild( renderer.domElement );
        render();
        setTimeout(render, 200);
        callback.call();
      });
    });
  }

  function cleanup()
  {
    processChildren(scene);
  }

  function processChildren(root)
  {
    for(var i = 0; i < root.children.length; ++i)
    {
      var child = root.children[i];
      if(child.children.length != 0)
      {
        processChildren(child);
      }
      else
      {
        if(typeof child.material != "undefined")
        {
          if(typeof child.material.materials != "undefined")
          {
            for(var j = 0; j < child.material.materials.length; ++j)
            {
              processMaterial(child.material.materials[j]);
            }
          }
          else
          {
            processMaterial(child.material);
          }
        }
      }
    }
  }

  function processMaterial(material)
  {
    material.transparent = true;
  }

  function render()
  {
    renderer.render( scene, camera );
  }

  function prepKMZ(url, callback)
  {
    JSZipUtils.getBinaryContent(url, function(err, data)
    {
      if(err) {
        throw err;
      }

      var zip = new JSZip(data);

      var textures = zip.file(/models\/untitled\//);
      var tex_map = [];

      for(var i = 0; i < textures.length; ++i)
      {
        var binary = textures[i]._data.getContent();
        var base64 = btoa(Uint8ToString(binary));
        var key = textures[i].name.replace("models/", "");
        // TODO: get actual mime-type
        tex_map.push({key:key, data:"data:image/png;base64," + base64});
      }

      var model = zip.file(/models\/untitled\.dae/)[0];
      var binary = model._data.getContent();
      var string = Uint8ToString(binary);

      for(var i = 0; i < tex_map.length; ++i)
      {
        var find = tex_map[i]["key"];
        var re = new RegExp(find, "g");
        string = string.replace(re, tex_map[i]["data"]);
      }

      var base64 = btoa(string);

      callback.call(this, 'data:text/xml;base64,' + base64);
    });
  }

  // from: http://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/12713326#12713326
  function Uint8ToString(u8a)
  {
    var CHUNK_SZ = 0x8000;
    var c = [];
    for (var i=0; i < u8a.length; i+=CHUNK_SZ) {
      c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
    }
    return c.join("");
  }
}
