import { createLocalVue, shallowMount } from '@vue/test-utils'
import setup from '@/components/pages/setup/setup'
import VeeValidate from 'vee-validate'
import BootstrapVue from 'bootstrap-vue'
import flushPromises from 'flush-promises'

const localVue = createLocalVue()
localVue.use(VeeValidate)
localVue.use(BootstrapVue)

function expectInvalid (wrapper, inputName) {
  expect(wrapper.find(inputName).classes()).to.include('is-invalid')
}

describe('setup.vue', () => {
  it('validate inputs', async () => {
    const wrapper = shallowMount(setup, { localVue })
    expect(wrapper.find('[name="keyword"]').classes()).to.not.include('is-invalid')
    wrapper.find('form').trigger('submit')
    await flushPromises()
    expectInvalid(wrapper, '[name="keyword"]')
    expectInvalid(wrapper, '[name="username"]')
    expectInvalid(wrapper, '[name="password"]')
  })
})
