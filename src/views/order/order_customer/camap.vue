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
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      this.pathPlanning()
    },
    pathPlanning() {
      const self = this
      const Driving = new AMap.Driving({
        hideMarkers: true,
        showTraffic: false,
        isOutline: true
      })
      Driving.search([117.031803, 32.622703], [116.342058, 32.614061], (status, result) => {
        if (status === 'complete') {
          self.searchRoute(result)
        } else {
          console.log('获取驾车数据失败')
        }
      })
      setTimeout(() => {
        self.initRoute()
        self.loaded = false
      }, 800)
      // 页面渲染好后
      self.$nextTick()
    },
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
