<template>
	<ul class="list-group list-group-flush text-secondary" v-if="rotator.status === 'DISABLED'">
		<li class="list-group-item">Rotator: {{ rotator.status }}</li>
	</ul>
	<ul class="list-group list-group-flush text-success" v-else-if="rotator.status === 'CONNECTED'">
		<li class="list-group-item">Rotator: {{ rotator.status }}</li>
		<li class="list-group-item">Rotator model: {{ rotator.model }}</li>
		<li class="list-group-item">Rotator connection: {{ rotator.connection }}</li>
	</ul>
	<ul class="list-group list-group-flush text-danger" v-else="rotator.status === 'FAILED'">
		<li class="list-group-item">Rotator: {{ rotator.status }}</li>
		<li class="list-group-item">Rotator failure: {{ rotator.failureMessage }}</li>
		<li class="list-group-item">Rotator connection: {{ rotator.connection }}</li>
	</ul>
</template>

<script>

export default {
  name: 'rotator',
  props: ['rotator']
}

</script>