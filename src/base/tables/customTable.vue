<template>
	<div class="tactics-table">
		<div class="tactics-head">
			<slot name='table-header'></slot>
		</div>
		<div class="tactics-body">
			<slot name='table-body'></slot>
		</div>
	</div>
</template>

<script type="text/javascript">
	export default{

	}
</script>

<style scoped lang='less'>
	.tactics-table{
		border: 1px solid #e7e7e7;
		font-size: 14px;
		.tactics-head{
			font-weight: 600;
			background-color: #f0f0f0;
			border-bottom: 1px solid #e7e7e7;
		}
	}
</style>