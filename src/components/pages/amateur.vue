<template>
  <div class="row">
    <div class="col-md-12">
      <satellites url="/admin/amateur"/>
    </div>
  </div>
</template>

<script>
import satellites from '@/components/pages/satellites.vue'

export default {
  name: 'amateur',
  components: {satellites}
}
</script>
