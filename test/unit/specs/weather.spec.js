import { createLocalVue, mount } from '@vue/test-utils'
import weather from '@/components/pages/weather'
import VeeValidate from 'vee-validate'
import BootstrapVue from 'bootstrap-vue'
import HTTP from '@/components/http.js'
import moxios from 'moxios'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(VeeValidate)

beforeEach(function () {
  moxios.install(HTTP)
})

afterEach(function () {
  moxios.uninstall(HTTP)
})

describe('weather.vue', () => {
  it('load terms', (done) => {
    const wrapper = mount(weather, {
      localVue: localVue,
      mocks: {
        $http: HTTP
      },
      sync: false
    })
    expect(wrapper.find('.fa-cog').exists()).equal(true)
    moxios.wait(function () {
      let request = moxios.requests.mostRecent()
      request.respondWith({
        status: 200,
        response: {
          satellites: [],
          enabled: false
        }
      }).then(function () {
        expect(wrapper.find('.fa-cog').exists()).equal(false)
        expect(wrapper.find('[name="agreeWithToC"]').exists()).equal(true)
        done()
      })
    })
  })
  it('load satellites', (done) => {
    const wrapper = mount(weather, {
      localVue: localVue,
      mocks: {
        $http: HTTP
      },
      sync: false
    })
    expect(wrapper.find('.fa-cog').exists()).equal(true)
    moxios.wait(function () {
      let request = moxios.requests.mostRecent()
      request.respondWith({
        status: 200,
        response: {
          satellites: [{
            id: 40069,
            name: 'METEOR-M 2'
          }],
          enabled: true
        }
      }).then(function () {
        expect(wrapper.find('.fa-cog').exists()).equal(false)
        expect(wrapper.find('.nav-link').text()).equal('METEOR-M 2')
        expect(wrapper.find('.table tbody tr').exists()).equal(false)
        done()
      })
    })
  })
})
