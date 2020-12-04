<template>
  <div style="width:100%;height:800px;">
    <div v-loading="loaded" class="container">
      <el-amap-search-box
        class="search-box"
        :search-option="searchOption"
        :on-search-result="onSearchResult"
      />
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
        :vid="'amap-vue'"
        :zoom="zoom"
        :plugin="plugin"
        :center="center"
        map-style="light"
        :events="events"
      >
        <!-- 标记 -->
        <el-amap-marker
          v-for="(marker, index) in amap_marksers"
          :key="index"
          :vid="index"
          :position="marker.position"
          :visible="marker.visible"
          :draggable="marker.draggable"
          :offset="marker.offset"
          :events="marker.events"
        />
        <!-- 标记文本 -->
        <el-amap-text
          v-for="(text,index) in amap_marksers"
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
import { getRoadMap } from '../../api/route'

const amapManager = new AMapManager()
export default {
  name: 'RoutePage',
  data() {
    const self = this
    return {
      sonRefresh: true,
      address: null,
      searchKey: '',
      amapManager,
      searchOption: {
        city: '全国',
        citylimit: true
      },
      center: [121.5273285, 31.21515044],
      zoom: 5,
      lng: 0,
      lat: 0,
      loaded: true,
      events: {
        init() {
          lazyAMapApiLoaderInstance.load().then(() => {
            // self.initSearch()
          })
        },
        // 点击获取地址的数据
        click(e) {
          const { lng, lat } = e.lnglat
          self.lng = lng
          self.lat = lat
          self.center = [lng, lat]
          // 这里通过高德 SDK 完成。
          const geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: 'all'
          })
          geocoder.getAddress([lng, lat], function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                self.address = result.regeocode.formattedAddress
                self.searchKey = result.regeocode.formattedAddress
                const mark = {
                  position: self.center,
                  visible: true,
                  draggable: false,
                  offset: [0, 0],
                  label: {
                    content: self.address,
                    offset: [6, 40]
                  }
                }
                const newMarkers = []
                newMarkers.push(mark)
                self.amap_marksers = newMarkers
                self.$nextTick()
              }
            }
          })
        }
      },
      // 一些工具插件
      plugin: [
        {
          pName: 'Driving',
          events: {
            init(o) {
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
          // 定位
          pName: 'Geolocation',
          events: {
            init(o) {
              // o是高德地图定位插件实例
              o.getCityInfo((status, result) => {
                if (result && result.center) {
                  // 设置经度
                  self.lng = result.center[0]
                  // 设置维度
                  self.lat = result.center[1]
                  // 设置坐标
                  self.center = result.center
                  const mark = {
                    position: result.center,
                    visible: true,
                    draggable: false,
                    offset: [0, 0],
                    label: {
                      content: result.city,
                      offset: [6, 40]
                    },
                    events: {
                      click: (MapsEvent) => {
                        alert('click marker')
                      }
                    }
                  }
                  const newMarkers = self.amap_marksers
                  newMarkers.push(mark)
                  self.amap_marksers = newMarkers
                  // 页面渲染好后
                  self.$nextTick()
                }
              })
            }
          }
        },
        {
          // 工具栏
          pName: 'ToolBar',
          events: {
            init(instance) {
            }
          }
        },
        {
          // 鹰眼
          pName: 'OverView',
          events: {
            init(instance) {
            }
          }
        },
        {
          // 地图类型
          pName: 'MapType',
          defaultType: 0,
          events: {
            init(instance) {
            }
          }
        }
      ],
      path: [],
      start: [
      ],
      end: [
      ],
      markers: [
      ]
    }
  },
  computed: {
    amap_marksers: {
      get() {
        return this.markers
      },
      set(newVal) {
        this.markers = newVal
      }
    },
    amap_path: {
      get() {
        return this.path
      },
      set(newVal) {
        this.path = newVal
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      await getRoadMap().then(res => {
        res.data.forEach((item, index) => {
          console.log(item)
          const s = []
          s.push(item.startLongitude)
          s.push(item.startLatitude)
          this.start.push(s)
          let tempStart = {
            position: s,
            visible: true,
            draggable: false,
            offset: [-10, -25],
            label: {
              content: item.startDistribution,
              offset: [6, 40]
            },
            events: {
              click: (MapsEvent) => {
                alert('click marker')
              }
            }
          }
          this.markers.push(tempStart)
          const e = []
          e.push(item.endLongitude)
          e.push(item.endLatitude)
          this.end.push(e)
          let tempEnd = {
            position: e,
            visible: true,
            draggable: false,
            offset: [-10, -25],
            label: {
              content: item.endDistribution,
              offset: [6, 40]
            },
            events: {
              click: (MapsEvent) => {
                alert('click marker')
              }
            }
          }
          this.markers.push(tempEnd)
        })
      })
      this.pathPlanning()
    },
    onSearchResult(pois) {
      const vm = this
      let latSum = 0
      let lngSum = 0
      if (pois.length > 0) {
        pois.forEach(poi => {
          const { lng, lat } = poi
          lngSum += lng
          latSum += lat
          const mark = {
            position: [poi.lng, poi.lat],
            visible: true,
            draggable: false,
            offset: [0, 0],
            label: {
              content: poi.address,
              offset: [0, -10]
            },
            events: {
              click: (MapsEvent) => {
                alert('click marker')
              }
            }
          }
          vm.amap_marksers.push(mark)
        })
        const center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        }
        this.center = [center.lng, center.lat]
      }
    },
    pathPlanning() {
      const self = this
      const Driving = new AMap.Driving({
        hideMarkers: true,
        showTraffic: false,
        isOutline: true
      })
      self.start.forEach((s, index) => {
        Driving.search(new AMap.LngLat(s[0], s[1]), new AMap.LngLat(self.end[index][0], self.end[index][1]), (status, result) => {
          // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
          if (status === 'complete') {
            self.searchRoute(result)
          } else {
            console.log('获取驾车数据失败')
          }
        })
      })
      setTimeout(() => {
        self.initRoute()
        self.loaded = false
      }, 1000)
      // 页面渲染好后
      self.$nextTick()
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
          }
        })
      })
    },
    searchRoute(result) {
      let flag = false
      const temp = {
        path: [
        ]
      }
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
  .search-box {
    position: absolute;
    z-index: 5;
    width: 30%;
    left: 13%;
    top: 10px;
    height: 30px;
  }
</style>
npm
