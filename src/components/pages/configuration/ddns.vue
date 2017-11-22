<template>
  <div class="row">
    <div class="col-md-12">
      <form style="margin-top: 20px;">
        <div class="form-group">
          <label for="ddnsType">Type</label>
          <select class="form-control" id="ddnsType" v-model="ddns.type">
            <option value="NONE">NONE</option>
            <option value="NOIP">NOIP</option>
          </select>
        </div>
        <div v-if="ddns.type === 'NONE'">
        </div>
        <div v-if="ddns.type === 'NOIP'">
          <div class="form-group">
            <label for="username">User name</label>
            <input type="text" id="username" class="form-control" required="" v-model="ddns.username">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" class="form-control" required="" v-model="ddns.password">
          </div>
          <div class="form-group">
            <label for="domain">Domain</label>
            <input type="text" id="domain" class="form-control" required="" v-model="ddns.domain">
          </div>
          <div class="form-group">
            <label for="currentIp">Current IP</label>
            <input type="text" id="currentIp" class="form-control" disabled v-model="ddns.currentIp">
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Save</button>               
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ddns',
  data () {
    return {
      ddns: {
        type: 'NONE',
        username: 'test',
        password: '123',
        domain: 'r2cloud',
        currentIp: '123.123.123.123'
      }
    }
  },
  methods: {
    save: function (event) {
    }
  }
}
</script>
