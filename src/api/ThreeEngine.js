/**
 * @module TCE
 */
import THREE from "./ExtendedTHREE"

let TCE = {
  version: "0.0.1",
  _modelPromises: {},
  GetModel: function (key) {
    if (this._modelPromises[key]) {
      return this._modelPromises[key];
    } else return this.ModelLoaders[key].apply(this);
  },
  GetTexture: function (key) {
    if (!this._textures[key]) {
      this._textures[key] = new THREE.TextureLoader().load(key);
    }
    return this._textures[key]
  },
  _textures: {},
  TextureLoaders: {},
  ModelLoaders: {
    tree: function () {
      this._modelPromises.tree = new Promise(function (resolve) {
        let name = "Alder_Buckthorn_Fan";
        ///开始加载模型
        let mtlloader = new THREE.MTLLoader();
        mtlloader.setPath("statics/Upload/");
        mtlloader.load(name + '.mtl', function (materials) {
          materials.preload();
          let objLoader = new THREE.OBJLoader();
          objLoader.setMaterials(materials);
          objLoader.setPath('statics/Upload/');
          objLoader.load(name + '.obj', function (object) {
            resolve(object);
          }, onProgress, onError);
        });

        function onProgress(mes) {
        }

        function onError(mes) {
        }
      })
      return this._modelPromises.tree;
    }
  }
};
/**
 * @summary 地图场景
 * @param {HTMLDocument/string} container 渲染场景的HTMLDocument
 * @param {Object} params 构造参数
 * @param {Object} params.mapExtent 地图显示范围
 * @param {Number} params.mapScale 地图显示范围
 * @constructor TCE.MapScene
 * @memberOf TCE;
 */
TCE.MapScene = function (container, params) {
  this._mapExtent = params.mapExtent;
  this._mapScale = params.mapScale;
  this._arcGisConverter._mapCenter = {
    x: (params.mapExtent.xmax + params.mapExtent.xmin) / 2,
    y: (params.mapExtent.ymax + params.mapExtent.ymin) / 2
  };
  this._arcGisConverter._mapScale = params.mapScale;
  this._scene = new THREE.Scene();
  //初始化渲染器
  {
    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setClearColor("#B3DFDA", 1.0);//设置蓝色背景
    if (typeof container === "string") {
      this._container = document.getElementById(container)
    } else {
      this._container = container;
    }
    this._container.appendChild(this._renderer.domElement);//将renderer加载到容器
  }
  //初始化相机
  {
    this._mainCamera = new THREE.PerspectiveCamera(60, 1, 1, 10000);//远景相机
    this._mainCamera.position.x = 0;
    this._mainCamera.position.y = (this._mapExtent.ymax - this._mapExtent.ymin) / this._mapScale / 2 * Math.sqrt(3);
    this._mainCamera.position.z = 0;
    this._mainCamera.lookAt(new THREE.Vector3());
    this._initCameraPosition.copy(this._mainCamera.position);
    this._initCameraRotation.copy(this._mainCamera.quaternion);
  }
  this.Resize();
  //初始化太阳光效果
  {
    this._sunshine = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    this._sunshine.color.setHSL(0.6, 1, 0.6);
    this._sunshine.groundColor.setHSL(0.095, 1, 0.75);
    this._sunshine.position.set(0, 1500, 0);
    this._scene.add(this._sunshine);

    let dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(0, 1000, 0);
    dirLight.position.multiplyScalar(50);
    dirLight.rotateX(60);
    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    let d = 50;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = -0.0001;
    this._scene.add(dirLight);
  }
  //初始化相机交互控制器
  this._controller = new THREE.EditorControls(this._mainCamera, this._renderer.domElement);
  //初始化基础场景
  {
    let groundGeo = new THREE.PlaneBufferGeometry((this._mapExtent.xmax - this._mapExtent.xmin) / this._mapScale, (this._mapExtent.ymax - this._mapExtent.ymin) / this._mapScale)
    let groundMat = (function () {
      let texture = new THREE.TextureLoader().load("statics/pic/full1.jpg");
      let mat = new THREE.MeshPhongMaterial({map: texture});
      // mat.transparent = true;
      return mat;
    })();
    this._ground = new THREE.Mesh(groundGeo, groundMat);
    this._ground.rotation.x = -Math.PI / 2;
    this._ground.position.y = 0;
    this._ground.receiveShadow = true;
    this._scene.add(this._ground);
    let vertexShader = "\n" +
      "        varying vec3 vWorldPosition;\n" +
      "        void main() {\n" +
      "        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );\n" +
      "        vWorldPosition = worldPosition.xyz;\n" +
      "        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n" +
      "        }";
    let fragmentShader = "        uniform vec3 topColor;\n" +
      "        uniform vec3 bottomColor;\n" +
      "        uniform float offset;\n" +
      "        uniform float exponent;\n" +
      "        varying vec3 vWorldPosition;\n" +
      "        void main() {\n" +
      "        float h = normalize( vWorldPosition + offset ).y;\n" +
      "        gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );\n" +
      "        }";
    let uniforms = {
      topColor: {type: "c", value: new THREE.Color(0x0077ff)},
      bottomColor: {type: "c", value: new THREE.Color(0xffffff)},
      offset: {type: "f", value: 33},
      exponent: {type: "f", value: 0.6}
    };
    uniforms.topColor.value.copy(this._sunshine.color);
    let skyGeo = new THREE.SphereGeometry(4000, 32, 15);
    let skyMat = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms,
      side: THREE.BackSide
    });
    let sky = new THREE.Mesh(skyGeo, skyMat);
    this._scene.add(sky);
  }
  {
    let material=new THREE.SpriteMaterial({map:TCE.GetTexture("statics/pic/" + (Math.floor(Math.random() * 8)) + ".jpg")})
    let sprite=new THREE.Sprite(material);
    sprite.center.set(0,5,0,0);
    let scale=this._getPoiScale(new THREE.Vector3(0,0,0),{w:100,h:100})
    sprite.scale.set( ...scale);
    this._scene.add(sprite);
  }
  let camera = this._mainCamera;
  let scene = this._scene;
  let scope = this;

  function render() {
    requestAnimationFrame(render);
    scope._renderer.render(scene, camera);
  }
  render();
  // this.ResetView();
};
TCE.MapScene.ArcGisLayerType = {
  Green: 1,
  Tree: 2,
  build: 3,
  Ground: 4
};
/**
 * @summary 创建拉伸体
 * @param {Array} points 面点数据集合
 * @param {Number} amount 拉伸的单位长度
 * @param {Object} material 材质
 */
TCE.ExtrudePolygon = function (points, amount, material) {
  let shape = new THREE.Shape(points);
  let extrusionSettings = {
    depth: amount,
    bevelSize: 0,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelThickness: 1,
    material: 0,
    extrudeMaterial: 1
  };
  let shapeGeometry = new THREE.ExtrudeGeometry(shape, extrusionSettings);
  let mesh = new THREE.Mesh(shapeGeometry, material);
  mesh.rotation.x = -Math.PI / 2;//将shape旋转到xz平面
  return mesh;
};
/**
 * 重置几何体的uv坐标
 * @param geometry 要重置uv的几何体
 */
TCE.ResetUV = function (geometry) {
  /// <summary>重新计算UV贴图</summary>
  let faces = geometry.faces;
  geometry.faceVertexUvs[0] = [];
  for (let i = 0; i < faces.length; i++) {
    let v1 = geometry.vertices[faces[i].a],
      v2 = geometry.vertices[faces[i].b],
      v3 = geometry.vertices[faces[i].c];
    let v;
    if (v1.z === v2.z && v2.z === v3.z) {
      v = new THREE.Vector3(1, 0, 0);
    }
    else {
      v = new THREE.Vector3(0, 0, 1);
    }
    let p = new THREE.Vector3().crossVectors(new THREE.Vector3().subVectors(v2, v1), new THREE.Vector3().subVectors(v3, v1));
    let m = new THREE.Vector3().crossVectors(p, v);
    let n = new THREE.Vector3().crossVectors(m, p);
    let l1 = new THREE.Vector2(v1.dot(m) / (m.length()), v1.dot(n) / (n.length()));
    let l2 = new THREE.Vector2(v2.dot(m) / (m.length()), v2.dot(n) / (n.length()));
    let l3 = new THREE.Vector2(v3.dot(m) / (m.length()), v3.dot(n) / (n.length()));
    geometry.faceVertexUvs[0].push([l1, l2, l3]);
  }
  geometry.uvsNeedUpdate = true;
};
/**
 * @lends TCE.MapScene.prototype
 */
TCE.MapScene.prototype = {
  _initCameraPosition: new THREE.Vector3(),//相机初始位置
  _initCameraRotation: new THREE.Quaternion(),//相机初始旋转状态
  _scene: undefined,
  _renderer: undefined,//渲染器
  _container: undefined,
  _controller: undefined,
  _mapExtent: {
    xmax: 0,
    xmin: 0,
    ymin: 0,
    ymax: 0
  },//地图显示范围
  _mainCamera: undefined,//主相机
  _mapScale: 1,//比例尺
  _sunshine: undefined,
  /**
   * 重置场景大小
   * @returns {number}
   */
  Resize: function () {
    let renderWidth = this._container.clientWidth;
    let renderHeight = this._container.clientHeight;
    this._renderer.setSize(renderWidth, renderHeight);
    this._mainCamera.aspect = renderWidth / renderHeight;
    this._mainCamera.updateProjectionMatrix();//相机参数变化时必须调用此函数更新
    return renderWidth / renderHeight;
  },
  /**
   * 重置显示范围
   */
  ResetView: function () {
    this._mainCamera.position.copy(this._initCameraPosition);
    this._mainCamera.quaternion.copy(this._initCameraRotation);
    this._controller.SetCenter(new THREE.Vector3());
  },
  /**
   * 创建arcgis要素图层
   * @param {Object} data 图层数据
   * @param {Number} type
   */
  CreateArcGisLayer: function (data, type) {
    switch (type) {
      case TCE.MapScene.ArcGisLayerType.Green: {
        function creater() {
          let textureUrl = "statics/pic/grass" + (1 + Math.floor(Math.random() * 4)) + ".jpg";
          let texture = TCE.GetTexture(textureUrl);
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(0.04, 0.04);
          let mat = new THREE.MeshPhongMaterial({map: texture});
          return mat;
        }

        this.CreateArcPolygonLayer(data, {
          material: creater//,
          // randomHeight:false
        });
      }
        break;
      case TCE.MapScene.ArcGisLayerType.build: {
        function creater() {
          let sideTextureUrl = "statics/pic/" + (Math.floor(Math.random() * 8)) + ".jpg";
          let sideTexture = TCE.GetTexture(sideTextureUrl);
          sideTexture.wrapS = THREE.RepeatWrapping;
          sideTexture.wrapT = THREE.RepeatWrapping;
          sideTexture.repeat.set(0.05, 0.05);
          let topTextureUrl = "statics/pic/roof" + (1 + Math.floor(Math.random() * 4)) + ".jpg";
          let topTexture = TCE.GetTexture(topTextureUrl);
          topTexture.wrapS = THREE.RepeatWrapping;
          topTexture.wrapT = THREE.RepeatWrapping;
          topTexture.repeat.set(0.02, 0.02);
          let roofMat = new THREE.MeshBasicMaterial({map: topTexture});
          let wallMat = new THREE.MeshBasicMaterial({map: sideTexture});
          let material = [roofMat, wallMat];
          return material;
        }

        this.CreateArcPolygonLayer(data, {
          material: creater
        });
      }
        break;
      case TCE.MapScene.ArcGisLayerType.Tree: {
        this.CreateArcPointLayer(data);
      }
        break;
      default: {
      }
        break;
    }
  },
  CreateArcPointLayer: function (data) {
    let layerData = data;
    let layer = new THREE.Group();
    layer.geoType = "esriGeometryPoint";
    let features = layerData.features;
    this._scene.add(layer);
    for (let i = 0; i < features.length; i++) {
      let graphic = features[i];
      let geometry = graphic.geometry;
      let atts = graphic.attributes;
      let position = this._arcGisConverter.ToScenePoint(new THREE.Vector2(geometry.x, geometry.y));
      TCE.GetModel("tree").then(function (model) {
        let tree = model.clone();
        tree.position.set(position.x + 0.01, position.y, position.z);
        let size = 1 + Math.floor(Math.random() * 2);
        tree.scale.set(size, size, size);
        tree.rotateY(Math.floor(Math.random() * 180));
        layer.add(tree);
      });
    }
  },
  CreateArcPolyLineLayer: function (data) {
  },
  /**
   * @summary 创建面图层(拉伸)
   * @param {Object} data 图层数据
   * @param {Object} params 创建参数
   * @param {Object//Function} params.material 创建参数
   */
  CreateArcPolygonLayer: function (data, params) {
    let layerData = data;
    let layer = new THREE.Group();
    layer.geometryType = "esriGeometryPolygon";
    this._scene.add(layer);
    let features = layerData.features;
    for (let key in features) {
      let graphic = features[key];
      let scope = this;
      //异步执行
      Promise.resolve(graphic).then(function (graphic) {
        let geometry = graphic.geometry;
        let atts = graphic.attributes;
        let points = [];
        let centerPoint = (function (geometry) {
          let length = 0;
          let xsum = 0;
          let ysum = 0;
          for (let j = 0; j < geometry.rings.length; j++) {
            let ring = geometry.rings[j];
            for (let i = 0; i < ring.length; i++) {
              let point = ring[i];
              xsum += point[0];
              ysum += point[1];
              length++;
            }
          }
          return {x: xsum / length, y: ysum / length};
        })(geometry);
        let position = scope._arcGisConverter.ToScenePoint(centerPoint);
        for (let i = 0; i < geometry.rings.length; i++) {
          let ring = geometry.rings[i];
          for (let j = 0; j < ring.length; j++) {
            let point = ring[j];
            var pointWorld = scope._arcGisConverter.ToScenePoint(new THREE.Vector2(point[0], point[1]));
            points.push(new THREE.Vector2(pointWorld.x - position.x, -pointWorld.z + position.z));
          }
        }
        let height = atts.height || 1;
        let mesh = TCE.ExtrudePolygon(points, height, params.material());
        TCE.ResetUV(mesh.geometry);
        mesh.position.set(position.x, position.y, position.z);
        layer.add(mesh);
      })
    }
  },
  CreateCavasSprite:function () {
    var material=new THREE.SpriteCanvasMaterial({color:"#ffffff"})
  },
  _arcGisConverter: {
    _mapCenter: {x: 1, y: 1},
    _mapScale: 1,
    ToScenePoint: function (point) {
      let sx = (point.x - this._mapCenter.x) / this._mapScale;
      let sz = -(point.y - this._mapCenter.y) / this._mapScale;
      let sy = 0;
      return new THREE.Vector3(sx, sy, sz);
    },
    ToMapPoint: function (point) {
      let mx = point.x * this._mapScale + this._mapCenter.x;
      let my = -point.z * this._mapScale + this._mapCenter.y;
      return new THREE.Vector2(mx, my);
    }
  },
  /**
   * @summary 获取sprite标注的实际大小尺寸
   * @param {THREE.Vector3} position 目标位置
   * @param {Object} poiRect sprite的矩形大小（像素单位）
   * @returns {Array}
   * @private
   */
  _getPoiScale(position, poiRect) {
    let pos = position ? position : this._controller.target;
    let distance = this._mainCamera.position.distanceTo(pos);
    let top = Math.tan(this._mainCamera.fov / 2 * (Math.PI / 180)) * distance;//到画布顶部边线投射到目标位置所在平面的3D世界距离
    let meterPerPixel = 2 * top / this._container.clientHeight;
    let scaleX = poiRect.w * meterPerPixel;
    let scaley = poiRect.h * meterPerPixel;
    return [scaleX,scaley,1.0];
  }
};
TCE.MapScene.prototype.constructor = TCE.MapScene;
export default TCE;
