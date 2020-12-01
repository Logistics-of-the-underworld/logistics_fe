<template>
  <amap
    v-if="sonRefresh"
    :markers.sync="markers"
    :path.sync="path"
    :start.sync="start"
    :end.sync="end"
    @searchRoute="searchRoute"
  />
</template>

<script>
import amap from '../../components/map/amap'
export default {
  name: 'RoutePage',
  components: {
    amap
  },
  data() {
    return {
      sonRefresh: true,
      path: [
      ],
      start: [
        [107.165388, 34.313259],
        [121.5273285, 31.21515044],
        [116.342058, 32.614061]
      ],
      end: [
        [103.355992, 34.64531],
        [120.5273285, 31.21515044],
        [117.031803, 32.622703]
      ],
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
        },
        {
          position: [107.165388, 34.313259],
          visible: true,
          draggable: false,
          offset: [0, 0],
          label: {
            content: '目标1',
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
          position: [103.355992, 34.64531],
          visible: true,
          draggable: false,
          offset: [0, 0],
          label: {
            content: '目标2',
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
          position: [121.5273285, 31.21515044],
          visible: true,
          draggable: false,
          offset: [0, 0],
          label: {
            content: '收货地',
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
          position: [120.5273285, 31.21515044],
          visible: true,
          draggable: false,
          offset: [0, 0],
          label: {
            content: '发货地',
            offset: [6, 40]
          },
          events: {
            click: (MapsEvent) => {
              alert('click marker')
              console.log(MapsEvent)
            }
          }
        }
      ]
    }
  },
  methods: {
    searchRoute({ result, index }) {
      let flag = false
      let temp = {
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

</style>
npm
