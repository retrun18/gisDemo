import TCE from "./ThreeEngine"
import axios from "axios"
let mapScene;
let extent = {//地图范围
  xmax: 104.060482,//104.048982
  xmin: 104.037482,//2300
  ymax: 29.503378,//29.4953855
  ymin: 29.487393,//1598.5
  "spatialReference": { "Degree": 0.0174532925199433 }
};
let extent2 =
  {
    ymax: 29.571108,
    ymin: 29.555133,
    xmax: 103.742490,
    xmin: 103.719510,
    "spatialReference": { "Degree": 0.0174532925199433 }
  };
let extentFull =
  {
    ymax: 1178.833032,
    ymin: -1178.662968,
    xmax: 1050.87226,
    xmin: -1051.23974 ,
    "spatialReference": { "Degree": 0.0174532925199433 }
  };
let extent0 =
  {
    ymax: 1648.5619273242314,
    ymin: 431.47615981936326,
    xmax: 1519.4362795167547,
    xmin: -1441.78630959509,
    "spatialReference": { "Degree": 1 }
  };
let mapScale=1;//比例尺
// let geoServerUrl="http://localhost:6080/arcgis/rest/services/%E5%BE%B7%E5%9B%BD%E6%95%B0%E6%8D%AE/MapServer";
let geoServerUrl="https://www.easy-mock.com/mock/5b1d0e6d46416950933ee4fe/main/mapserver";
let AppCore={
  StartUp:function (srcNode) {
    mapScene=new TCE.MapScene(srcNode,{mapExtent:extentFull,mapScale});
    //创建绿地
    GetLayerData(geoServerUrl+"/2/query",function (data) {
      mapScene.CreateArcGisLayer(data,TCE.MapScene.ArcGisLayerType.Green);
    });
    //创建居民楼
    GetLayerData(geoServerUrl+"/1/query",function (data) {
      mapScene.CreateArcGisLayer(data,TCE.MapScene.ArcGisLayerType.build);
    });
    //创建居民楼
    GetLayerData(geoServerUrl+"/3/query",function (data) {
      mapScene.CreateArcGisLayer(data,TCE.MapScene.ArcGisLayerType.build);
    });
    //创建居民楼
    GetLayerData(geoServerUrl+"/4/query",function (data) {
      mapScene.CreateArcGisLayer(data,TCE.MapScene.ArcGisLayerType.build);
    });
    //创建居民楼
    GetLayerData(geoServerUrl+"/0/query",function (data) {
      mapScene.CreateArcGisLayer(data,TCE.MapScene.ArcGisLayerType.Tree);
    });
  },
  Resize:function () {
    mapScene.Resize();
  }
};

/**
 * 获取图层数据
 * @param {String} url 图层URL
 * @param {Function} callback
 * @constructor
 */
let GetLayerData=function(url,callback) {
  axios.get(url,{
    params:{
      f:"json",
      where:"1=1",
      returnGeometry:true,
      outFields:"*"
    }
  }).then(result=>{
    callback(result.data)
  },error=>{
    console.error(error);
  })
}
export default AppCore;
