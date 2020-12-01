<template>
  <div style="width:100%;height:800px;">
    <div class="container">
      <!--
      amap-manager： 地图管理对象
      vid：地图容器节点的ID
      zooms： 地图显示的缩放级别范围，在PC上，默认范围[3,18]，取值范围[3-18]；在移动设备上，默认范围[3-19]，取值范围[3-19]
      center： 地图中心点坐标值
      plugin：地图使用的插件
      events： 事件
    -->
      <el-amap
        class="amap-box"
        :amap-manager="amapManager"
        :vid="'camap-vue'"
        :zoom="zoom"
        :plugin="plugin"
        :center="center"
        map-style="light"
        :events="events"
      >
        <el-amap-info-window
          :position="currentPosition.position"
          :content="currentPosition.content"
          :visible="currentPosition.visible"
        />
        <!-- 标记 -->
        <el-amap-marker
          v-for="(marker, index) in markers"
          :key="index"
          :vid="index"
          :lable="marker.label"
          :position="marker.position"
          :visible="marker.visible"
          :draggable="marker.draggable"
          :offset="marker.offset"
          :events="marker.events"
        />
        <!-- 标记文本 -->
        <el-amap-text
          v-for="(text,index) in markers"
          :key="100+index"
          :text="text.label.content"
          :offset="text.label.offset"
          :position="text.position"
          :events="text.events"
        />
      </el-amap>
    </div>
  </div>
</template>
<script>
import { AMapManager, lazyAMapApiLoaderInstance } from 'vue-amap'
const amapManager = new AMapManager()
export default {
  name: 'OrderCamap',
  data() {
    const self = this
    return {
      zoom: 6,
      center: [117.031803, 32.622703],
      amapManager,
      events: {
        init() {
          lazyAMapApiLoaderInstance.load().then(() => {
            // self.initSearch()
          })
        }
        // 点击获取地址的数据
        // click(e) {
        //   const { lng, lat } = e.lnglat
        //   self.lng = lng
        //   self.lat = lat
        //   self.center = [lng, lat]
        //   // 这里通过高德 SDK 完成。
        //   const geocoder = new AMap.Geocoder({
        //     radius: 1000,
        //     extensions: 'all'
        //   })
        //   geocoder.getAddress([lng, lat], function(status, result) {
        //     if (status === 'complete' && result.info === 'OK') {
        //       if (result && result.regeocode) {
        //         self.address = result.regeocode.formattedAddress
        //         self.searchKey = result.regeocode.formattedAddress
        //         const mark = {
        //           position: self.center,
        //           visible: true,
        //           draggable: false,
        //           offset: [0, 0],
        //           label: {
        //             content: self.address,
        //             offset: [6, 40]
        //           }
        //         }
        //         const newMarkers = []
        //         newMarkers.push(mark)
        //         self.amap_marksers = newMarkers
        //         self.$nextTick()
        //       }
        //     }
        //   })
        // }
      },
      // 一些工具插件
      plugin: [
        {
          pName: 'Scale',
          events: {
            init(instance) {
            }
          }
        },
        {
          pName: 'Geocoder',
          events: {
            init(o) {
            }
          }
        },
        {
          // 鹰眼
          pName: 'OverView',
          events: {
            init(instance) {
              // console.log(instance);
            }
          }
        },
        {
          // 地图类型
          pName: 'MapType',
          defaultType: 0,
          events: {
            init(instance) {
              // console.log(instance);
            }
          }
        },
        {
          pName: 'Driving',
          events: {
            init(o) {
              o.search(new AMap.LngLat(self.markers[0].position[0], self.markers[0].position[1]),
                new AMap.LngLat(self.markers[1].position[0], self.markers[1].position[1]),
                (status, result) => {
                  if (status === 'complete') {
                    self.searchRoute(result)
                    self.initRoute()
                  } else {
                    console.log('获取驾车数据失败')
                  }
                })
            }
          }
        }
      ],
      currentPosition: {
        position: [116.547882, 32.641402],
        visible: true,
        content: '正在路上了'
      },
      markers: [
        {
          position: [117.031803, 32.622703],
          visible: true,
          draggable: false,
          offset: [0, 0],
          label: {
            content: '目标4',
            offset: [6, 40]
          },
          events: {
            click: (MapsEvent) => {
              alert('click marker')
              console.log(MapsEvent)
            }
          }
        },
        {
          position: [116.342058, 32.614061],
          visible: true,
          draggable: false,
          offset: [0, 0],
          label: {
            content: '目标3',
            offset: [6, 40]
          },
          events: {
            click: (MapsEvent) => {
              alert('click marker')
              console.log(MapsEvent)
            }
          }
        }
      ],
      path: []
    }
  },
  methods: {
    searchRoute(result) {
      const temp = {
        path: [
        ]
      }
      let flag = false
      result.routes[0].steps.forEach((p, i) => {
        if (i !== 0) {
          flag = true
        }
        p.path.forEach((pp, index) => {
          if (index !== 0 && flag) {
            temp.path.push([pp.lng, pp.lat])
          }
        })
      })
      console.log(this.path)
      this.path.push(temp)
    },
    initRoute() {
      const vm = this
      const map = this.amapManager.getMap()
      AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], (PathSimplifier) => {
        if (!PathSimplifier.supportCanvas) {
          alert('当前环境不支持 Canvas！')
          return
        }
        // 创建组件实例
        const pathSimplifierIns = new PathSimplifier({
          map: map,
          zIndex: 100, // 图层叠加顺序
          data: vm.path, // 巡航路径
          // 获取巡航路径中的路径坐标数组
          getPath: (pathData, pathIndex) => {
            return pathData.path
          },
          getHoverTitle: function(pathData, pathIndex, pointIndex) {
            if (pointIndex >= 0) {
              // point
              return pointIndex + '/' + pathData.path.length
            }
            return '点数量' + pathData.path.length
          }
        })
        // console.log(vm.path)
        // // 创建巡航器
        // var pathNavigator = pathSimplifierIns.createPathNavigator(0, {
        //   loop: false, // 是否循环
        //   speed: 5000 // 速度(km/h)
        // })
        // pathNavigator.start()
      })
    }
  }
}
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    border: 1px solid #999;
  }
</style>
