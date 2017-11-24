import Vue from 'vue'
import setup from '@/components/pages/setup'

describe('setup.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(setup)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('legend').innerText)
      .to.equal('Setup')
  })
})
