<template>
  <div class="row">
    <div class="col-md-12">
      <form style="margin-top: 20px;">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="domain">Domain</label>
              <input type="text" id="domain" class="form-control" required="" v-model="ssl.domain">
            </div>
            <div class="checkbox">
              <label>
                <input type="checkbox" v-model="ssl.enabled"> SSL enabled
              </label>
            </div>
            <div class="checkbox">
              <label>
                <input type="checkbox" v-model="ssl.agreeWithToC"> Agree with <a href="https://letsencrypt.org/documents/LE-SA-v1.1.1-August-1-2016.pdf" target="blank">Terms and Conditions</a>
              </label>
            </div>
            <button type="submit" :disabled="running" class="btn btn-primary">Save</button>
          </div>
          <div v-if="running" class="col-md-6">
              <div class="form-group">
                  <ul class="fa-ul" id="sslMessages">
                      <li><i class="fa-li fa"></i><b>Log</b></li>
                      <li v-for="(item, index) in log"><i v-if="running && index === (log.length - 1)" class="fa-li fa fa-circle-o-notch fa-spin"></i>{{ item.message }}</li>
                  </ul>
              </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ssl',
  data () {
    return {
      ssl: {
        domain: 'r2cloud',
        enabled: true,
        agreeWithToC: true
      },
      running: true,
      log: [
        { message: '123' },
        { message: '456' },
        { message: '000' }
      ]
    }
  },
  methods: {
    save: function (event) {
    }
  }
}
</script>
