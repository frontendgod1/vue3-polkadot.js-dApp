<template>
  <div class="loading" />
</template>

<style>
.loading {
  display: inline-block;
  width: 25px;
  height: 25px;
  border: 3px solid #ff8c00;
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
